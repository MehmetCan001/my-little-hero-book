-- Create RLS policies for story_original_images table
ALTER TABLE public.story_original_images ENABLE ROW LEVEL SECURITY;

-- Users can view their own story original images
CREATE POLICY "Users can view their story original images" 
ON public.story_original_images 
FOR SELECT 
USING (auth.uid() = (
  SELECT stories.user_id 
  FROM stories 
  WHERE stories.id = story_original_images.story_id
));

-- Users can insert original images for their own stories
CREATE POLICY "Users can insert their story original images" 
ON public.story_original_images 
FOR INSERT 
WITH CHECK (auth.uid() = (
  SELECT stories.user_id 
  FROM stories 
  WHERE stories.id = story_original_images.story_id
));

-- Users can delete their own story original images
CREATE POLICY "Users can delete their story original images" 
ON public.story_original_images 
FOR DELETE 
USING (auth.uid() = (
  SELECT stories.user_id 
  FROM stories 
  WHERE stories.id = story_original_images.story_id
));