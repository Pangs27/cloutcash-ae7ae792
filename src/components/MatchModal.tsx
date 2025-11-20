import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Lock, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchProfile: {
    id?: string;
    name: string;
    avatar: string;
    niche: string;
  };
}

export function MatchModal({ isOpen, onClose, matchProfile }: MatchModalProps) {
  const navigate = useNavigate();
  
  const showPremiumToast = () => {
    toast({
      title: '🔒 Premium Feature',
      description: 'Chat is available in the Premium Plan. Upgrade to start conversations with your matches.',
      duration: 4000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-in zoom-in-95 duration-300">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            <div className="flex items-center justify-center gap-2 mb-4 animate-in bounce-in-0 duration-500">
              <Heart className="w-8 h-8 text-primary fill-primary animate-pulse drop-shadow-[0_0_8px_rgba(230,57,70,0.6)]" />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent drop-shadow-lg">
                It's a Match!
              </span>
              <Heart className="w-8 h-8 text-primary fill-primary animate-pulse drop-shadow-[0_0_8px_rgba(230,57,70,0.6)]" />
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150">
          <img 
            src={matchProfile.avatar} 
            alt={matchProfile.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-[0_0_20px_rgba(230,57,70,0.4)] animate-in zoom-in-0 duration-500 delay-300"
          />
          
          <div className="text-center">
            <h3 className="text-xl font-semibold">{matchProfile.name}</h3>
            <Badge variant="secondary" className="mt-2">{matchProfile.niche}</Badge>
          </div>

          <p className="text-sm text-muted-foreground text-center px-4">
            You both liked each other! Start a conversation to explore collaboration opportunities.
          </p>

          <div className="flex flex-col gap-2 w-full mt-4">
            <Button 
              onClick={showPremiumToast}
              className="w-full relative bg-muted hover:bg-muted/80 text-foreground"
            >
              <Lock className="w-4 h-4 mr-2" />
              Start Chat
              <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">
                Premium
              </Badge>
            </Button>
            
            {matchProfile.id && (
              <Button 
                variant="outline" 
                onClick={() => {
                  navigate(`/profile/${matchProfile.id}`);
                  onClose();
                }}
                className="w-full gap-2"
              >
                <Eye className="w-4 h-4" />
                View Profile
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Keep Swiping
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-2">
            💎 Upgrade to Premium to unlock chat and advanced features
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
