import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { Project } from '@shared/schema';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative rounded-2xl overflow-hidden bg-card border border-border h-full flex flex-col hover:shadow-xl hover:border-teal-200 transition-all"
    >
      <div className="relative p-8 flex flex-col h-full">
        <div className="mb-auto">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
             <span className="text-xl font-heading font-bold text-white">{project.title.charAt(0)}</span>
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-3 font-heading group-hover:text-teal-600 transition-colors">
            {project.title}
          </h3>
          
          <p className="text-muted-foreground leading-relaxed mb-6">
            {project.description}
          </p>
        </div>

        {project.link && (
          <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">View Project</span>
            <a 
              href={project.link}
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-500 hover:text-white transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
    </motion.div>
  );
}
