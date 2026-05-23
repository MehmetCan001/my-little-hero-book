import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useStoryCreation } from '@/contexts/StoryCreationContext';
import { useImageStyles } from '@/hooks/useImageStyles';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PhotoUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PhotoUploadModal = ({ open, onOpenChange }: PhotoUploadModalProps) => {
  const { updatePhotoUrl, updateImageStyle, nextStep } = useStoryCreation();
  const { toast } = useToast();
  const { imageStyles, loading: stylesLoading, error: stylesError } = useImageStyles();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImageStyle, setSelectedImageStyle] = useState<string>('');
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleFileSelection(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const handleFileSelection = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setIsDragActive(false);
  };

  const handleUpload = async () => {
    if (selectedFile && selectedImageStyle) {
      const selectedStyle = imageStyles.find(style => style.id === selectedImageStyle);
      if (selectedStyle) {
        try {
          // Convert file to base64
          const base64String = await convertFileToBase64(selectedFile);
          
          updatePhotoUrl(base64String);
          updateImageStyle({
            id: selectedStyle.id,
            name: selectedStyle.name,
            label: selectedStyle.label
          });
          nextStep();
          onOpenChange(false);
          
          toast({
            title: "Photo uploaded successfully!",
            description: "Your child's photo and style preference have been saved.",
          });
        } catch (error) {
          toast({
            title: "Upload failed",
            description: "Failed to process the image. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setSelectedImageStyle('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-button text-white shadow-button">
              <Camera className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-semibold">Upload Photo</DialogTitle>
          </div>
          <DialogDescription>
            Upload your child's photo to make them the hero of their own story, then choose an art style.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            {selectedFile ? (
              <div className="space-y-6">
                <div className="relative">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected photo"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    onClick={handleRemovePhoto}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="image-style" className="text-sm font-medium">
                    Choose Art Style *
                  </Label>
                  <Select
                    value={selectedImageStyle}
                    onValueChange={setSelectedImageStyle}
                    disabled={stylesLoading}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:shadow-magical">
                      <SelectValue placeholder={
                        stylesLoading ? "Loading art styles..." : 
                        stylesError ? "Error loading styles" :
                        "Select art style for your story"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {imageStyles.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          <div className="space-y-1">
                            <p className="font-medium">{style.label}</p>
                            <p className="text-xs text-muted-foreground">{style.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <p className="text-sm text-muted-foreground text-center">
                  Perfect! Your child will be the star of this magical adventure.
                </p>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : 'border-muted hover:border-primary/50 hover:bg-accent/10'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 rounded-full bg-gradient-accent text-white shadow-button">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Upload Photo</h3>
                    <p className="text-sm text-muted-foreground">
                      {isDragActive 
                        ? 'Drop the photo here...' 
                        : 'Drag & drop your child\'s photo here, or click to select'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports JPG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={!selectedImageStyle}
                className="flex-1 bg-gradient-button hover:shadow-button text-white font-medium transition-all duration-300 disabled:opacity-50"
              >
                Save & Continue
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};