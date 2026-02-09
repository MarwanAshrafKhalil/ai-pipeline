import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  const base = 'px-3 py-1.5 rounded font-medium transition-colors disabled:opacity-50';
  const variants = {
    primary: 'bg-slate-800 text-white hover:bg-slate-700',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
