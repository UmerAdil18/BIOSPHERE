import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone, 
  Award, 
  Code2, 
  Globe,
  Download
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
import { Navigation } from '@/components/Navigation';
import { SectionHeading } from '@/components/SectionHeading';
import { ExperienceCard } from '@/components/ExperienceCard';
import { ProjectCard } from '@/components/ProjectCard';
import { ContactForm } from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: experiences, isLoading: expLoading } = useExperience();
  const { data: education, isLoading: eduLoading } = useEducation();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: certifications, isLoading: certLoading } = useCertifications();
  const { data: languages, isLoading: langLoading } = useLanguages();

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-heading italic">Loading Masterpiece...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      <Navigation />

      {/* Hero Section */}
      <section id="about" className="min-h-screen relative flex items-center justify-center pt-20 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-40"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-300/20 rounded-full blur-[120px] opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            {/* Text Content */}
            <motion.div 
              className="flex-1 text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase"
              >
                Frontend Developer & Designer
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight">
                Hello, I'm <br />
                <span className="text-blue-gradient drop-shadow-sm">{profile?.name}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed font-light">
                {profile?.summary}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <Button className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold text-base shadow-lg hover:shadow-xl transition-all">
                  View My Work
                </Button>
                <Button variant="outline" className="h-12 px-8 rounded-full border-border hover:bg-secondary font-medium text-base">
                  <Download className="mr-2 w-4 h-4" /> Download CV
                </Button>
              </div>

              <div className="mt-12 flex items-center justify-center md:justify-start gap-6 text-muted-foreground">
                <a href={profile?.linkedin} className="hover:text-primary transition-colors hover:scale-110 transform duration-200">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href={`mailto:${profile?.email}`} className="hover:text-primary transition-colors hover:scale-110 transform duration-200">
                  <Mail className="w-6 h-6" />
                </a>
                <div className="w-px h-8 bg-border mx-2"></div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  {profile?.location}
                </div>
              </div>
            </motion.div>

            {/* Profile Image */}
            <motion.div 
              className="flex-1 relative"
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] mx-auto">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-primary/30 to-sky-200/30 rotate-6 transform translate-x-4 translate-y-4"></div>
                <div className="absolute inset-0 rounded-[2rem] border border-border bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl">
                  <img 
                    src="/images/profile.png" 
                    alt={profile?.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary rounded-full blur-2xl opacity-30"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-sky-400 rounded-full blur-2xl opacity-20"></div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center pt-2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 relative bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Professional Experience" subtitle="My Career Journey" />
          
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

      {/* Skills Section */}
      <section id="skills" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Technical Expertise" subtitle="Tools & Technologies" />

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
                  className="glass-card p-8 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-heading font-bold">{skillGroup.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((item, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 text-sm bg-secondary border border-border rounded-md hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all cursor-default"
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

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Featured Projects" subtitle="Recent Works" />

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

      {/* Education & Certifications - Two Column Layout */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Education */}
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
                      className="glass-card p-6 rounded-xl border-l-4 border-l-primary"
                    >
                      <h4 className="text-lg font-bold">{edu.degree}</h4>
                      <p className="text-primary text-sm font-medium mt-1">{edu.institution}</p>
                      <p className="text-muted-foreground text-sm mt-2">{edu.year}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Certifications */}
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
                      className="flex items-start gap-4 p-6 glass-card rounded-xl"
                    >
                      <div className="mt-1 p-2 bg-primary/10 rounded-full text-primary">
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

          </div>
        </div>
      </section>

      {/* Languages Ticker */}
      {languages && languages.length > 0 && (
        <div className="py-12 border-y border-border bg-secondary/30 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex justify-center gap-8 md:gap-16 flex-wrap">
            {languages.map((lang) => (
               <div key={lang.id} className="flex items-center gap-2 text-muted-foreground">
                 <Globe className="w-4 h-4 text-primary" />
                 <span className="font-heading font-bold text-foreground">{lang.language}</span>
                 <span className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border">{lang.proficiency}</span>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
         {/* Background glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             
             <motion.div
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
             >
               <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Get In Touch</span>
               <h2 className="text-5xl font-heading font-bold mb-6">Let's Work Together</h2>
               <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                 I'm currently available for freelance work and open to full-time opportunities.
                 If you have a project that needs some creative touch, let's chat.
               </p>
               
               <div className="space-y-6">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary border border-border">
                     <Phone className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                     <p className="text-lg font-medium">{profile?.phone}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary border border-border">
                     <Mail className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                     <p className="text-lg font-medium">{profile?.email}</p>
                   </div>
                 </div>

                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary border border-border">
                     <MapPin className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                     <p className="text-lg font-medium">{profile?.location}</p>
                   </div>
                 </div>
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
      <footer className="py-8 border-t border-border bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} <span className="text-primary font-heading font-bold">Muhammad Umer Adil</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
