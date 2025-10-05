-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add subject_id to teacher_classes
ALTER TABLE public.teacher_classes 
ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL;

-- Create tests table for test management
CREATE TABLE IF NOT EXISTS public.tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  total_marks INTEGER NOT NULL CHECK (total_marks > 0),
  pass_marks INTEGER NOT NULL CHECK (pass_marks > 0 AND pass_marks <= total_marks),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  created_by UUID NOT NULL,
  test_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create test_results table for storing individual student marks
CREATE TABLE IF NOT EXISTS public.test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  marks_obtained INTEGER NOT NULL CHECK (marks_obtained >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(test_id, student_id)
);

-- Enable RLS on subjects table
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- RLS policies for subjects
CREATE POLICY "All authenticated users can view subjects"
  ON public.subjects FOR SELECT
  USING (true);

CREATE POLICY "Admins and principals can manage subjects"
  ON public.subjects FOR ALL
  USING (get_user_role(auth.uid()) IN ('admin', 'principal', 'superadmin'));

-- Enable RLS on tests table
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

-- RLS policies for tests
CREATE POLICY "All authenticated users can view tests"
  ON public.tests FOR SELECT
  USING (true);

CREATE POLICY "Teachers can create tests"
  ON public.tests FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Teachers can update own tests"
  ON public.tests FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Admins and principals can manage all tests"
  ON public.tests FOR ALL
  USING (get_user_role(auth.uid()) IN ('admin', 'principal', 'superadmin'));

-- Enable RLS on test_results table
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for test_results
CREATE POLICY "All authenticated users can view test results"
  ON public.test_results FOR SELECT
  USING (true);

CREATE POLICY "Teachers can insert test results for their tests"
  ON public.test_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tests 
      WHERE tests.id = test_results.test_id 
      AND tests.created_by = auth.uid()
    )
  );

CREATE POLICY "Teachers can update test results for their tests"
  ON public.test_results FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tests 
      WHERE tests.id = test_results.test_id 
      AND tests.created_by = auth.uid()
    )
  );

CREATE POLICY "Admins and principals can manage all test results"
  ON public.test_results FOR ALL
  USING (get_user_role(auth.uid()) IN ('admin', 'principal', 'superadmin'));

-- Create trigger for tests updated_at
CREATE TRIGGER update_tests_updated_at
  BEFORE UPDATE ON public.tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for test_results updated_at
CREATE TRIGGER update_test_results_updated_at
  BEFORE UPDATE ON public.test_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default subjects
INSERT INTO public.subjects (name) VALUES
  ('Mathematics'),
  ('Science'),
  ('English'),
  ('Hindi'),
  ('Social Studies'),
  ('Computer Science'),
  ('Physical Education'),
  ('Arts')
ON CONFLICT (name) DO NOTHING;