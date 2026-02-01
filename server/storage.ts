import { 
  users, education, experience, skills, projects, certifications, languages, contactMessages,
  type User, type InsertUser,
  type Education, type InsertEducation,
  type Experience, type InsertExperience,
  type Skill, type InsertSkill,
  type Project, type InsertProject,
  type Certification, type InsertCertification,
  type Language, type InsertLanguage,
  type ContactMessage, type InsertContactMessage,
  type Profile
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User auth
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User>;
  
  // Profile (public view from user)
  getProfile(userId?: number): Promise<Profile | undefined>;
  
  // Education
  getEducation(userId: number): Promise<Education[]>;
  createEducation(data: InsertEducation): Promise<Education>;
  updateEducation(id: number, data: Partial<InsertEducation>): Promise<Education>;
  deleteEducation(id: number): Promise<void>;
  
  // Experience
  getExperience(userId: number): Promise<Experience[]>;
  createExperience(data: InsertExperience): Promise<Experience>;
  updateExperience(id: number, data: Partial<InsertExperience>): Promise<Experience>;
  deleteExperience(id: number): Promise<void>;
  
  // Skills
  getSkills(userId: number): Promise<Skill[]>;
  createSkill(data: InsertSkill): Promise<Skill>;
  updateSkill(id: number, data: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;
  
  // Projects
  getProjects(userId: number): Promise<Project[]>;
  createProject(data: InsertProject): Promise<Project>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Certifications
  getCertifications(userId: number): Promise<Certification[]>;
  createCertification(data: InsertCertification): Promise<Certification>;
  updateCertification(id: number, data: Partial<InsertCertification>): Promise<Certification>;
  deleteCertification(id: number): Promise<void>;
  
  // Languages
  getLanguages(userId: number): Promise<Language[]>;
  createLanguage(data: InsertLanguage): Promise<Language>;
  updateLanguage(id: number, data: Partial<InsertLanguage>): Promise<Language>;
  deleteLanguage(id: number): Promise<void>;
  
  // Contact Messages
  getContactMessages(userId: number): Promise<ContactMessage[]>;
  createContactMessage(data: InsertContactMessage): Promise<ContactMessage>;
  markMessageRead(id: number): Promise<void>;
  deleteContactMessage(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User auth
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User> {
    const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updated;
  }

  // Profile (get user as profile)
  async getProfile(userId?: number): Promise<Profile | undefined> {
    let user: User | undefined;
    if (userId) {
      [user] = await db.select().from(users).where(eq(users.id, userId));
    } else {
      [user] = await db.select().from(users).limit(1);
    }
    if (!user) return undefined;
    return {
      id: user.id,
      name: user.name,
      title: user.title,
      summary: user.summary,
      location: user.location,
      phone: user.phone,
      email: user.email,
      linkedin: user.linkedin,
      imageUrl: user.imageUrl,
      cvUrl: user.cvUrl,
    };
  }

  // Education
  async getEducation(userId: number): Promise<Education[]> {
    return await db.select().from(education).where(eq(education.userId, userId));
  }

  async createEducation(data: InsertEducation): Promise<Education> {
    const [newEdu] = await db.insert(education).values(data).returning();
    return newEdu;
  }

  async updateEducation(id: number, data: Partial<InsertEducation>): Promise<Education> {
    const [updated] = await db.update(education).set(data).where(eq(education.id, id)).returning();
    return updated;
  }

  async deleteEducation(id: number): Promise<void> {
    await db.delete(education).where(eq(education.id, id));
  }

  // Experience
  async getExperience(userId: number): Promise<Experience[]> {
    return await db.select().from(experience).where(eq(experience.userId, userId));
  }

  async createExperience(data: InsertExperience): Promise<Experience> {
    const [newExp] = await db.insert(experience).values(data).returning();
    return newExp;
  }

  async updateExperience(id: number, data: Partial<InsertExperience>): Promise<Experience> {
    const [updated] = await db.update(experience).set(data).where(eq(experience.id, id)).returning();
    return updated;
  }

  async deleteExperience(id: number): Promise<void> {
    await db.delete(experience).where(eq(experience.id, id));
  }

  // Skills
  async getSkills(userId: number): Promise<Skill[]> {
    return await db.select().from(skills).where(eq(skills.userId, userId));
  }

  async createSkill(data: InsertSkill): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(data).returning();
    return newSkill;
  }

  async updateSkill(id: number, data: Partial<InsertSkill>): Promise<Skill> {
    const [updated] = await db.update(skills).set(data).where(eq(skills.id, id)).returning();
    return updated;
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Projects
  async getProjects(userId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async createProject(data: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(data).returning();
    return newProject;
  }

  async updateProject(id: number, data: Partial<InsertProject>): Promise<Project> {
    const [updated] = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Certifications
  async getCertifications(userId: number): Promise<Certification[]> {
    return await db.select().from(certifications).where(eq(certifications.userId, userId));
  }

  async createCertification(data: InsertCertification): Promise<Certification> {
    const [newCert] = await db.insert(certifications).values(data).returning();
    return newCert;
  }

  async updateCertification(id: number, data: Partial<InsertCertification>): Promise<Certification> {
    const [updated] = await db.update(certifications).set(data).where(eq(certifications.id, id)).returning();
    return updated;
  }

  async deleteCertification(id: number): Promise<void> {
    await db.delete(certifications).where(eq(certifications.id, id));
  }

  // Languages
  async getLanguages(userId: number): Promise<Language[]> {
    return await db.select().from(languages).where(eq(languages.userId, userId));
  }

  async createLanguage(data: InsertLanguage): Promise<Language> {
    const [newLang] = await db.insert(languages).values(data).returning();
    return newLang;
  }

  async updateLanguage(id: number, data: Partial<InsertLanguage>): Promise<Language> {
    const [updated] = await db.update(languages).set(data).where(eq(languages.id, id)).returning();
    return updated;
  }

  async deleteLanguage(id: number): Promise<void> {
    await db.delete(languages).where(eq(languages.id, id));
  }

  // Contact Messages
  async getContactMessages(userId: number): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).where(eq(contactMessages.userId, userId)).orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(data: InsertContactMessage): Promise<ContactMessage> {
    const [newMsg] = await db.insert(contactMessages).values(data).returning();
    return newMsg;
  }

  async markMessageRead(id: number): Promise<void> {
    await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }
}

export const storage = new DatabaseStorage();
