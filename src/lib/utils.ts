import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function updateTheme(theme?: 'dark' | 'light' | 'system') {
  if (!document) return;

  const isDark =
    theme === 'dark' ||
    ((theme === 'system' || !theme) && window.matchMedia('(prefers-color-scheme: dark)').matches);

  document.documentElement.classList.toggle('dark', isDark);
}
