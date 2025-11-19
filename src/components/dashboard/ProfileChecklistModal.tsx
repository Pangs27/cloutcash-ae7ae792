import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileCompletionResult } from "@/lib/profileCompletion";

interface ProfileChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completionData: ProfileCompletionResult;
  userType: string;
}

const stepMap: Record<string, string> = {
  "Email verified": "email",
  "Name and city": "name-city",
  "At least 2 niches": "niches",
  "Sector and niches": "niches",
  "Social handle": "handle",
  "Follower bracket": "followers",
  "Target follower brackets": "followers",
  "Engagement rate": "engagement",
  "At least 1 media sample": "media",
  "At least 1 creative": "media",
  "Bio (120+ characters)": "bio",
  "Brief (60+ characters)": "bio",
  "Short bio": "bio",
  "Profile avatar": "avatar",
  "Name and website": "name-city",
  "Monthly marketing budget": "budget",
  "City/location": "name-city",
  "Campaign objective": "goal",
};

export function ProfileChecklistModal({
  open,
  onOpenChange,
  completionData,
  userType,
}: ProfileChecklistModalProps) {
  const navigate = useNavigate();

  const handleItemClick = (label: string, completed: boolean) => {
    if (completed) return;
    const step = stepMap[label];
    if (step) {
      navigate(`/profile-setup?step=${step}`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Completion Checklist</DialogTitle>
          <DialogDescription>
            Complete these items to unlock better matches as a {userType}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 mt-4">
          {completionData.checklist.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(item.label, item.completed)}
              className={`flex items-center justify-between gap-3 p-3 rounded-lg border transition-all ${
                item.completed
                  ? "bg-primary/5 border-primary/20 cursor-default"
                  : "bg-card border-border hover:border-primary/40 cursor-pointer hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span
                  className={
                    item.completed
                      ? "text-sm font-medium"
                      : "text-sm text-muted-foreground"
                  }
                >
                  {item.label}
                </span>
              </div>
              {!item.completed && (
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  Complete
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-center">
            <span className="font-bold text-lg text-primary">
              {completionData.percentage}%
            </span>{" "}
            complete
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
