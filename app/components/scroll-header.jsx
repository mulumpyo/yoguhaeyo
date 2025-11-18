"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GithubLoginButton from '@/components/github-login-button';

const MaxWidthWrapper = ({ children, className }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 md:px-8 lg:px-12 ${className}`}>
    {children}
  </div>
);

const ScrollHeader = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 1);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerClasses = `h-16 flex items-center justify-center sticky top-0 z-50 transition-all duration-300 ${
    scrolled
      ? 'border-b border-gray-100 bg-white/50 backdrop-blur-lg shadow-sm'
      : 'bg-white/0'
  }`;

  const buttonClasses = `transition-all duration-300 ${
    scrolled
      ? 'border bg-white/20 backdrop-blur-lg shadow-sm'
      : ''
  }`;

  return (
    <header className={headerClasses}>
      <MaxWidthWrapper className="flex items-center justify-between">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-extrabold text-xl tracking-tight">yoguhaeyo</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
              기능
          </Link>
          <GithubLoginButton variant="outline" text="로그인" cName={buttonClasses} /> 
        </nav>
      </MaxWidthWrapper>
    </header>
  );
};

export default ScrollHeader;