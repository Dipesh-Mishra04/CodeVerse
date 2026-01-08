import { Suspense } from 'react';
import LoginClient from './LoginClient';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 z-0 h-full w-full bg-neutral-950"></div>
        <div className="relative z-10 text-white">Loading...</div>
      </div>
    }>
      <LoginClient />
    </Suspense>
  );
}
