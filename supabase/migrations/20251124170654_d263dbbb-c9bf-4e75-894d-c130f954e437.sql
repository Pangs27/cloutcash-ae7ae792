-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('creator', 'brand', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only service role can manage roles
CREATE POLICY "Service role manages roles"
ON public.user_roles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Migrate existing user_type data to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, user_type::app_role
FROM public.profiles
WHERE user_type IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Update profiles table: make user_type read-only by removing UPDATE policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new UPDATE policy that excludes user_type
CREATE POLICY "Users can update their own profile (except user_type)"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  -- Prevent updating user_type by ensuring it hasn't changed
  user_type = (SELECT user_type FROM public.profiles WHERE user_id = auth.uid())
);

-- Update campaigns RLS policies to use has_role()
DROP POLICY IF EXISTS "Brands can create campaigns" ON public.campaigns;
CREATE POLICY "Brands can create campaigns"
ON public.campaigns FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'brand') AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND id = campaigns.brand_id
  )
);

DROP POLICY IF EXISTS "Brands can update their campaigns" ON public.campaigns;
CREATE POLICY "Brands can update their campaigns"
ON public.campaigns FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'brand') AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND id = campaigns.brand_id
  )
);

DROP POLICY IF EXISTS "Creators can update campaigns they're assigned to" ON public.campaigns;
CREATE POLICY "Creators can update campaigns they're assigned to"
ON public.campaigns FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'creator') AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND id = campaigns.creator_id
  )
);

-- Update handle_new_user function to assign role to user_roles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  _user_type text;
BEGIN
  _user_type := COALESCE(NEW.raw_user_meta_data->>'user_type', 'creator');
  
  -- Insert into profiles
  INSERT INTO public.profiles (user_id, email, full_name, user_type, handle)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    _user_type,
    COALESCE(NEW.raw_user_meta_data->>'handle', '')
  );
  
  -- Insert role into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _user_type::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$function$;