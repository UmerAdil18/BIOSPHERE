import { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'About', to: 'about' },
  { name: 'Experience', to: 'experience' },
  { name: 'Projects', to: 'projects' },
  { name: 'Skills', to: 'skills' },
  { name: 'Contact', to: 'contact' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(248, 250, 252, 0)", "rgba(248, 250, 252, 0.9)"]
  );

  const navBackdropBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      style={{ backgroundColor: navBackground, backdropFilter: navBackdropBlur }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled && "border-border py-2 shadow-sm",
        !scrolled && "py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 flex items-center"
          >
            <span className="font-heading text-2xl font-bold text-foreground">
              <span className="text-primary">M</span>. Umer
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <ScrollLink
                  to={item.to}
                  spy={true}
                  smooth={true}
                  offset={-100}
                  duration={500}
                  className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
                  activeClass="text-primary"
                >
                  {item.name}
                </ScrollLink>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ScrollLink
                to="contact"
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className="cursor-pointer px-6 py-2.5 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl"
              >
                Hire Me
              </ScrollLink>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary transition-colors p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass border-b border-border"
        >
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <ScrollLink
                key={item.name}
                to={item.to}
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className="block px-3 py-3 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-secondary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </ScrollLink>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
