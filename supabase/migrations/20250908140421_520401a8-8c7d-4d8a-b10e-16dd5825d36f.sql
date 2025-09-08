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

-- Add more students with Section B and Nepali names
INSERT INTO public.students (name, roll_number, class_id) VALUES
-- Class 6 Section B
('Aarav Sharma', 'R6B01', (SELECT id FROM classes WHERE number = 6 AND section = 'B')),
('Anaya Gurung', 'R6B02', (SELECT id FROM classes WHERE number = 6 AND section = 'B')),
('Arjun Thapa', 'R6B03', (SELECT id FROM classes WHERE number = 6 AND section = 'B')),
('Ishika Rai', 'R6B04', (SELECT id FROM classes WHERE number = 6 AND section = 'B')),
('Rohan Pandey', 'R6B05', (SELECT id FROM classes WHERE number = 6 AND section = 'B')),

-- Class 7 Section B
('Sita Karki', 'R7B01', (SELECT id FROM classes WHERE number = 7 AND section = 'B')),
('Ganga Tamang', 'R7B02', (SELECT id FROM classes WHERE number = 7 AND section = 'B')),
('Krishna Bhusal', 'R7B03', (SELECT id FROM classes WHERE number = 7 AND section = 'B')),
('Radha Magar', 'R7B04', (SELECT id FROM classes WHERE number = 7 AND section = 'B')),
('Bishal Limbu', 'R7B05', (SELECT id FROM classes WHERE number = 7 AND section = 'B')),

-- Class 8 Section B
('Prakriti Shrestha', 'R8B01', (SELECT id FROM classes WHERE number = 8 AND section = 'B')),
('Santosh Neupane', 'R8B02', (SELECT id FROM classes WHERE number = 8 AND section = 'B')),
('Manjita Ghimire', 'R8B03', (SELECT id FROM classes WHERE number = 8 AND section = 'B')),
('Dipak Rana', 'R8B04', (SELECT id FROM classes WHERE number = 8 AND section = 'B')),
('Samira Khadka', 'R8B05', (SELECT id FROM classes WHERE number = 8 AND section = 'B')),

-- Class 9 Section B
('Nirmala Basnet', 'R9B01', (SELECT id FROM classes WHERE number = 9 AND section = 'B')),
('Rabindra Dahal', 'R9B02', (SELECT id FROM classes WHERE number = 9 AND section = 'B')),
('Kamana Chhetri', 'R9B03', (SELECT id FROM classes WHERE number = 9 AND section = 'B')),
('Suresh Pokharel', 'R9B04', (SELECT id FROM classes WHERE number = 9 AND section = 'B')),
('Pratima Acharya', 'R9B05', (SELECT id FROM classes WHERE number = 9 AND section = 'B')),

-- Class 10 Section B
('Binod Gautam', 'R10B01', (SELECT id FROM classes WHERE number = 10 AND section = 'B')),
('Sunita Khatri', 'R10B02', (SELECT id FROM classes WHERE number = 10 AND section = 'B')),
('Ramesh Bhandari', 'R10B03', (SELECT id FROM classes WHERE number = 10 AND section = 'B')),
('Sarita Regmi', 'R10B04', (SELECT id FROM classes WHERE number = 10 AND section = 'B')),
('Dinesh Subedi', 'R10B05', (SELECT id FROM classes WHERE number = 10 AND section = 'B')),

-- Class 11 Section B
('Purnima Joshi', 'R11B01', (SELECT id FROM classes WHERE number = 11 AND section = 'B')),
('Mahesh Adhikari', 'R11B02', (SELECT id FROM classes WHERE number = 11 AND section = 'B')),
('Saraswoti Paudel', 'R11B03', (SELECT id FROM classes WHERE number = 11 AND section = 'B')),
('Nabin Koirala', 'R11B04', (SELECT id FROM classes WHERE number = 11 AND section = 'B')),
('Geeta Rijal', 'R11B05', (SELECT id FROM classes WHERE number = 11 AND section = 'B'));