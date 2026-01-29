import { z } from 'zod';
import { 
  insertProfileSchema, 
  insertEducationSchema, 
  insertExperienceSchema, 
  insertSkillSchema, 
  insertProjectSchema, 
  insertCertificationSchema,
  insertLanguageSchema,
  profile,
  education,
  experience,
  skills,
  projects,
  certifications,
  languages
} from './schema';

export const api = {
  profile: {
    get: {
      method: 'GET' as const,
      path: '/api/profile',
      responses: {
        200: z.custom<typeof profile.$inferSelect>(),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/profile',
      input: insertProfileSchema,
      responses: {
        200: z.custom<typeof profile.$inferSelect>(),
      },
    },
  },
  education: {
    list: {
      method: 'GET' as const,
      path: '/api/education',
      responses: {
        200: z.array(z.custom<typeof education.$inferSelect>()),
      },
    },
  },
  experience: {
    list: {
      method: 'GET' as const,
      path: '/api/experience',
      responses: {
        200: z.array(z.custom<typeof experience.$inferSelect>()),
      },
    },
  },
  skills: {
    list: {
      method: 'GET' as const,
      path: '/api/skills',
      responses: {
        200: z.array(z.custom<typeof skills.$inferSelect>()),
      },
    },
  },
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects',
      responses: {
        200: z.array(z.custom<typeof projects.$inferSelect>()),
      },
    },
  },
  certifications: {
    list: {
      method: 'GET' as const,
      path: '/api/certifications',
      responses: {
        200: z.array(z.custom<typeof certifications.$inferSelect>()),
      },
    },
  },
  languages: {
    list: {
      method: 'GET' as const,
      path: '/api/languages',
      responses: {
        200: z.array(z.custom<typeof languages.$inferSelect>()),
      },
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
      responses: {
        200: z.object({ success: z.boolean() }),
      },
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
