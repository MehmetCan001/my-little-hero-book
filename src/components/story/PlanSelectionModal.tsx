import { useState } from 'react';
import { Check, Crown, Star, Zap, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStoryCreation, TIER_PLANS, TierPlan, TierType } from '@/contexts/StoryCreationContext';

interface PlanSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tierIcons: Record<TierType, React.ReactNode> = {
  free: <Gift className="w-5 h-5" />,
  starter: <Zap className="w-5 h-5" />,
  premium: <Star className="w-5 h-5" />,
  pro: <Crown className="w-5 h-5" />,
};

const tierColors: Record<TierType, string> = {
  free:    'border-muted bg-muted/20',
  starter: 'border-blue-400 bg-blue-50/30 dark:bg-blue-950/20',
  premium: 'border-purple-500 bg-purple-50/30 dark:bg-purple-950/20',
  pro:     'border-amber-500 bg-amber-50/30 dark:bg-amber-950/20',
};

const tierSelectedColors: Record<TierType, string> = {
  free:    'border-foreground ring-2 ring-foreground/30',
  starter: 'border-blue-500 ring-2 ring-blue-400/40',
  premium: 'border-purple-600 ring-2 ring-purple-500/40',
  pro:     'border-amber-600 ring-2 ring-amber-500/40',
};

const tierIconBg: Record<TierType, string> = {
  free:    'bg-muted text-muted-foreground',
  starter: 'bg-blue-500 text-white',
  premium: 'bg-purple-600 text-white',
  pro:     'bg-amber-500 text-white',
};

const tierButtonColor: Record<TierType, string> = {
  free:    'bg-foreground text-background hover:bg-foreground/90',
  starter: 'bg-blue-500 text-white hover:bg-blue-600',
  premium: 'bg-purple-600 text-white hover:bg-purple-700',
  pro:     'bg-amber-500 text-white hover:bg-amber-600',
};

export const PlanSelectionModal = ({ open, onOpenChange }: PlanSelectionModalProps) => {
  const { updateSelectedPlan, nextStep } = useStoryCreation();
  const [selected, setSelected] = useState<TierType>('free');

  const selectedPlan = TIER_PLANS.find(p => p.id === selected)!;

  const handleConfirm = () => {
    updateSelectedPlan(selectedPlan);
    nextStep();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">Paket Seçin</DialogTitle>
          <DialogDescription>
            Hikayeniz için en uygun paketi seçin. Daha fazla sayfa ve yüksek kalite için premium paketleri tercih edin.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {TIER_PLANS.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`relative text-left rounded-xl border-2 p-4 transition-all duration-200 ${
                  isSelected ? tierSelectedColors[plan.id] : tierColors[plan.id]
                } hover:scale-[1.01]`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-3 text-xs font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-full ${tierIconBg[plan.id]}`}>
                    {tierIcons[plan.id]}
                  </div>
                  <div>
                    <p className="font-bold text-base">{plan.name}</p>
                    <p className="text-sm text-muted-foreground">{plan.pageCount} sayfa</p>
                  </div>
                  <div className="ml-auto text-right">
                    {plan.price === 0 ? (
                      <p className="text-lg font-bold text-green-600">Ücretsiz</p>
                    ) : (
                      <p className="text-lg font-bold">₺{plan.price}</p>
                    )}
                  </div>
                </div>

                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            İptal
          </Button>
          <Button
            onClick={handleConfirm}
            className={`flex-1 text-white font-medium transition-all duration-200 ${tierButtonColor[selected]}`}
          >
            {selectedPlan.price === 0
              ? 'Ücretsiz Devam Et'
              : `₺${selectedPlan.price} ile Devam Et`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
