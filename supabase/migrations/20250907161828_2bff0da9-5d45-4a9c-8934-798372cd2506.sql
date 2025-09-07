-- Add students for classes 6-11 to populate empty classes
INSERT INTO public.students (name, roll_number, class_id) VALUES
-- Class 6 students
('Arjun Pradhan', '601', (SELECT id FROM classes WHERE number = 6 AND section = 'A')),
('Binita Lama', '602', (SELECT id FROM classes WHERE number = 6 AND section = 'A')),
('David Shrestha', '603', (SELECT id FROM classes WHERE number = 6 AND section = 'A')),
('Kavya Magar', '604', (SELECT id FROM classes WHERE number = 6 AND section = 'A')),
('Sujan Tamang', '605', (SELECT id FROM classes WHERE number = 6 AND section = 'A')),

-- Class 7 students
('Anita Rai', '701', (SELECT id FROM classes WHERE number = 7 AND section = 'A')),
('Bikash Thapa', '702', (SELECT id FROM classes WHERE number = 7 AND section = 'A')),
('Divya Karki', '703', (SELECT id FROM classes WHERE number = 7 AND section = 'A')),
('Kiran Gurung', '704', (SELECT id FROM classes WHERE number = 7 AND section = 'A')),
('Priya Singh', '705', (SELECT id FROM classes WHERE number = 7 AND section = 'A')),

-- Class 8 students
('Aashish Bista', '801', (SELECT id FROM classes WHERE number = 8 AND section = 'A')),
('Deepika Sharma', '802', (SELECT id FROM classes WHERE number = 8 AND section = 'A')),
('Ravi Khadka', '803', (SELECT id FROM classes WHERE number = 8 AND section = 'A')),
('Sunita Basnet', '804', (SELECT id FROM classes WHERE number = 8 AND section = 'A')),
('Tek Rana', '805', (SELECT id FROM classes WHERE number = 8 AND section = 'A')),

-- Class 9 students
('Bijay Adhikari', '901', (SELECT id FROM classes WHERE number = 9 AND section = 'A')),
('Kamala Pokhrel', '902', (SELECT id FROM classes WHERE number = 9 AND section = 'A')),
('Manoj Limbu', '903', (SELECT id FROM classes WHERE number = 9 AND section = 'A')),
('Nisha Pun', '904', (SELECT id FROM classes WHERE number = 9 AND section = 'A')),
('Sagar Acharya', '905', (SELECT id FROM classes WHERE number = 9 AND section = 'A')),

-- Class 10 students
('Anil Dahal', '1001', (SELECT id FROM classes WHERE number = 10 AND section = 'A')),
('Gita Bhusal', '1002', (SELECT id FROM classes WHERE number = 10 AND section = 'A')),
('Nabin Joshi', '1003', (SELECT id FROM classes WHERE number = 10 AND section = 'A')),
('Rita Ghimire', '1004', (SELECT id FROM classes WHERE number = 10 AND section = 'A')),
('Sunil Kafle', '1005', (SELECT id FROM classes WHERE number = 10 AND section = 'A')),

-- Class 11 students
('Anju Pandey', '1101', (SELECT id FROM classes WHERE number = 11 AND section = 'A')),
('Dipesh Shah', '1102', (SELECT id FROM classes WHERE number = 11 AND section = 'A')),
('Laxmi Upreti', '1103', (SELECT id FROM classes WHERE number = 11 AND section = 'A')),
('Rajesh Parajuli', '1104', (SELECT id FROM classes WHERE number = 11 AND section = 'A')),
('Sita Mainali', '1105', (SELECT id FROM classes WHERE number = 11 AND section = 'A'));