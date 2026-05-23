import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookOpen } from 'lucide-react';
import { useStoryCreation, ChildInfo } from '@/contexts/StoryCreationContext';
import { useLanguages } from '@/hooks/useLanguages';

const childInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  age: z.number().min(2, 'Age must be at least 2').max(10, 'Age must be at most 10'),
  gender: z.enum(['male', 'female', 'prefer-not-to-say']).optional(),
  languageId: z.string().min(1, 'Please select a language'),
});

type ChildInfoForm = z.infer<typeof childInfoSchema>;

interface ChildInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChildInfoModal = ({ open, onOpenChange }: ChildInfoModalProps) => {
  const { state, updateChildInfo, updateLanguage, nextStep } = useStoryCreation();
  const { languages, loading: languagesLoading } = useLanguages();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ChildInfoForm>({
    resolver: zodResolver(childInfoSchema),
    defaultValues: {
      name: state.childInfo?.name || '',
      age: state.childInfo?.age || undefined,
      gender: state.childInfo?.gender || undefined,
      languageId: state.language?.id || '',
    },
  });

  const onSubmit = async (data: ChildInfoForm) => {
    setIsSubmitting(true);
    try {
      const childInfo: ChildInfo = {
        name: data.name,
        age: data.age,
        gender: data.gender,
      };
      
      const selectedLanguage = languages.find(lang => lang.id === data.languageId);
      if (selectedLanguage) {
        updateLanguage(selectedLanguage);
      }
      
      updateChildInfo(childInfo);
      nextStep();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving child info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate age options from 2 to 10
  const ageOptions = Array.from({ length: 9 }, (_, i) => i + 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-button text-white shadow-button">
              <BookOpen className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-semibold">Child's Information</DialogTitle>
          </div>
          <DialogDescription>
            Tell us about the hero of this story! This information will help us create a personalized adventure.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Child's Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your child's name"
                      {...field}
                      className="transition-all duration-200 focus:shadow-magical"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="transition-all duration-200 focus:shadow-magical">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ageOptions.map((age) => (
                        <SelectItem key={age} value={age.toString()}>
                          {age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Language *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={languagesLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="transition-all duration-200 focus:shadow-magical">
                        <SelectValue placeholder={languagesLoading ? "Loading..." : "Select language"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.id} value={language.id}>
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender (Optional)</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <label htmlFor="male" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                          Male
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <label htmlFor="female" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                          Female
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                        <label htmlFor="prefer-not-to-say" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                          Prefer not to say
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-button hover:shadow-button text-white font-medium transition-all duration-300"
              >
                {isSubmitting ? 'Saving...' : 'Save & Continue'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};