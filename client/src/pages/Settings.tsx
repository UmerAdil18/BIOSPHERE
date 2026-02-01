import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, Plus, X, ArrowLeft, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
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
} from '@/components/ui/form';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import type { Education, Experience, Skill, Project, Certification, Language } from '@shared/schema';

const profileSchema = z.object({
  name: z.string().min(2),
  title: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user, logout, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/login');
    }
  }, [user, authLoading, setLocation]);

  // Fetch portfolio data
  const { data: experiences = [] } = useQuery<Experience[]>({ queryKey: ['/api/experience'] });
  const { data: educations = [] } = useQuery<Education[]>({ queryKey: ['/api/education'] });
  const { data: skills = [] } = useQuery<Skill[]>({ queryKey: ['/api/skills'] });
  const { data: projects = [] } = useQuery<Project[]>({ queryKey: ['/api/projects'] });
  const { data: certifications = [] } = useQuery<Certification[]>({ queryKey: ['/api/certifications'] });
  const { data: languages = [] } = useQuery<Language[]>({ queryKey: ['/api/languages'] });

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      title: user?.title || "",
      summary: user?.summary || "",
      location: user?.location || "",
      phone: user?.phone || "",
      linkedin: user?.linkedin || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        title: user.title || "",
        summary: user.summary || "",
        location: user.location || "",
        phone: user.phone || "",
        linkedin: user.linkedin || "",
      });
    }
  }, [user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileValues) => {
      const res = await apiRequest('PATCH', '/api/profile', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({ title: "Profile updated!" });
    },
  });

  // Delete mutations
  const deleteExperience = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/experience/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/experience'] });
      toast({ title: "Experience deleted" });
    },
  });

  const deleteEducation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/education/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/education'] });
      toast({ title: "Education deleted" });
    },
  });

  const deleteSkill = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/skills/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      toast({ title: "Skill deleted" });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/projects/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({ title: "Project deleted" });
    },
  });

  const deleteCertification = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/certifications/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/certifications'] });
      toast({ title: "Certification deleted" });
    },
  });

  const deleteLanguage = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/languages/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/languages'] });
      toast({ title: "Language deleted" });
    },
  });

  // Add new item states
  const [newExp, setNewExp] = useState({ company: '', role: '', duration: '', description: '' });
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', year: '' });
  const [newSkill, setNewSkill] = useState({ category: '', items: '' });
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '' });
  const [newCert, setNewCert] = useState({ title: '', issuer: '' });
  const [newLang, setNewLang] = useState({ language: '', proficiency: 'Fluent' });

  // Add mutations
  const addExperience = useMutation({
    mutationFn: async (data: typeof newExp) => {
      const res = await apiRequest('POST', '/api/experience', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/experience'] });
      setNewExp({ company: '', role: '', duration: '', description: '' });
      toast({ title: "Experience added" });
    },
  });

  const addEducation = useMutation({
    mutationFn: async (data: typeof newEdu) => {
      const res = await apiRequest('POST', '/api/education', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/education'] });
      setNewEdu({ institution: '', degree: '', year: '' });
      toast({ title: "Education added" });
    },
  });

  const addSkill = useMutation({
    mutationFn: async (data: { category: string; items: string[] }) => {
      const res = await apiRequest('POST', '/api/skills', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      setNewSkill({ category: '', items: '' });
      toast({ title: "Skills added" });
    },
  });

  const addProject = useMutation({
    mutationFn: async (data: typeof newProject) => {
      const res = await apiRequest('POST', '/api/projects', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setNewProject({ title: '', description: '', link: '' });
      toast({ title: "Project added" });
    },
  });

  const addCertification = useMutation({
    mutationFn: async (data: typeof newCert) => {
      const res = await apiRequest('POST', '/api/certifications', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/certifications'] });
      setNewCert({ title: '', issuer: '' });
      toast({ title: "Certification added" });
    },
  });

  const addLanguage = useMutation({
    mutationFn: async (data: typeof newLang) => {
      const res = await apiRequest('POST', '/api/languages', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/languages'] });
      setNewLang({ language: '', proficiency: 'Fluent' });
      toast({ title: "Language added" });
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'languages', label: 'Languages' },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
          <Button variant="outline" onClick={() => { logout(); setLocation('/'); }} data-testid="button-logout">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-border p-6">
            <h1 className="text-2xl font-heading font-bold">Portfolio Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your portfolio information</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-border overflow-x-auto">
            <div className="flex p-2 gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(data => updateProfileMutation.mutate(data))} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11" />
                        </FormControl>
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
                          <Input {...field} className="h-11" />
                        </FormControl>
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
                          <Textarea {...field} className="min-h-[120px]" />
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
                            <Input {...field} className="h-11" />
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
                            <Input {...field} className="h-11" />
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
                          <Input {...field} className="h-11" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                    data-testid="button-save-profile"
                  >
                    {updateProfileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </form>
              </Form>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="p-4 border border-border rounded-lg flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{exp.role}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteExperience.mutate(exp.id)}
                        data-testid={`button-delete-experience-${exp.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="p-4 border border-dashed border-border rounded-lg space-y-3">
                  <h4 className="font-medium">Add New Experience</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Company" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} />
                    <Input placeholder="Role" value={newExp.role} onChange={e => setNewExp({...newExp, role: e.target.value})} />
                  </div>
                  <Input placeholder="Duration" value={newExp.duration} onChange={e => setNewExp({...newExp, duration: e.target.value})} />
                  <Textarea placeholder="Description" value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} />
                  <Button 
                    onClick={() => addExperience.mutate(newExp)} 
                    disabled={!newExp.company || !newExp.role || addExperience.isPending}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Experience
                  </Button>
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {educations.map((edu) => (
                    <div key={edu.id} className="p-4 border border-border rounded-lg flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution} • {edu.year}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteEducation.mutate(edu.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="p-4 border border-dashed border-border rounded-lg space-y-3">
                  <h4 className="font-medium">Add New Education</h4>
                  <Input placeholder="Institution" value={newEdu.institution} onChange={e => setNewEdu({...newEdu, institution: e.target.value})} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Degree" value={newEdu.degree} onChange={e => setNewEdu({...newEdu, degree: e.target.value})} />
                    <Input placeholder="Year" value={newEdu.year} onChange={e => setNewEdu({...newEdu, year: e.target.value})} />
                  </div>
                  <Button 
                    onClick={() => addEducation.mutate(newEdu)} 
                    disabled={!newEdu.institution || !newEdu.degree || addEducation.isPending}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Education
                  </Button>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="p-4 border border-border rounded-lg flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{skill.category}</h4>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {skill.items.map((item, i) => (
                            <span key={i} className="px-2 py-0.5 bg-secondary rounded text-sm">{item}</span>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteSkill.mutate(skill.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="p-4 border border-dashed border-border rounded-lg space-y-3">
                  <h4 className="font-medium">Add New Skill Group</h4>
                  <Input placeholder="Category (e.g., Technical)" value={newSkill.category} onChange={e => setNewSkill({...newSkill, category: e.target.value})} />
                  <Input placeholder="Skills (comma separated)" value={newSkill.items} onChange={e => setNewSkill({...newSkill, items: e.target.value})} />
                  <Button 
                    onClick={() => addSkill.mutate({ category: newSkill.category, items: newSkill.items.split(',').map(s => s.trim()).filter(Boolean) })} 
                    disabled={!newSkill.category || !newSkill.items || addSkill.isPending}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Skills
                  </Button>
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-4 border border-border rounded-lg flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{proj.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>
                        {proj.link && <p className="text-sm text-teal-600 mt-1">{proj.link}</p>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteProject.mutate(proj.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="p-4 border border-dashed border-border rounded-lg space-y-3">
                  <h4 className="font-medium">Add New Project</h4>
                  <Input placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                  <Textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
                  <Input placeholder="Link (optional)" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} />
                  <Button 
                    onClick={() => addProject.mutate(newProject)} 
                    disabled={!newProject.title || addProject.isPending}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Project
                  </Button>
                </div>
              </div>
            )}

            {/* Certifications Tab */}
            {activeTab === 'certifications' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="p-4 border border-border rounded-lg flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{cert.title}</h4>
                        <p className="text-sm text-muted-foreground">Issued by {cert.issuer}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteCertification.mutate(cert.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="p-4 border border-dashed border-border rounded-lg space-y-3">
                  <h4 className="font-medium">Add New Certification</h4>
                  <Input placeholder="Certification Title" value={newCert.title} onChange={e => setNewCert({...newCert, title: e.target.value})} />
                  <Input placeholder="Issuer" value={newCert.issuer} onChange={e => setNewCert({...newCert, issuer: e.target.value})} />
                  <Button 
                    onClick={() => addCertification.mutate(newCert)} 
                    disabled={!newCert.title || addCertification.isPending}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Certification
                  </Button>
                </div>
              </div>
            )}

            {/* Languages Tab */}
            {activeTab === 'languages' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {languages.map((lang) => (
                    <div key={lang.id} className="p-4 border border-border rounded-lg flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{lang.language}</h4>
                        <p className="text-sm text-muted-foreground">{lang.proficiency}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteLanguage.mutate(lang.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="p-4 border border-dashed border-border rounded-lg space-y-3">
                  <h4 className="font-medium">Add New Language</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Language" value={newLang.language} onChange={e => setNewLang({...newLang, language: e.target.value})} />
                    <Input placeholder="Proficiency" value={newLang.proficiency} onChange={e => setNewLang({...newLang, proficiency: e.target.value})} />
                  </div>
                  <Button 
                    onClick={() => addLanguage.mutate(newLang)} 
                    disabled={!newLang.language || addLanguage.isPending}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Language
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
