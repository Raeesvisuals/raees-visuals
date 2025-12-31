import { z } from 'zod';
import { sanitizeInput } from './security';

// Input validation schemas
export const loginSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .transform(sanitizeInput),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .transform(sanitizeInput)
});

export const fileUploadSchema = z.object({
  file: z.any().refine(
    (file) => file instanceof File,
    'Invalid file type'
  ).refine(
    (file) => file.size <= parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    'File size exceeds limit'
  ).refine(
    (file) => {
      const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,video/mp4,video/webm').split(',');
      return allowedTypes.includes(file.type);
    },
    'File type not allowed'
  )
});

export const profileUpdateSchema = z.object({
  profileName: z.string()
    .min(1, 'Profile name is required')
    .max(100, 'Profile name must be less than 100 characters')
    .transform(sanitizeInput),
  profileTitle: z.string()
    .min(1, 'Profile title is required')
    .max(200, 'Profile title must be less than 200 characters')
    .transform(sanitizeInput),
  profileHandle: z.string()
    .min(1, 'Profile handle is required')
    .max(50, 'Profile handle must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores')
    .transform(sanitizeInput),
  profileStatus: z.string()
    .min(1, 'Profile status is required')
    .max(100, 'Profile status must be less than 100 characters')
    .transform(sanitizeInput),
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .transform(sanitizeInput),
  subtitle: z.string()
    .min(1, 'Subtitle is required')
    .max(200, 'Subtitle must be less than 200 characters')
    .transform(sanitizeInput),
  description: z.string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be less than 2000 characters')
    .transform(sanitizeInput),
  description2: z.string()
    .min(1, 'Second description is required')
    .max(2000, 'Second description must be less than 2000 characters')
    .transform(sanitizeInput)
});

export const portfolioSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .transform(sanitizeInput),
  category: z.enum(['Fitness', 'SaaS', 'Explainer', 'Commercial', 'Documentary', 'Animation']),
  type: z.enum(['Short Form', 'Long Form', 'Animation']),
  video: z.string().url('Invalid video URL').optional(),
  thumbnail: z.string().url('Invalid thumbnail URL').optional(),
  youtubeId: z.string().optional(),
  isYouTube: z.boolean(),
  status: z.enum(['draft', 'published'])
});

export const teamMemberSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .transform(sanitizeInput),
  role: z.string()
    .min(1, 'Role is required')
    .max(100, 'Role must be less than 100 characters')
    .transform(sanitizeInput),
  image: z.string().url('Invalid image URL')
});

// Validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

// Sanitize HTML content
export function sanitizeHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/data:text\/html/gi, '') // Remove data URLs
    .trim();
}

// Validate URL
export function validateURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

// Validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate file extension
export function validateFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}
