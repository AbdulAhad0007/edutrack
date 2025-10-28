# EduTrack - Student Management System

A comprehensive, modern ERP (Enterprise Resource Planning) application built with Next.js and React for managing student information, attendance, grades, fees, and more. Features role-based access for students, teachers, and administrators with a responsive design and dark mode support.

## 🚀 Features

### Core Functionality
- **Multi-Role Authentication**: Secure login system supporting students, teachers, and administrators
- **Student Management**: Complete student profile and enrollment management
- **Attendance Tracking**: Daily and monthly attendance monitoring with reports
- **Grade Management**: Record marks, calculate grades, and generate transcripts
- **Fee Management**: Comprehensive fee tracking with online payment integration
- **Exam Management**: Create timetables, manage exam schedules and results
- **Timetable Management**: Automated schedule creation and management
- **Analytics & Reports**: Performance insights and comprehensive reporting
- **Notifications**: Real-time notifications and announcements
- **Feedback System**: Collect and manage feedback from students and staff

### Technical Features
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Mode**: Toggle between light and dark themes
- **Internationalization**: Multi-language support (English, Hindi, Tamil, Spanish)
- **Real-time Updates**: Live notifications and data synchronization
- **PDF Generation**: Export reports, receipts, and transcripts
- **Payment Integration**: Secure online fee payments via Cashfree
- **Data Export**: Screenshot and PDF export capabilities

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with hooks and modern features
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Backend & Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **Firebase** - Authentication and additional services
- **NextAuth.js** - Authentication framework

### Integrations
- **Cashfree** - Payment gateway for fee collection
- **EmailJS** - Email notifications and communications
- **Chart.js** - Data visualization and analytics
- **html2canvas** - Screenshot generation
- **jspdf** - PDF document creation

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **Vercel** - Deployment platform

## 📋 Prerequisites

- **Node.js**: v18 or later
- **npm** or **yarn**: Package manager
- **Git**: Version control

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/AbdulAhad0007/edutrack.git
cd edutrack
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Cashfree Payment Gateway (for production)
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_BASE_URL=https://api.cashfree.com/pg

# EmailJS (optional)
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_USER_ID=your_emailjs_user_id
```

### 4. Database Setup
Run the provided SQL schema files to set up your database:
- `schema-students.sql`
- `schema-teachers.sql`
- `schema-attendance.sql`
- `schema-exams.sql`
- `schema-fees.sql`
- `schema-grades.sql`
- `schema-payments.sql`
- `schema-timetable.sql`
- `schema-notifications.sql`
- `schema-meetings.sql`
- `schema-admin-notice.sql`
- `schema-teacher-notifications.sql`
- `schema-exam-results.sql`

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 User Roles & Access

### Student Portal (`/erp/[student-id]`)
- View personal dashboard with attendance, grades, and fees
- Access timetable and exam schedules
- Make fee payments online
- Submit feedback and view notifications
- Download receipts and reports

### Teacher Portal (`/erp/[teacher-id]`)
- Manage student attendance and grades
- Create and manage exam schedules
- Handle fee collection and verification
- Access student performance analytics
- Send notifications and announcements

### Admin Portal (`/admin`)
- Full system administration
- User management (students, teachers)
- System configuration and settings
- Advanced reporting and analytics
- Payment gateway management

## 💳 Payment Integration

The system integrates with Cashfree payment gateway for secure online fee collection:

### Test Mode (Development)
- Use test card: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: Any future date
- OTP: `123456`

### Production Setup
1. Sign up at [Cashfree Merchant Dashboard](https://merchant.cashfree.com/)
2. Complete KYC verification
3. Add bank account for settlements
4. Get production API credentials
5. Update environment variables

## 🌐 Internationalization

The application supports multiple languages:
- **English** (en)
- **Hindi** (hi)
- **Tamil** (ta)
- **Spanish** (es)

Language switching is available in the settings panel.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Student APIs
- `GET /api/student/fees` - Get student fees
- `GET /api/student/attendance` - Get attendance records
- `GET /api/student/exams` - Get exam schedules
- `GET /api/student/grades` - Get grade records
- `GET /api/student/timetable` - Get timetable
- `GET /api/student/notifications` - Get notifications

### Teacher APIs
- `GET/POST /api/teacher/students` - Manage students
- `GET/POST /api/teacher/attendance` - Manage attendance
- `GET/POST /api/teacher/exams` - Manage exams
- `GET/POST /api/teacher/fees` - Manage fees
- `GET/POST /api/teacher/grades` - Manage grades
- `GET/POST /api/teacher/timetable` - Manage timetable

### Admin APIs
- `GET/POST /api/admin/students` - Student management
- `GET/POST /api/admin/teachers` - Teacher management
- `GET/POST /api/admin/attendance` - Bulk attendance operations
- `GET/POST /api/admin/exams` - Exam management
- `GET/POST /api/admin/fees` - Fee management
- `GET/POST /api/admin/grades` - Grade management
- `GET/POST /api/admin/timetable` - Timetable management
- `GET/POST /api/admin/notifications` - Notification management

### Payment APIs
- `POST /api/payments/cashfree` - Initiate payment
- `GET /api/payments/cashfree` - Verify payment status

## 🏗️ Project Structure

```
edutrack/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── erp/[id]/          # Dynamic ERP pages
│   │   ├── landing/           # Landing page
│   │   └── ...
│   ├── components/            # Reusable React components
│   │   ├── StudentFees.jsx    # Fee management component
│   │   ├── TeacherDashboard.jsx
│   │   └── ...
│   ├── lib/                   # Utility libraries
│   │   ├── firebaseClient.js  # Firebase configuration
│   │   ├── i18n.js           # Internationalization
│   │   └── ...
│   └── providers/            # Context providers
│       ├── AuthProvider.js   # Authentication context
│       └── I18nProvider.js   # Language context
├── public/                    # Static assets
├── schema-*.sql              # Database schemas
├── PAYMENT_*.md              # Payment documentation
├── test-cashfree.js          # Payment testing script
└── README.md
```

## 🧪 Testing

### Payment Testing
```bash
# Test Cashfree API connection
node test-cashfree.js

# Open HTML test page
open test-cashfree-checkout.html
```

### Development Testing
```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📚 Documentation

- [Payment Configuration](PAYMENT_CONFIG.md)
- [Payment Settlement Info](PAYMENT_SETTLEMENT_INFO.md)
- [Payment Testing Guide](PAYMENT_TESTING_GUIDE.md)
- [Database Schemas](schema-*.sql)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: abdulahad0007@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/AbdulAhad0007/edutrack/issues)
- **Documentation**: Check the `/docs` folder for detailed guides

## 🙏 Acknowledgments

- **Cashfree** for payment gateway services
- **Supabase** for database and real-time features
- **Firebase** for authentication
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first approach

---

**Built with ❤️ for educational institutions worldwide**
