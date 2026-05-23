import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayCircle, User, Palette, Camera, Globe, Brush, Loader2, AlertCircle, FileText, CreditCard } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStoryCreation } from "@/contexts/StoryCreationContext";

interface ReviewStoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReviewStoryModal = ({ open, onOpenChange }: ReviewStoryModalProps) => {
  const { state, createStory } = useStoryCreation();

  const handleCreateStory = async () => {
    await createStory();
    if (state.isComplete && !state.error) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-hero bg-clip-text text-transparent">
            Review Your Story
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Story Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Child's Information</p>
                <p className="font-medium">{state.childInfo?.name}, {state.childInfo?.age} years old</p>
                {state.childInfo?.gender && (
                  <p className="text-xs text-muted-foreground capitalize">{state.childInfo.gender.replace('-', ' ')}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Globe className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Story Language</p>
                <p className="font-medium">{state.language?.name}</p>
              </div>
            </div>

            {state.selectedPlan && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <CreditCard className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Paket</p>
                  <p className="font-medium">
                    {state.selectedPlan.name} — {state.selectedPlan.pageCount} sayfa
                  </p>
                </div>
                <div className="text-right">
                  {state.selectedPlan.price === 0 ? (
                    <span className="text-sm font-bold text-green-600">Ücretsiz</span>
                  ) : (
                    <span className="text-sm font-bold">₺{state.selectedPlan.price}</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-accent/10 rounded-full">
                <Palette className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Story Theme</p>
                <p className="font-medium">{state.theme?.charAt(0).toUpperCase()}{state.theme?.slice(1)} Adventure</p>
              </div>
            </div>

            {state.prompt && (
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="p-2 bg-orange-500/10 rounded-full">
                  <FileText className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Custom Prompt</p>
                  <p className="font-medium text-sm">{state.prompt}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-success/10 rounded-full">
                <Camera className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Child's Photo</p>
                <p className="font-medium">Photo uploaded ✓</p>
              </div>
              {state.photoUrl && (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                  <img 
                    src={state.photoUrl} 
                    alt="Child's photo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Brush className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Art Style</p>
                <p className="font-medium">{state.imageStyle?.label}</p>
              </div>
            </div>
          </div>

          {state.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {/* Create Story Button */}
          <Button 
            onClick={handleCreateStory}
            className="w-full bg-gradient-button hover:shadow-button text-white font-medium py-3 rounded-full transition-all duration-300 hover:-translate-y-1"
            size="lg"
            disabled={state.loading}
          >
            {state.loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Story...
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5 mr-2" />
                Create Story
              </>
            )}
          </Button>
          
          {state.loading ? (
            <p className="text-xs text-center text-muted-foreground">
              Starting AI generation process...
            </p>
          ) : (
            <p className="text-xs text-center text-muted-foreground">
              This will create a personalized adventure story for {state.childInfo?.name}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};