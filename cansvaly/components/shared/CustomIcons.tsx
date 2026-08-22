import * as React from 'react';

export function CanvasGridIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function MagicSparkleIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
      <path d="M20 2L20.8 4.2L23 5L20.8 5.8L20 8L19.2 5.8L17 5L19.2 4.2L20 2Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

export function BrainstormNodeIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <circle cx="5" cy="6" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="19" cy="6" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="5" cy="18" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="19" cy="18" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 10L6.5 7.5M15 10L17.5 7.5M9 14L6.5 16.5M15 14L17.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function LockShieldIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="9" y="11" width="6" height="5" rx="1" fill="currentColor" />
      <path d="M10 11V9.5C10 8.67 10.67 8 11.5 8H12.5C13.33 8 14 8.67 14 9.5V11" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function TeamUsersIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 21V19C16 16.7909 14.2091 15 12 15H7C4.79086 15 3 16.7909 3 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9.5" cy="7.5" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21V19C20.9986 17.1771 19.6384 15.655 17.82 15.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 3.13C17.8252 3.6806 19.1853 5.2072 19.1853 7.03C19.1853 8.8528 17.8252 10.3794 16 10.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
