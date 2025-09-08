-- First, let me fix the user approval system
-- Add approval status to profiles table
ALTER TABLE public.profiles ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Update the handle_new_user function to set pending status by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role, approval_status)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'teacher', -- Default to teacher, admin will assign roles
    'pending' -- All new users start as pending
  );
  RETURN NEW;
END;
$function$;

-- Update RLS policies to respect approval status
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view approved profiles and own profile" 
ON public.profiles 
FOR SELECT 
USING (approval_status = 'approved' OR auth.uid() = user_id);

-- Add policy for admins to manage profiles
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin');

-- Create Section B classes for classes 6-11
INSERT INTO public.classes (number, section) VALUES
(6, 'B'),
(7, 'B'),
(8, 'B'),
(9, 'B'),
(10, 'B'),
(11, 'B');