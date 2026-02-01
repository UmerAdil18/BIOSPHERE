import { z } from 'zod';
import { 
  insertEducationSchema, 
  insertExperienceSchema, 
  insertSkillSchema, 
  insertProjectSchema, 
  insertCertificationSchema,
  insertLanguageSchema,
  signupSchema,
  loginSchema,
  users,
  education,
  experience,
  skills,
  projects,
  certifications,
  languages
} from './schema';

export const api = {
  auth: {
    signup: {
      method: 'POST' as const,
      path: '/api/auth/signup',
      input: signupSchema,
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: loginSchema,
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout',
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me',
    },
  },
  profile: {
    get: {
      method: 'GET' as const,
      path: '/api/profile',
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/profile',
    },
  },
  education: {
    list: {
      method: 'GET' as const,
      path: '/api/education',
    },
    create: {
      method: 'POST' as const,
      path: '/api/education',
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/education/:id',
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/education/:id',
    },
  },
  experience: {
    list: {
      method: 'GET' as const,
      path: '/api/experience',
    },
    create: {
      method: 'POST' as const,
      path: '/api/experience',
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/experience/:id',
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/experience/:id',
    },
  },
  skills: {
    list: {
      method: 'GET' as const,
      path: '/api/skills',
    },
    create: {
      method: 'POST' as const,
      path: '/api/skills',
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/skills/:id',
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/skills/:id',
    },
  },
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects',
    },
    create: {
      method: 'POST' as const,
      path: '/api/projects',
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/projects/:id',
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/projects/:id',
    },
  },
  certifications: {
    list: {
      method: 'GET' as const,
      path: '/api/certifications',
    },
    create: {
      method: 'POST' as const,
      path: '/api/certifications',
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/certifications/:id',
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/certifications/:id',
    },
  },
  languages: {
    list: {
      method: 'GET' as const,
      path: '/api/languages',
    },
    create: {
      method: 'POST' as const,
      path: '/api/languages',
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/languages/:id',
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/languages/:id',
    },
  },
  contact: {
    send: {
      method: 'POST' as const,
      path: '/api/contact',
      input: z.object({
        name: z.string(),
        email: z.string().email(),
        message: z.string(),
      }),
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
