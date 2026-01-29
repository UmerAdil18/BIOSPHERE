import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
}

export function SectionHeading({ title, subtitle, alignment = 'center' }: SectionHeadingProps) {
  return (
    <div className={`mb-16 ${alignment === 'center' ? 'text-center' : 'text-left'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {subtitle && (
          <span className="block text-primary text-sm font-bold tracking-[0.2em] uppercase mb-3">
            {subtitle}
          </span>
        )}
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground relative inline-block">
          {title}
          <span className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60"></span>
        </h2>
      </motion.div>
    </div>
  );
}
