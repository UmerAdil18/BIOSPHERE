import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone, 
  Award, 
  Code2, 
  Globe,
  Download,
  Send,
  Loader2
} from 'lucide-react';
import { 
  useProfile, 
  useExperience, 
  useEducation, 
  useSkills, 
  useProjects,
  useCertifications,
  useLanguages
} from '@/hooks/use-portfolio';
import { useAuth } from '@/hooks/use-auth';
import { Navigation } from '@/components/Navigation';
import { SectionHeading } from '@/components/SectionHeading';
import { ExperienceCard } from '@/components/ExperienceCard';
import { ProjectCard } from '@/components/ProjectCard';
import { ContactForm } from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: experiences, isLoading: expLoading } = useExperience();
  const { data: education, isLoading: eduLoading } = useEducation();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: certifications, isLoading: certLoading } = useCertifications();
  const { data: languages, isLoading: langLoading } = useLanguages();

  // Redirect to signup if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/signup');
    }
  }, [user, authLoading, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-teal-500" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-heading italic">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <section id="about" className="min-h-screen relative flex items-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text Content */}
            <motion.div 
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Available Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-block px-4 py-1.5 mb-8 rounded-full border border-emerald-400 bg-emerald-50 text-emerald-600 text-sm font-medium"
              >
                Available for Work
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-2 leading-tight text-foreground">
                Hello, I'm
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">{profile?.name || user.name}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-6 font-medium">
                {profile?.title || user.title || "Professional"}
              </p>
              
              <p className="text-base text-muted-foreground mb-2 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {profile?.summary || user.summary || "Welcome to my portfolio."}
              </p>
              {(profile?.location || user.location) && (
                <p className="text-base text-muted-foreground mb-8">
                  Based in <span className="font-semibold text-foreground">{profile?.location || user.location}</span>.
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <Button className="h-12 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 rounded-lg font-medium text-base shadow-lg">
                  Contact Me <Send className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" className="h-12 px-6 rounded-lg border-border hover:bg-secondary font-medium text-base">
                  Download CV <Download className="ml-2 w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 text-muted-foreground">
                {(profile?.linkedin || user.linkedin) && (
                  <a href={profile?.linkedin || user.linkedin || "#"} className="hover:text-primary transition-colors p-2 rounded-lg hover:bg-secondary">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                <a href={`mailto:${profile?.email || user.email}`} className="hover:text-primary transition-colors p-2 rounded-lg hover:bg-secondary">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

            {/* Profile Image */}
            <motion.div 
              className="flex-1 relative flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-[3px] border-cyan-200/60"></div>
                {/* Inner gradient ring */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-100 via-sky-50 to-teal-100 p-1">
                  <div className="w-full h-full rounded-full bg-white overflow-hidden shadow-xl flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                      <span className="text-4xl font-heading font-bold text-teal-600">
                        {(profile?.name || user.name || "U").charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-cyan-100 rounded-full blur-xl opacity-60"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-teal-100 rounded-full blur-xl opacity-60"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section id="skills" className="py-24 relative overflow-hidden bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Technical Expertise" subtitle="Skills" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {skillsLoading ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl bg-muted" />)
              ) : (
                skills?.map((skillGroup, index) => (
                  <motion.div
                    key={skillGroup.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                        <Code2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-heading font-bold">{skillGroup.category}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((item, idx) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1.5 text-sm bg-secondary border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experiences && experiences.length > 0 && (
        <section id="experience" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Professional Experience" subtitle="Experience" />
            
            <div className="relative max-w-5xl mx-auto mt-12 space-y-8 md:space-y-12">
              {expLoading ? (
                 Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl bg-muted" />)
              ) : (
                experiences?.map((exp, index) => (
                  <ExperienceCard key={exp.id} experience={exp} index={index} />
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section id="projects" className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Featured Projects" subtitle="Projects" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
               {projectsLoading ? (
                 Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-xl bg-muted" />)
               ) : (
                 projects?.map((project, index) => (
                   <ProjectCard key={project.id} project={project} index={index} />
                 ))
               )}
            </div>
          </div>
        </section>
      )}

      {/* Education & Certifications */}
      {((education && education.length > 0) || (certifications && certifications.length > 0)) && (
        <section id="education" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Education */}
              {education && education.length > 0 && (
                <div>
                  <div className="mb-10 flex items-center gap-4">
                    <div className="h-px bg-border flex-1"></div>
                    <h3 className="text-2xl font-heading font-bold text-center">Education</h3>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                  
                  <div className="space-y-6">
                    {eduLoading ? (
                      Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl bg-muted" />)
                    ) : (
                      education?.map((edu, index) => (
                        <motion.div
                          key={edu.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-card p-6 rounded-xl border border-border border-l-4 border-l-teal-500 hover:shadow-md transition-all"
                        >
                          <h4 className="text-lg font-bold">{edu.degree}</h4>
                          <p className="text-teal-600 text-sm font-medium mt-1">{edu.institution}</p>
                          <p className="text-muted-foreground text-sm mt-2">{edu.year}</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications && certifications.length > 0 && (
                <div>
                  <div className="mb-10 flex items-center gap-4">
                    <div className="h-px bg-border flex-1"></div>
                    <h3 className="text-2xl font-heading font-bold text-center">Certifications</h3>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                  
                  <div className="space-y-6">
                    {certLoading ? (
                      Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl bg-muted" />)
                    ) : (
                      certifications?.map((cert, index) => (
                        <motion.div
                          key={cert.id}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border hover:shadow-md transition-all"
                        >
                          <div className="mt-1 p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full text-white">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold">{cert.title}</h4>
                            <p className="text-muted-foreground text-sm mt-1">Issued by <span className="text-foreground font-medium">{cert.issuer}</span></p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="py-12 border-y border-border bg-secondary/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex justify-center gap-8 md:gap-16 flex-wrap">
            {languages.map((lang) => (
               <div key={lang.id} className="flex items-center gap-2 text-muted-foreground">
                 <Globe className="w-4 h-4 text-teal-500" />
                 <span className="font-heading font-bold text-foreground">{lang.language}</span>
                 <span className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border">{lang.proficiency}</span>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
             >
               <span className="text-teal-600 font-bold tracking-widest uppercase text-sm mb-4 block">Get In Touch</span>
               <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Let's Work Together</h2>
               <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                 I'm currently available for freelance work and open to full-time opportunities.
                 If you have a project that needs some creative touch, let's chat.
               </p>
               
               <div className="space-y-6">
                 {(profile?.phone || user.phone) && (
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white">
                       <Phone className="w-5 h-5" />
                     </div>
                     <div>
                       <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                       <p className="text-lg font-medium">{profile?.phone || user.phone}</p>
                     </div>
                   </div>
                 )}
                 
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white">
                     <Mail className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                     <p className="text-lg font-medium">{profile?.email || user.email}</p>
                   </div>
                 </div>

                 {(profile?.location || user.location) && (
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white">
                       <MapPin className="w-5 h-5" />
                     </div>
                     <div>
                       <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                       <p className="text-lg font-medium">{profile?.location || user.location}</p>
                     </div>
                   </div>
                 )}
               </div>
             </motion.div>

             <motion.div
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
             >
               <ContactForm />
             </motion.div>

           </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent font-heading font-bold">{profile?.name || user.name}</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
