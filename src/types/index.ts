export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: number;
  section: string;
  remarks: Remark[];
  averageRating: number;
}

export interface Remark {
  id: string;
  teacherId: string;
  teacherName: string;
  rating: number; // 1-5 stars
  tags: string[];
  notes: string;
  date: Date;
  isFromHigherAdmin?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  role: 'teacher' | 'principal' | 'super_admin';
  classes: number[];
}

export interface Class {
  number: number;
  sections: string[];
  students: Student[];
}

export const PREDEFINED_TAGS = [
  'Disciplined',
  'Needs Attention', 
  'Active Participant',
  'Irregular Attendance',
  'Excellent Performance',
  'Improvement Needed',
  'Cooperative',
  'Creative',
  'Leadership Qualities',
  'Respectful',
  'Hardworking',
  'Punctual'
] as const;