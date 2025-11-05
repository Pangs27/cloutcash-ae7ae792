import { useCallback } from 'react';
import { InteractionType } from '@/types/matchmaking';
import { mockApi } from '@/lib/mockApi';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export function useFeedback() {
  const { user } = useAuth();

  const recordFeedback = useCallback(async (
    targetId: string,
    type: InteractionType
  ) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in',
        variant: 'destructive'
      });
      return;
    }

    try {
      await mockApi.recordInteraction(user.id, targetId, type);
      
      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', `swipe_${type}`, {
          user_id: user.id,
          target_id: targetId
        });
      }

      if (type === 'like' || type === 'superlike') {
        toast({
          title: type === 'superlike' ? '⭐ Super Like!' : '❤️ Liked',
          description: 'Match saved to your preferences'
        });
      }
    } catch (error) {
      console.error('Error recording feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your action',
        variant: 'destructive'
      });
    }
  }, [user]);

  return { recordFeedback };
}
