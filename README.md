# ERP Application (Web and Mobile)

This is a modern, responsive ERP (Enterprise Resource Planning) application built with Next.js and React for the web, and Expo React Native for mobile. It provides a comprehensive dashboard and modules for students, including attendance, exams, fees, grades, timetable, analytics, and feedback.

## Features

- **User Authentication:** Secure login with NextAuth.js (web) and mock authentication (mobile).
- **Responsive Sidebar Navigation:** Role-based menu items for students.
- **Profile Menu:** Accessible user profile with settings and logout options.
- **Dark Mode Support:** Toggle between light and dark themes (web).
- **Notifications:** Real-time notification popup (web).
- **Modular Design:** Separate components for Dashboard, Attendance, Exams, Fees, Grades, Timetable, Analytics, and Feedback.
- **Localization:** Internationalization support with i18next (web).
- **Charts and Analytics:** Visualize data with Chart.js and react-chartjs-2 (web).
- **Firebase Integration:** Backend services and authentication (web).
- **PDF and Screenshot Export:** Using jspdf and html2canvas (web).
- **Mobile App:** Native Android app with similar features, built with Expo.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn package manager
- For mobile: Expo CLI and Android Studio (for Android emulator)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd erp
```

2. Install dependencies for web app:

```bash
npm install
# or
yarn install
```

3. Run the development server for web:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Mobile App Setup

1. Navigate to the mobile app directory:

```bash
cd erp-mobile
```

2. Install dependencies:

```bash
npm install
```

3. Start the Expo development server:

```bash
npm start
```

4. Use the Expo Go app on your Android device or run on an emulator to test.

## Project Structure

- `src/components/` - Reusable React components like Header, Sidebar, NotificationPopup, etc. (web).
- `src/app/erp/[id]/` - Student ERP page with dynamic routing based on user ID (web).
- `src/app/auth/` - Authentication pages and logic (web).
- `src/lib/` - Utility functions and Firebase client setup (web).
- `src/providers/` - Context providers for authentication and internationalization (web).
- `public/` - Static assets like images and icons (web).
- `erp-mobile/` - React Native mobile app for students.
  - `erp-mobile/screens/` - Screen components for mobile app.
  - `erp-mobile/lib/` - Utility functions for mobile app.
  - `erp-mobile/assets/` - Images and icons for mobile app.

## Scripts

- `npm run dev` - Start development server (web).
- `npm run build` - Build production-ready app (web).
- `npm start` - Start production server (web).
- `npm run lint` - Run ESLint for code quality (web).
- `cd erp-mobile && npm start` - Start Expo development server for mobile app.

## Technologies Used

- Next.js 15
- React 19
- Tailwind CSS 4
- NextAuth.js for authentication (web)
- Firebase for backend services (web)
- Chart.js and react-chartjs-2 for charts (web)
- i18next for localization (web)
- Lucide React icons (web)
- Expo and React Native for mobile app

## Deployment

The web app can be deployed easily on Vercel or any other Node.js hosting platform. Refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for detailed instructions.

The mobile app can be built and deployed using Expo Application Services (EAS). To build the Android APK:

1. Install EAS CLI globally:

```bash
npm install -g eas-cli
```

2. Log in to your Expo account:

```bash
eas login
```

3. Configure your build profile in `erp-mobile/eas.json`.

4. Run the build command:

```bash
cd erp-mobile
eas build --platform android --profile production
```

5. After the build completes, download the APK from the Expo build page linked in the terminal output.

## Download Mobile App

The Android APK build is currently in progress or may need to be built using the above steps. Once available, the APK can be downloaded from the Expo build page. Check the build logs at https://expo.dev/accounts/ahadabdul9976/projects/erp-mobile for the latest status.

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.
