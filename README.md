# Virtual HR - Setup Guide

Virtual HR is an AI-powered HR assistant system built to streamline leave management, document generation, and employee support using conversational AI.

This project consists of:
- 💼 **Admin Panel** (`virtual-hr-admin`) – Web dashboard for HR/admins
- 🤖 **Backend API** (`virtual-hr-api`) – Built with NestJS, MySQL, and OpenAI
- 📱 **Mobile App** (`virtual-hr-mobile`) – React Native app for employee access

---

## 🚀 Getting Started

### 📦 Clone the Repositories

```bash
git clone https://github.com/harshanasrimal/virtual-hr-api.git
git clone https://github.com/harshanasrimal/virtual-hr-admin.git
git clone https://github.com/harshanasrimal/virtual-hr-mobile.git
```

---

## 🧠 Backend API (`virtual-hr-api`)

### 🔧 Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables by creating a `.env` file:
   ```env
   DATABASE_URL=mysql://user:password@localhost:3306/your_database
   OPENAI_API_KEY=your_openai_key
   JWT_SECRET=your_jwt_secret
   ```

3. Generate and run Prisma migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```

---

## 🌐 Admin Panel (`virtual-hr-admin`)

### 🔧 Setup

1. Navigate into the project directory:
   ```bash
   cd virtual-hr-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API base URL in `src/services/api.ts`:
   ```ts
   const baseURL = import.meta.env.PROD
     ? 'https://hr-api.harshanasrimal.com'
     : '/api'; // Used with Vite dev proxy
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📱 Mobile App (`virtual-hr-mobile`)

### 🔧 Setup

1. Navigate into the project directory:
   ```bash
   cd virtual-hr-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API base URL in your config (e.g., `config.ts` or `.env`):
   ```ts
   export const BASE_URL = 'https://hr-api.harshanasrimal.com';
   ```

4. Start Expo development server:
   ```bash
   npx expo start
   ```

5. Scan the QR code using the Expo Go app on your mobile device or run on an emulator.

---

## ✅ Notes

- Make sure MySQL is running locally and accessible using the credentials in your `.env` file.
- Ensure CORS is enabled in the backend to allow requests from `https://hr.harshanasrimal.com`.
- In production, set up Nginx to serve the frontend and proxy API requests appropriately.
- The backend uses OpenAI’s API for chat interactions — ensure your key is valid and has access.

---

Happy coding! 💻✨
