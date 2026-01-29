import { motion } from 'framer-motion';
import { Calendar, Briefcase } from 'lucide-react';
import type { Experience } from '@shared/schema';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

export function ExperienceCard({ experience, index }: ExperienceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative pl-8 md:pl-0"
    >
      {/* Timeline Line (Desktop only) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2"></div>
      
      {/* Timeline Dot (Desktop only) */}
      <div className="hidden md:block absolute left-1/2 top-0 w-4 h-4 rounded-full bg-background border-2 border-primary -translate-x-1/2 z-10"></div>

      <div className={`md:flex items-start justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
        {/* Content Side */}
        <div className={`md:w-[45%] ${index % 2 === 0 ? 'text-left md:text-left' : 'text-left md:text-right'}`}>
          <div className="glass-card p-6 rounded-xl hover:bg-primary/5 transition-all group">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors font-heading mb-1">
              {experience.role}
            </h3>
            <div className={`flex items-center gap-2 text-primary text-sm font-medium mb-4 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
              <Briefcase className="w-4 h-4" />
              <span>{experience.company}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {experience.description}
            </p>
          </div>
        </div>

        {/* Date Side */}
        <div className={`md:w-[45%] mt-2 md:mt-0 ${index % 2 === 0 ? 'text-left md:text-right' : 'text-left md:text-left'}`}>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary text-xs font-medium text-muted-foreground ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
            <Calendar className="w-3 h-3 text-primary" />
            {experience.duration}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
