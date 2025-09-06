-- Insert sample students for testing
DO $$
DECLARE
    class_1_id UUID;
    class_2_id UUID;
    class_3_id UUID;
    class_4_id UUID;
    class_5_id UUID;
BEGIN
    -- Get class IDs
    SELECT id INTO class_1_id FROM public.classes WHERE number = 1;
    SELECT id INTO class_2_id FROM public.classes WHERE number = 2;
    SELECT id INTO class_3_id FROM public.classes WHERE number = 3;
    SELECT id INTO class_4_id FROM public.classes WHERE number = 4;
    SELECT id INTO class_5_id FROM public.classes WHERE number = 5;

    -- Insert sample students
    INSERT INTO public.students (name, roll_number, class_id) VALUES
    -- Class 1 students
    ('John Smith', '101', class_1_id),
    ('Emma Johnson', '102', class_1_id),
    ('Michael Brown', '103', class_1_id),
    ('Sarah Davis', '104', class_1_id),
    ('David Wilson', '105', class_1_id),
    
    -- Class 2 students
    ('Lisa Anderson', '201', class_2_id),
    ('Tom Miller', '202', class_2_id),
    ('Anna Taylor', '203', class_2_id),
    ('James Moore', '204', class_2_id),
    ('Sophie Clark', '205', class_2_id),
    
    -- Class 3 students
    ('Alex Thompson', '301', class_3_id),
    ('Maya Patel', '302', class_3_id),
    ('Chris Lee', '303', class_3_id),
    ('Jessica White', '304', class_3_id),
    ('Ryan Garcia', '305', class_3_id),
    
    -- Class 4 students
    ('Emily Chen', '401', class_4_id),
    ('Nathan Rodriguez', '402', class_4_id),
    ('Grace Kim', '403', class_4_id),
    ('Lucas Martinez', '404', class_4_id),
    ('Olivia Lopez', '405', class_4_id),
    
    -- Class 5 students
    ('Ethan Williams', '501', class_5_id),
    ('Chloe Davis', '502', class_5_id),
    ('Mason Jones', '503', class_5_id),
    ('Ava Brown', '504', class_5_id),
    ('Logan Taylor', '505', class_5_id);
END $$;