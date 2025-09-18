// Mock student data for the ERP mobile app (using names from web app auth)
export const mockStudents = [
  {
    id: 'UID001',
    name: "Rashad Nabeel",
    email: "student01@school.edu",
    grade: "10th Grade",
    attendance: 95,
    fees: { paid: 1200, total: 1500 },
    subjects: ["Math", "Science", "English", "History"],
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 'UID002',
    name: "Abdul Ahad",
    email: "student02@school.edu",
    grade: "9th Grade",
    attendance: 88,
    fees: { paid: 1100, total: 1500 },
    subjects: ["Math", "Science", "English", "Art"],
    avatar: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 'UID003',
    name: "Nishant",
    email: "student03@school.edu",
    grade: "11th Grade",
    attendance: 92,
    fees: { paid: 1300, total: 1500 },
    subjects: ["Math", "Physics", "Chemistry", "English"],
    avatar: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    id: 'UID004',
    name: "Pushpender Bharti",
    email: "student04@school.edu",
    grade: "10th Grade",
    attendance: 97,
    fees: { paid: 1400, total: 1500 },
    subjects: ["Math", "Biology", "English", "Geography"],
    avatar: "https://randomuser.me/api/portraits/men/4.jpg"
  },
  {
    id: 'UID005',
    name: "Raja Tyagi",
    email: "student05@school.edu",
    grade: "12th Grade",
    attendance: 90,
    fees: { paid: 1250, total: 1500 },
    subjects: ["Calculus", "Physics", "Literature", "Economics"],
    avatar: "https://randomuser.me/api/portraits/men/5.jpg"
  },
  {
    id: 'UID006',
    name: "Kakashi Hatake",
    email: "student06@school.edu",
    grade: "11th Grade",
    attendance: 85,
    fees: { paid: 1150, total: 1500 },
    subjects: ["Math", "Chemistry", "English", "Computer Science"],
    avatar: "https://randomuser.me/api/portraits/men/6.jpg"
  },
  {
    id: 'UID007',
    name: "Itachi Qureshi",
    email: "student07@school.edu",
    grade: "9th Grade",
    attendance: 93,
    fees: { paid: 1350, total: 1500 },
    subjects: ["Math", "Science", "English", "Social Studies"],
    avatar: "https://randomuser.me/api/portraits/men/7.jpg"
  },
  {
    id: 'UID008',
    name: "GanSung Lee",
    email: "student08@school.edu",
    grade: "10th Grade",
    attendance: 89,
    fees: { paid: 1200, total: 1500 },
    subjects: ["Math", "Physics", "English", "Korean"],
    avatar: "https://randomuser.me/api/portraits/men/8.jpg"
  },
  {
    id: 'UID009',
    name: "Kisa Zaidi",
    email: "student09@school.edu",
    grade: "12th Grade",
    attendance: 96,
    fees: { paid: 1450, total: 1500 },
    subjects: ["Calculus", "Chemistry", "Literature", "Psychology"],
    avatar: "https://randomuser.me/api/portraits/women/9.jpg"
  },
  {
    id: 'UID010',
    name: "Matlum Ali",
    email: "student10@school.edu",
    grade: "11th Grade",
    attendance: 91,
    fees: { paid: 1300, total: 1500 },
    subjects: ["Math", "Biology", "English", "Physical Education"],
    avatar: "https://randomuser.me/api/portraits/men/10.jpg"
  }
];

// Mock user credentials for authentication (from web app auth data)
export const mockUsers = [
  { id: 'UID001', email: 'student01@school.edu', password: 'password1', name: 'Rashad Nabeel', role: 'student' },
  { id: 'UID002', email: 'student02@school.edu', password: 'password2', name: 'Abdul Ahad', role: 'student' },
  { id: 'UID003', email: 'student03@school.edu', password: 'password3', name: 'Nishant', role: 'student' },
  { id: 'UID004', email: 'student04@school.edu', password: 'password4', name: 'Pushpender Bharti', role: 'student' },
  { id: 'UID005', email: 'student05@school.edu', password: 'password5', name: 'Raja Tyagi', role: 'student' },
  { id: 'UID006', email: 'student06@school.edu', password: 'password6', name: 'Kakashi Hatake', role: 'student' },
  { id: 'UID007', email: 'student07@school.edu', password: 'password7', name: 'Itachi Qureshi', role: 'student' },
  { id: 'UID008', email: 'student08@school.edu', password: 'password8', name: 'GanSung Lee', role: 'student' },
  { id: 'UID009', email: 'student09@school.edu', password: 'password9', name: 'Kisa Zaidi', role: 'student' },
  { id: 'UID010', email: 'student10@school.edu', password: 'password10', name: 'Matlum Ali', role: 'student' },
  // Additional roles for testing
  { id: 'ADMIN001', email: 'admin@school.edu', password: 'admin123', name: 'School Admin', role: 'admin' },
  { id: 'TEACHER001', email: 'teacher@school.edu', password: 'teacher123', name: 'John Teacher', role: 'teacher' }
];

// Mock dashboard data
export const mockDashboardData = {
  totalStudents: 150,
  totalTeachers: 25,
  totalClasses: 12,
  averageAttendance: 89,
  recentActivities: [
    { id: 1, type: "enrollment", message: "New student enrolled", time: "2 hours ago" },
    { id: 2, type: "payment", message: "Fee payment received", time: "4 hours ago" },
    { id: 3, type: "grade", message: "Grades updated for Math class", time: "6 hours ago" },
    { id: 4, type: "attendance", message: "Attendance marked for today", time: "8 hours ago" }
  ]
};

// Mock exams data
export const mockExamsData = {
  upcoming: [
    { id: 1, subject: 'Math', date: '2025-10-01', time: '09:00' },
    { id: 2, subject: 'Physics', date: '2025-10-03', time: '09:00' },
    { id: 3, subject: 'English', date: '2025-10-05', time: '11:00' },
  ],
  results: [
    { id: 1, studentId: 'UID001', subject: 'Math', marks: 92 },
    { id: 2, studentId: 'UID001', subject: 'Science', marks: 88 },
    { id: 3, studentId: 'UID002', subject: 'Math', marks: 78 },
    { id: 4, studentId: 'UID002', subject: 'English', marks: 85 },
  ]
};
