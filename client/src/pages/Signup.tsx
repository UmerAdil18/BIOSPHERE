import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, UserPlus, ArrowLeft, Plus, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name is required"),
  title: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
});

type SignupValues = z.infer<typeof signupSchema>;

type ExperienceEntry = {
  company: string;
  role: string;
  duration: string;
  description: string;
};

type EducationEntry = {
  institution: string;
  degree: string;
  year: string;
};

type SkillEntry = {
  category: string;
  items: string;
};

type ProjectEntry = {
  title: string;
  description: string;
  link: string;
};

type CertificationEntry = {
  title: string;
  issuer: string;
};

type LanguageEntry = {
  language: string;
  proficiency: string;
};

export default function Signup() {
  const [, setLocation] = useLocation();
  const { signup } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Portfolio data
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
  const [educations, setEducations] = useState<EducationEntry[]>([]);
  const [skillsList, setSkillsList] = useState<SkillEntry[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectEntry[]>([]);
  const [certificationsList, setCertificationsList] = useState<CertificationEntry[]>([]);
  const [languagesList, setLanguagesList] = useState<LanguageEntry[]>([]);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      title: "",
      summary: "",
      location: "",
      phone: "",
      linkedin: "",
    },
  });

  // Add entry handlers
  const addExperience = () => setExperiences([...experiences, { company: "", role: "", duration: "", description: "" }]);
  const addEducation = () => setEducations([...educations, { institution: "", degree: "", year: "" }]);
  const addSkill = () => setSkillsList([...skillsList, { category: "", items: "" }]);
  const addProject = () => setProjectsList([...projectsList, { title: "", description: "", link: "" }]);
  const addCertification = () => setCertificationsList([...certificationsList, { title: "", issuer: "" }]);
  const addLanguage = () => setLanguagesList([...languagesList, { language: "", proficiency: "Fluent" }]);

  // Remove entry handlers
  const removeExperience = (idx: number) => setExperiences(experiences.filter((_, i) => i !== idx));
  const removeEducation = (idx: number) => setEducations(educations.filter((_, i) => i !== idx));
  const removeSkill = (idx: number) => setSkillsList(skillsList.filter((_, i) => i !== idx));
  const removeProject = (idx: number) => setProjectsList(projectsList.filter((_, i) => i !== idx));
  const removeCertification = (idx: number) => setCertificationsList(certificationsList.filter((_, i) => i !== idx));
  const removeLanguage = (idx: number) => setLanguagesList(languagesList.filter((_, i) => i !== idx));

  // Update entry handlers
  const updateExperience = (idx: number, field: keyof ExperienceEntry, value: string) => {
    const updated = [...experiences];
    updated[idx] = { ...updated[idx], [field]: value };
    setExperiences(updated);
  };

  const updateEducation = (idx: number, field: keyof EducationEntry, value: string) => {
    const updated = [...educations];
    updated[idx] = { ...updated[idx], [field]: value };
    setEducations(updated);
  };

  const updateSkill = (idx: number, field: keyof SkillEntry, value: string) => {
    const updated = [...skillsList];
    updated[idx] = { ...updated[idx], [field]: value };
    setSkillsList(updated);
  };

  const updateProject = (idx: number, field: keyof ProjectEntry, value: string) => {
    const updated = [...projectsList];
    updated[idx] = { ...updated[idx], [field]: value };
    setProjectsList(updated);
  };

  const updateCertification = (idx: number, field: keyof CertificationEntry, value: string) => {
    const updated = [...certificationsList];
    updated[idx] = { ...updated[idx], [field]: value };
    setCertificationsList(updated);
  };

  const updateLanguage = (idx: number, field: keyof LanguageEntry, value: string) => {
    const updated = [...languagesList];
    updated[idx] = { ...updated[idx], [field]: value };
    setLanguagesList(updated);
  };

  async function onSubmit(data: SignupValues) {
    setIsLoading(true);
    try {
      await signup(data);
      
      // Add portfolio entries
      for (const exp of experiences.filter(e => e.company && e.role)) {
        await apiRequest('POST', '/api/experience', exp);
      }
      for (const edu of educations.filter(e => e.institution && e.degree)) {
        await apiRequest('POST', '/api/education', edu);
      }
      for (const skill of skillsList.filter(s => s.category && s.items)) {
        await apiRequest('POST', '/api/skills', { 
          category: skill.category, 
          items: skill.items.split(',').map(s => s.trim()).filter(Boolean) 
        });
      }
      for (const proj of projectsList.filter(p => p.title)) {
        await apiRequest('POST', '/api/projects', proj);
      }
      for (const cert of certificationsList.filter(c => c.title)) {
        await apiRequest('POST', '/api/certifications', cert);
      }
      for (const lang of languagesList.filter(l => l.language)) {
        await apiRequest('POST', '/api/languages', lang);
      }

      // Invalidate all queries
      queryClient.invalidateQueries();
      
      toast({ title: "Account created!", description: "Your portfolio is ready." });
      setLocation('/');
    } catch (err) {
      // Error handled in auth hook
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">Create Your Portfolio</h1>
            <p className="text-muted-foreground">
              Step {step} of 3 - {step === 1 ? 'Basic Info' : step === 2 ? 'Experience & Education' : 'Skills & Projects'}
            </p>
            <div className="flex gap-2 justify-center mt-4">
              {[1, 2, 3].map(s => (
                <div 
                  key={s} 
                  className={`w-16 h-2 rounded-full ${s <= step ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-secondary'}`}
                />
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} className="h-11" data-testid="input-signup-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password *</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Min 6 characters" {...field} className="h-11" data-testid="input-signup-password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Muhammad Umer Adil" {...field} className="h-11" data-testid="input-signup-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Web Developer | Designer" {...field} className="h-11" />
                        </FormControl>
                        <FormDescription>Leave blank if not applicable</FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About You</FormLabel>
                        <FormControl>
                          <Textarea placeholder="A brief description about yourself..." {...field} className="min-h-[100px]" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Karachi, Pakistan" {...field} className="h-11" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+92-XXX-XXXXXXX" {...field} className="h-11" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input placeholder="linkedin.com/in/yourprofile" {...field} className="h-11" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Step 2: Experience & Education */}
              {step === 2 && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Work Experience</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                    {experiences.map((exp, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Experience {idx + 1}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeExperience(idx)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="Company" value={exp.company} onChange={e => updateExperience(idx, 'company', e.target.value)} />
                          <Input placeholder="Role" value={exp.role} onChange={e => updateExperience(idx, 'role', e.target.value)} />
                        </div>
                        <Input placeholder="Duration (e.g., 2023 - Present)" value={exp.duration} onChange={e => updateExperience(idx, 'duration', e.target.value)} />
                        <Textarea placeholder="Description" value={exp.description} onChange={e => updateExperience(idx, 'description', e.target.value)} />
                      </div>
                    ))}
                    {experiences.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No experience added yet. Click Add to include your work history.</p>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Education</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                    {educations.map((edu, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Education {idx + 1}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(idx)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input placeholder="Institution" value={edu.institution} onChange={e => updateEducation(idx, 'institution', e.target.value)} />
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="Degree" value={edu.degree} onChange={e => updateEducation(idx, 'degree', e.target.value)} />
                          <Input placeholder="Year" value={edu.year} onChange={e => updateEducation(idx, 'year', e.target.value)} />
                        </div>
                      </div>
                    ))}
                    {educations.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No education added yet.</p>
                    )}
                  </div>
                </>
              )}

              {/* Step 3: Skills & Projects */}
              {step === 3 && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Skills</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                    {skillsList.map((skill, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Skill Group {idx + 1}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeSkill(idx)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input placeholder="Category (e.g., Technical, Design)" value={skill.category} onChange={e => updateSkill(idx, 'category', e.target.value)} />
                        <Input placeholder="Skills (comma separated: React, Node.js, CSS)" value={skill.items} onChange={e => updateSkill(idx, 'items', e.target.value)} />
                      </div>
                    ))}
                    {skillsList.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No skills added yet.</p>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Projects</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addProject}>
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                    {projectsList.map((proj, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Project {idx + 1}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeProject(idx)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input placeholder="Project Title" value={proj.title} onChange={e => updateProject(idx, 'title', e.target.value)} />
                        <Textarea placeholder="Description" value={proj.description} onChange={e => updateProject(idx, 'description', e.target.value)} />
                        <Input placeholder="Link (optional)" value={proj.link} onChange={e => updateProject(idx, 'link', e.target.value)} />
                      </div>
                    ))}
                    {projectsList.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No projects added yet.</p>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Certifications</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addCertification}>
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                    {certificationsList.map((cert, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Certification {idx + 1}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeCertification(idx)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input placeholder="Certification Title" value={cert.title} onChange={e => updateCertification(idx, 'title', e.target.value)} />
                        <Input placeholder="Issuer" value={cert.issuer} onChange={e => updateCertification(idx, 'issuer', e.target.value)} />
                      </div>
                    ))}
                    {certificationsList.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No certifications added yet.</p>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Languages</h3>
                      <Button type="button" variant="outline" size="sm" onClick={addLanguage}>
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </Button>
                    </div>
                    {languagesList.map((lang, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Language {idx + 1}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeLanguage(idx)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input placeholder="Language" value={lang.language} onChange={e => updateLanguage(idx, 'language', e.target.value)} />
                          <Input placeholder="Proficiency" value={lang.proficiency} onChange={e => updateLanguage(idx, 'proficiency', e.target.value)} />
                        </div>
                      </div>
                    ))}
                    {languagesList.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No languages added yet.</p>
                    )}
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex gap-4 pt-6">
                {step > 1 && (
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
                    Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button 
                    type="button" 
                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white" 
                    onClick={() => setStep(step + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                    data-testid="button-create-account"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" /> Create Account
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-600 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
