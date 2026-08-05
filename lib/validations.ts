export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  // Accepts 10 to 15 digit numbers, optional leading +
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

export function validateStrongPassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (!password || password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long.' };
  }
  return { isValid: true };
}
