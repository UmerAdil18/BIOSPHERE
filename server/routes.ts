import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Profile
  app.get(api.profile.get.path, async (_req, res) => {
    const profile = await storage.getProfile();
    res.json(profile || {}); 
  });

  app.post(api.profile.update.path, async (req, res) => {
    try {
      const input = api.profile.update.input.parse(req.body);
      const existing = await storage.getProfile();
      let profile;
      if (existing) {
        profile = await storage.updateProfile(existing.id, input);
      } else {
        profile = await storage.createProfile(input);
      }
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json(err.errors);
      } else {
        throw err;
      }
    }
  });

  // Education
  app.get(api.education.list.path, async (_req, res) => {
    const data = await storage.getEducation();
    res.json(data);
  });

  // Experience
  app.get(api.experience.list.path, async (_req, res) => {
    const data = await storage.getExperience();
    res.json(data);
  });

  // Skills
  app.get(api.skills.list.path, async (_req, res) => {
    const data = await storage.getSkills();
    res.json(data);
  });

  // Projects
  app.get(api.projects.list.path, async (_req, res) => {
    const data = await storage.getProjects();
    res.json(data);
  });

  // Certifications
  app.get(api.certifications.list.path, async (_req, res) => {
    const data = await storage.getCertifications();
    res.json(data);
  });

  // Languages
  app.get(api.languages.list.path, async (_req, res) => {
    const data = await storage.getLanguages();
    res.json(data);
  });

  // Contact
  app.post(api.contact.send.path, async (req, res) => {
    // In a real app, send email here
    console.log("Contact form submitted:", req.body);
    res.json({ success: true });
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const profile = await storage.getProfile();
  if (!profile) {
    await storage.createProfile({
      name: "MUHAMMAD UMER ADIL",
      title: "Web Developer | Graphic Designer | Tech Enthusiast",
      summary: "Motivated and responsible student with strong technical and computer skills. Quick learner with adaptability to different environments. Passionate about technology, web development, graphic design, and cybersecurity.",
      location: "Karachi, Pakistan",
      phone: "+92-330-6898730",
      email: "umeroffi18@gmail.com",
      linkedin: "linkedin.com/in/m-umer-adil-84b7753a2",
      imageUrl: "/images/profile.png"
    });

    await storage.createEducation({
      institution: "DJ Sindh Government Science College, Karachi",
      degree: "Intermediate in Computer Science",
      year: "In Progress"
    });
    await storage.createEducation({
      institution: "Usman Public School System, Karachi",
      degree: "Matriculation in Computer Science",
      year: "Completed"
    });

    await storage.createExperience({
      company: "Qavi Tech Software House",
      role: "Angular Intern",
      duration: "Paid Internship",
      description: "Worked on Angular web development projects. Gained frontend development experience. Collaborated with team members."
    });

    await storage.createSkill({
      category: "Technical",
      items: ["JavaScript", "React", "React Native (Basic)", "Angular (Basic)", "WordPress", "AutoCAD", "MS Office"]
    });
    await storage.createSkill({
      category: "Design",
      items: ["Adobe Photoshop", "Illustrator", "Canva"]
    });
    await storage.createSkill({
      category: "Soft Skills",
      items: ["Communication", "Teamwork", "Time Management", "Problem Solving"]
    });

    await storage.createProject({
      title: "WordPress Websites",
      description: "Developed 2 live websites for USA-based clients.",
      link: "#"
    });
    await storage.createProject({
      title: "AutoCAD Projects",
      description: "Completed 3-4 real-world architectural/design projects.",
      link: "#"
    });
    await storage.createProject({
      title: "Web Development",
      description: "Various projects using JavaScript, React, and React Native.",
      link: "#"
    });

    await storage.createCertification({
      title: "Web Development (JS, React, React Native)",
      issuer: "Squad CodersDev"
    });
    await storage.createCertification({
      title: "Graphic Designing",
      issuer: "Bano Qabil"
    });
    await storage.createCertification({
      title: "Cyber Security",
      issuer: "NED University (Currently Enrolled)"
    });
    await storage.createCertification({
      title: "AutoCAD",
      issuer: "Self-learned"
    });

    await storage.createLanguage({
      language: "English",
      proficiency: "Fluent"
    });
    await storage.createLanguage({
      language: "Urdu",
      proficiency: "Native"
    });
  }
}
