// Clerk Authentication helper with gracefull fallback
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

export const isClerkEnabled = () => {
  return typeof CLERK_PUBLISHABLE_KEY === 'string' &&
         CLERK_PUBLISHABLE_KEY.trim() !== '' &&
         CLERK_PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here';
};
