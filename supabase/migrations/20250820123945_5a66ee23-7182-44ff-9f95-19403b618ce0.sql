-- Add RLS policies for pages table
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Users can view pages of their stories
CREATE POLICY "Users can view pages of their stories"
ON pages
FOR SELECT
USING (
  auth.uid() = (
    SELECT user_id 
    FROM stories 
    WHERE stories.id = pages.story_id
  )
);

-- Users can insert pages for their stories
CREATE POLICY "Users can insert pages for their stories"
ON pages
FOR INSERT
WITH CHECK (
  auth.uid() = (
    SELECT user_id 
    FROM stories 
    WHERE stories.id = pages.story_id
  )
);

-- Users can update pages of their stories
CREATE POLICY "Users can update pages of their stories"
ON pages
FOR UPDATE
USING (
  auth.uid() = (
    SELECT user_id 
    FROM stories 
    WHERE stories.id = pages.story_id
  )
);

-- Users can delete pages of their stories
CREATE POLICY "Users can delete pages of their stories"
ON pages
FOR DELETE
USING (
  auth.uid() = (
    SELECT user_id 
    FROM stories 
    WHERE stories.id = pages.story_id
  )
);