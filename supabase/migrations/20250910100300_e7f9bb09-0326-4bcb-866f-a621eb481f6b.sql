-- Add foreign key constraints to ensure proper relationships
ALTER TABLE teacher_classes 
ADD CONSTRAINT teacher_classes_teacher_id_fkey 
FOREIGN KEY (teacher_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE teacher_classes 
ADD CONSTRAINT teacher_classes_class_id_fkey 
FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE;

ALTER TABLE students 
ADD CONSTRAINT students_class_id_fkey 
FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE;

ALTER TABLE remarks 
ADD CONSTRAINT remarks_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;

ALTER TABLE remarks 
ADD CONSTRAINT remarks_teacher_id_fkey 
FOREIGN KEY (teacher_id) REFERENCES auth.users(id) ON DELETE CASCADE;