import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const GIG_CATEGORIES = [
  { value: 'web-development', label: 'Web Development', icon: '💻' },
  { value: 'mobile-development', label: 'Mobile Development', icon: '📱' },
  { value: 'ui-ux-design', label: 'UI/UX Design', icon: '🎨' },
  { value: 'graphic-design', label: 'Graphic Design', icon: '✏️' },
  { value: 'content-writing', label: 'Content Writing', icon: '📝' },
  { value: 'video-editing', label: 'Video Editing', icon: '🎬' },
  { value: 'data-science', label: 'Data Science', icon: '📊' },
  { value: 'digital-marketing', label: 'Digital Marketing', icon: '📣' },
  { value: 'photography', label: 'Photography', icon: '📸' },
  { value: 'other', label: 'Other', icon: '🔧' },
];

export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'text-warning' },
  in_progress: { label: 'In Progress', color: 'text-accent' },
  completed: { label: 'Completed', color: 'text-success' },
  cancelled: { label: 'Cancelled', color: 'text-danger' },
  disputed: { label: 'Disputed', color: 'text-danger' },
};
