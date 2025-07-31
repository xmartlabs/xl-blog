import { twMerge } from 'tailwind-merge';

function toClassName(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(toClassName).filter(Boolean).join(' ');
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, val]) => val)
      .map(([key]) => key)
      .join(' ');
  }
  return '';
}

function classnames(...args) {
  console.log('classnames', args);
  const raw = args.map(toClassName).filter(Boolean).join(' ');
  console.log('Merge', twMerge(raw));
  return twMerge(raw);
}

export { classnames };
