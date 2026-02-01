import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { signupSchema, loginSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup file upload
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_multer,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid image type'));
      }
    } else if (file.fieldname === 'cv') {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid CV type. Only PDF, DOC, DOCX allowed.'));
      }
    } else {
      cb(null, true);
    }
  }
});

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

const PgSession = connectPgSimple(session);

// Auth middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup session
  app.use(session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "portfolio-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  }));

  // Auth Routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const input = signupSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getUserByEmail(input.email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // Create user
      const user = await storage.createUser({
        email: input.email,
        password: hashedPassword,
        name: input.name,
        title: input.title || "",
        summary: input.summary || "",
        location: input.location || "",
        phone: input.phone || "",
        linkedin: input.linkedin || "",
        imageUrl: "",
        cvUrl: "",
      });

      req.session.userId = user.id;
      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors[0].message });
      }
      console.error(err);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const input = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(input.email);
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      req.session.userId = user.id;
      res.json({ id: user.id, email: user.email, name: user.name });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors[0].message });
      }
      console.error(err);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.json(null);
    }
    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      return res.json(null);
    }
    res.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name,
      title: user.title,
      summary: user.summary,
      location: user.location,
      phone: user.phone,
      linkedin: user.linkedin,
      imageUrl: user.imageUrl,
    });
  });

  // Profile
  app.get("/api/profile", async (req, res) => {
    const userId = req.session.userId;
    const profile = await storage.getProfile(userId);
    res.json(profile || {});
  });

  app.patch("/api/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const updated = await storage.updateUser(userId, req.body);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Update failed" });
    }
  });

  // Education CRUD
  app.get("/api/education", async (req, res) => {
    const userId = req.session.userId || 1;
    const data = await storage.getEducation(userId);
    res.json(data);
  });

  app.post("/api/education", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const data = await storage.createEducation({ ...req.body, userId });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Create failed" });
    }
  });

  app.patch("/api/education/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const data = await storage.updateEducation(id, req.body);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Update failed" });
    }
  });

  app.delete("/api/education/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteEducation(id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Delete failed" });
    }
  });

  // Experience CRUD
  app.get("/api/experience", async (req, res) => {
    const userId = req.session.userId || 1;
    const data = await storage.getExperience(userId);
    res.json(data);
  });

  app.post("/api/experience", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const data = await storage.createExperience({ ...req.body, userId });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Create failed" });
    }
  });

  app.patch("/api/experience/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const data = await storage.updateExperience(id, req.body);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Update failed" });
    }
  });

  app.delete("/api/experience/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteExperience(id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Delete failed" });
    }
  });

  // Skills CRUD
  app.get("/api/skills", async (req, res) => {
    const userId = req.session.userId || 1;
    const data = await storage.getSkills(userId);
    res.json(data);
  });

  app.post("/api/skills", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const data = await storage.createSkill({ ...req.body, userId });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Create failed" });
    }
  });

  app.patch("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const data = await storage.updateSkill(id, req.body);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Update failed" });
    }
  });

  app.delete("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteSkill(id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Delete failed" });
    }
  });

  // Projects CRUD
  app.get("/api/projects", async (req, res) => {
    const userId = req.session.userId || 1;
    const data = await storage.getProjects(userId);
    res.json(data);
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const data = await storage.createProject({ ...req.body, userId });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Create failed" });
    }
  });

  app.patch("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const data = await storage.updateProject(id, req.body);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Update failed" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteProject(id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Delete failed" });
    }
  });

  // Certifications CRUD
  app.get("/api/certifications", async (req, res) => {
    const userId = req.session.userId || 1;
    const data = await storage.getCertifications(userId);
    res.json(data);
  });

  app.post("/api/certifications", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const data = await storage.createCertification({ ...req.body, userId });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Create failed" });
    }
  });

  app.patch("/api/certifications/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const data = await storage.updateCertification(id, req.body);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Update failed" });
    }
  });

  app.delete("/api/certifications/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteCertification(id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Delete failed" });
    }
  });

  // Languages CRUD
  app.get("/api/languages", async (req, res) => {
    const userId = req.session.userId || 1;
    const data = await storage.getLanguages(userId);
    res.json(data);
  });

  app.post("/api/languages", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const data = await storage.createLanguage({ ...req.body, userId });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Create failed" });
    }
  });

  app.patch("/api/languages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const data = await storage.updateLanguage(id, req.body);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Update failed" });
    }
  });

  app.delete("/api/languages/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      await storage.deleteLanguage(id);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Delete failed" });
    }
  });

  // File upload routes
  app.use("/uploads", (await import("express")).default.static(uploadDir));

  app.post("/api/upload/image", requireAuth, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      await storage.updateUser(req.session.userId!, { imageUrl });
      res.json({ imageUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  app.post("/api/upload/cv", requireAuth, upload.single('cv'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No CV file uploaded" });
      }
      const cvUrl = `/uploads/${req.file.filename}`;
      await storage.updateUser(req.session.userId!, { cvUrl });
      res.json({ cvUrl });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // Contact - stores message for portfolio owner
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message, userId } = req.body;
      if (!name || !email || !message || !userId) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      await storage.createContactMessage({
        userId: parseInt(userId),
        senderName: name,
        senderEmail: email,
        message,
        isRead: false,
      });
      
      res.json({ success: true, message: "Message sent successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Contact Messages (for logged in user to view their messages)
  app.get("/api/messages", requireAuth, async (req, res) => {
    const messages = await storage.getContactMessages(req.session.userId!);
    res.json(messages);
  });

  app.patch("/api/messages/:id/read", requireAuth, async (req, res) => {
    await storage.markMessageRead(parseInt(req.params.id as string));
    res.json({ success: true });
  });

  app.delete("/api/messages/:id", requireAuth, async (req, res) => {
    await storage.deleteContactMessage(parseInt(req.params.id as string));
    res.json({ success: true });
  });

  return httpServer;
}
