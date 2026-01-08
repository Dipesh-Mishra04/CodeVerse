# CodeVerse - LeetCode Clone 🚀

A modern, full-stack coding practice platform built with Next.js, TypeScript, and Supabase. Practice DSA problems with an interactive 3D visualization experience.

![CodeVerse](https://img.shields.io/badge/CodeVerse-LeetCode%20Clone-emerald?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)

## ✨ Features

- 🎨 **Beautiful UI/UX** - Modern, translucent glass-morphism design with animated backgrounds
- 🎯 **3D Coding Visualization** - Interactive 3D animated background using Three.js and React Three Fiber
- 🔐 **Authentication** - Secure login/signup with Supabase Auth and Google OAuth
- 💻 **Code Editor** - Monaco Editor integration for coding practice
- 📱 **Fully Responsive** - Works seamlessly on all devices
- ⚡ **Fast Performance** - Built with Next.js 16 for optimal speed
- 🎨 **Tailwind CSS** - Modern utility-first CSS framework

## 🛠️ Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **3D Graphics:** Three.js, React Three Fiber, Drei
- **Database & Auth:** Supabase
- **UI Components:** Radix UI
- **Forms:** React Hook Form, Zod
- **Animation:** Framer Motion, GSAP

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20.x or higher
- npm, yarn, pnpm, or bun
- A Supabase account (free tier works)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Dipesh-Mishra04/CodeVerse.git
cd CodeVerse/frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

To get your Supabase credentials:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Navigate to Settings → API
4. Copy the Project URL and anon/public key

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:4000](http://localhost:4000) in your browser to see the result.

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── HeroSection.tsx    # Hero section with 3D background
│   ├── Hero3D.tsx         # 3D animated background
│   ├── Navbar.tsx         # Navigation bar
│   ├── FeaturesSection.tsx
│   ├── HowItWorksSection.tsx
│   └── ContactSection.tsx
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication functions
│   └── supabaseClient.ts # Supabase client setup
├── public/               # Static assets
└── package.json          # Dependencies
```

## 🎨 Key Features Explained

### 3D Animated Background
The hero section features a stunning 3D animated background with:
- Floating code symbols (brackets, braces, operators)
- Algorithm node structures
- Binary data streams
- Code grid lines

### Authentication Flow
- Email/Password authentication
- Google OAuth integration
- Secure session management
- Protected routes

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions

## 🔧 Available Scripts

- `npm run dev` - Start development server on port 4000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Dipesh Mishra**

- GitHub: [@Dipesh-Mishra04](https://github.com/Dipesh-Mishra04)
- Repository: [CodeVerse](https://github.com/Dipesh-Mishra04/CodeVerse)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open Source Firebase Alternative
- [Three.js](https://threejs.org/) - 3D Graphics Library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS Framework

## 📸 Screenshots

_Add screenshots of your application here_

---

⭐ If you like this project, give it a star on GitHub!
