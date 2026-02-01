import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Profile, Education, Experience, Skill, Project, Certification, Language } from "@shared/schema";

export function useProfile() {
  return useQuery<Profile>({
    queryKey: ['/api/profile'],
  });
}

export function useEducation() {
  return useQuery<Education[]>({
    queryKey: ['/api/education'],
  });
}

export function useExperience() {
  return useQuery<Experience[]>({
    queryKey: ['/api/experience'],
  });
}

export function useSkills() {
  return useQuery<Skill[]>({
    queryKey: ['/api/skills'],
  });
}

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
}

export function useCertifications() {
  return useQuery<Certification[]>({
    queryKey: ['/api/certifications'],
  });
}

export function useLanguages() {
  return useQuery<Language[]>({
    queryKey: ['/api/languages'],
  });
}

export function useContactForm() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: { name: string; email: string; message: string; userId: number }) => {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. I will get back to you soon.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    }
  });
}
