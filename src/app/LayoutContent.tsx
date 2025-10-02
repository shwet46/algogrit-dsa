'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import CodeAssistant from '@/components/CodeAssistant';

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = ['/login', '/signup'].includes(pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <CodeAssistant />}
    </>
  );
}