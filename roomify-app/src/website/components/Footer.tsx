import { motion } from "framer-motion";
import { Sparkles, Instagram, Twitter, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    Product: ['AI Studio', 'Gallery', 'Pricing', 'Mobile App', 'Enterprise'],
    Resources: ['Blog', 'Tutorials', 'Design Guide', 'API Docs', 'Support'],
    Company: ['About Us', 'Careers', 'Press Kit', 'Partners', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Licenses'],
  };

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', link: '#' },
    { icon: Twitter, label: 'Twitter', link: '#' },
    { icon: Facebook, label: 'Facebook', link: '#' },
    { icon: Youtube, label: 'Youtube', link: '#' },
  ];

  return (
    <footer className="bg-linear-to-br from-[#3a3a3a] to-[#1a1a1a] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 mb-6 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#c97b63] to-[#d4956f] flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl">Roomify</h3>
                <p className="text-xs text-white/60">Transform Your Space</p>
              </div>
            </motion.div>
            
            <p className="text-white/70 mb-6 leading-relaxed">
              The world's leading AI-powered interior design platform. 
              Transform any space in seconds with our cutting-edge technology.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@roomify.app</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-lg mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      whileHover={{ x: 5 }}
                      href="#"
                      className="text-white/70 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl mb-2">Stay Updated</h3>
              <p className="text-white/70">Get the latest design trends and AI updates delivered to your inbox.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 bg-white/10 border border-white/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c97b63] text-white placeholder-white/50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-linear-to-r from-[#c97b63] to-[#d4956f] px-8 py-3 rounded-xl shadow-lg whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          {/* Copyright */}
          <p className="text-white/60 text-sm">
            © 2025 Roomify. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.link}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#c97b63] transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </div>

          {/* Additional Links */}
          <div className="flex items-center gap-4 text-sm text-white/60">
            <motion.a
              whileHover={{ color: '#fff' }}
              href="#"
            >
              Privacy
            </motion.a>
            <span>•</span>
            <motion.a
              whileHover={{ color: '#fff' }}
              href="#"
            >
              Terms
            </motion.a>
            <span>•</span>
            <motion.a
              whileHover={{ color: '#fff' }}
              href="#"
            >
              Cookies
            </motion.a>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="h-1 bg-linear-to-r from-[#c97b63] via-[#d4956f] to-[#c97b63]" />
    </footer>
  );
}
