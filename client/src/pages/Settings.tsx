import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, Plus, X, ArrowLeft, LogOut, Trash2, Upload, FileText, Mail, Eye } from 'lucide-react';
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
import type { Education, Experience, Skill, Project, Certification, Language, ContactMessage } from '@shared/schema';

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
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/login');
    }
  }, [user, authLoading, setLocation]);

  const { data: experiences = [] } = useQuery<Experience[]>({ queryKey: ['/api/experience'] });
  const { data: educations = [] } = useQuery<Education[]>({ queryKey: ['/api/education'] });
  const { data: skills = [] } = useQuery<Skill[]>({ queryKey: ['/api/skills'] });
  const { data: projects = [] } = useQuery<Project[]>({ queryKey: ['/api/projects'] });
  const { data: certifications = [] } = useQuery<Certification[]>({ queryKey: ['/api/certifications'] });
  const { data: languages = [] } = useQuery<Language[]>({ queryKey: ['/api/languages'] });
  const { data: messages = [] } = useQuery<ContactMessage[]>({ queryKey: ['/api/messages'] });

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

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({ title: "Profile image updated!" });
    },
    onError: () => {
      toast({ title: "Failed to upload image", variant: "destructive" });
    },
  });

  const uploadCvMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('cv', file);
      const res = await fetch('/api/upload/cv', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Upload failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({ title: "CV uploaded successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to upload CV", variant: "destructive" });
    },
  });

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

  const deleteMessage = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/messages/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
      toast({ title: "Message deleted" });
    },
  });

  const [newExp, setNewExp] = useState({ company: '', role: '', duration: '', description: '' });
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', year: '' });
  const [newSkill, setNewSkill] = useState({ category: '', items: '' });
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '' });
  const [newCert, setNewCert] = useState({ title: '', issuer: '' });
  const [newLang, setNewLang] = useState({ language: '', proficiency: 'Fluent' });

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImageMutation.mutate(file);
    }
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadCvMutation.mutate(file);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!user) return null;

  const unreadMessages = messages.filter(m => !m.isRead).length;

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'languages', label: 'Languages' },
    { id: 'messages', label: `Messages${unreadMessages > 0 ? ` (${unreadMessages})` : ''}` },
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
              <div className="space-y-8">
                {/* Profile Image Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-border rounded-xl bg-secondary/30">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center border-4 border-white shadow-lg">
                      {user.imageUrl ? (
                        <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-heading font-bold text-teal-600">
                          {(user.name || "U").charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold mb-2">Profile Photo</h3>
                    <p className="text-sm text-muted-foreground mb-3">Upload a photo for your portfolio</p>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => imageInputRef.current?.click()}
                      disabled={uploadImageMutation.isPending}
                    >
                      {uploadImageMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Upload Image
                    </Button>
                  </div>
                </div>

                {/* CV Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-border rounded-xl bg-secondary/30">
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center border-4 border-white shadow-lg">
                    <FileText className="w-10 h-10 text-teal-600" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold mb-2">CV / Resume</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {user.cvUrl ? "Your CV is uploaded. Visitors can download it." : "Upload your CV for visitors to download"}
                    </p>
                    <input
                      ref={cvInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvUpload}
                      className="hidden"
                    />
                    <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                      <Button 
                        variant="outline" 
                        onClick={() => cvInputRef.current?.click()}
                        disabled={uploadCvMutation.isPending}
                      >
                        {uploadCvMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        {user.cvUrl ? "Replace CV" : "Upload CV"}
                      </Button>
                      {user.cvUrl && (
                        <a href={user.cvUrl} download>
                          <Button variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Download CV
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
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
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="p-4 border border-border rounded-lg flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{exp.role}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company} - {exp.duration}</p>
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
                    {addExperience.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Save Changes
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
                        <p className="text-sm text-muted-foreground">{edu.institution} - {edu.year}</p>
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
                    {addEducation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
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
                    {addSkill.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
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
                    {addProject.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
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
                    {addCertification.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
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
                    {addLanguage.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Mail className="w-5 h-5" />
                  <span>Messages from your portfolio visitors</span>
                </div>
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">When someone sends you a message through your portfolio, it will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`p-4 border rounded-lg ${msg.isRead ? 'border-border' : 'border-teal-500 bg-teal-50/50'}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{msg.senderName}</h4>
                              {!msg.isRead && (
                                <span className="px-2 py-0.5 text-xs bg-teal-500 text-white rounded-full">New</span>
                              )}
                            </div>
                            <p className="text-sm text-teal-600 mb-2">{msg.senderEmail}</p>
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteMessage.mutate(msg.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
