import { 
  profile, education, experience, skills, projects, certifications, languages,
  type Profile, type InsertProfile,
  type Education, type InsertEducation,
  type Experience, type InsertExperience,
  type Skill, type InsertSkill,
  type Project, type InsertProject,
  type Certification, type InsertCertification,
  type Language, type InsertLanguage
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProfile(): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: InsertProfile): Promise<Profile>;
  
  getEducation(): Promise<Education[]>;
  createEducation(education: InsertEducation): Promise<Education>;
  
  getExperience(): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  getCertifications(): Promise<Certification[]>;
  createCertification(certification: InsertCertification): Promise<Certification>;
  
  getLanguages(): Promise<Language[]>;
  createLanguage(language: InsertLanguage): Promise<Language>;
}

export class DatabaseStorage implements IStorage {
  async getProfile(): Promise<Profile | undefined> {
    const [userProfile] = await db.select().from(profile).limit(1);
    return userProfile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db.insert(profile).values(insertProfile).returning();
    return newProfile;
  }

  async updateProfile(id: number, insertProfile: InsertProfile): Promise<Profile> {
    const [updated] = await db.update(profile)
      .set(insertProfile)
      .where(eq(profile.id, id))
      .returning();
    return updated;
  }

  async getEducation(): Promise<Education[]> {
    return await db.select().from(education);
  }

  async createEducation(insertEducation: InsertEducation): Promise<Education> {
    const [newEducation] = await db.insert(education).values(insertEducation).returning();
    return newEducation;
  }

  async getExperience(): Promise<Experience[]> {
    return await db.select().from(experience);
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const [newExperience] = await db.insert(experience).values(insertExperience).returning();
    return newExperience;
  }

  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(insertSkill).returning();
    return newSkill;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(insertProject).returning();
    return newProject;
  }

  async getCertifications(): Promise<Certification[]> {
    return await db.select().from(certifications);
  }

  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const [newCertification] = await db.insert(certifications).values(insertCertification).returning();
    return newCertification;
  }

  async getLanguages(): Promise<Language[]> {
    return await db.select().from(languages);
  }

  async createLanguage(insertLanguage: InsertLanguage): Promise<Language> {
    const [newLanguage] = await db.insert(languages).values(insertLanguage).returning();
    return newLanguage;
  }
}

export const storage = new DatabaseStorage();
