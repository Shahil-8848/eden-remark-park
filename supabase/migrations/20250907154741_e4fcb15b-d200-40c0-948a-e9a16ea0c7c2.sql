-- Add teacher-class assignments table to manage which teachers can teach which classes
CREATE TABLE public.teacher_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  class_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, class_id)
);

-- Enable RLS
ALTER TABLE public.teacher_classes ENABLE ROW LEVEL SECURITY;

-- Create policies for teacher_classes
CREATE POLICY "Users can view teacher class assignments" 
ON public.teacher_classes 
FOR SELECT 
USING (true);

CREATE POLICY "Admins and principals can manage teacher assignments" 
ON public.teacher_classes 
FOR ALL 
USING (get_user_role(auth.uid()) = ANY (ARRAY['admin'::app_role, 'principal'::app_role]));

-- Insert some sample teacher-class assignments
-- First get the class IDs and user IDs for sample data
DO $$
DECLARE
    class_10_id UUID;
    class_11_id UUID;
    class_12_id UUID;
    teacher_user_id UUID;
BEGIN
    -- Get class IDs
    SELECT id INTO class_10_id FROM public.classes WHERE number = 10 LIMIT 1;
    SELECT id INTO class_11_id FROM public.classes WHERE number = 11 LIMIT 1;
    SELECT id INTO class_12_id FROM public.classes WHERE number = 12 LIMIT 1;
    
    -- Get a sample teacher user ID (first user with teacher role)
    SELECT user_id INTO teacher_user_id FROM public.profiles WHERE role = 'teacher' LIMIT 1;
    
    -- Insert sample assignments if we have the required data
    IF class_10_id IS NOT NULL AND teacher_user_id IS NOT NULL THEN
        INSERT INTO public.teacher_classes (teacher_id, class_id) 
        VALUES (teacher_user_id, class_10_id);
    END IF;
    
    IF class_11_id IS NOT NULL AND teacher_user_id IS NOT NULL THEN
        INSERT INTO public.teacher_classes (teacher_id, class_id) 
        VALUES (teacher_user_id, class_11_id);
    END IF;
END $$;