import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import DotGrid from './DotGrid';

const Footer = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  const mainLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.services'), path: '/services' },
    { label: t('nav.government'), path: '/government' },
    { label: t('nav.documents'), path: '/documents' },
    { label: t('nav.schemes'), path: '/schemes' },
    { label: t('nav.news'), path: '/news' },
    { label: t('nav.help'), path: '/help' },
  ];

  const serviceLinks = [
    { label: t('services.cat.onlineServices'), path: '/services' },
    { label: t('services.cat.grievances'), path: '/services' },
    { label: t('services.cat.forms'), path: '/services' },
    { label: t('services.cat.jobOpportunity'), path: '/services' },
    { label: t('services.cat.mobileAppDirectory'), path: '/services' },
    { label: t('services.cat.importantWebsites'), path: '/services' },
  ];

  const govLinks = [
    { label: t('gov.ministers'), path: '/government' },
    { label: t('gov.departments'), path: '/government' },
    { label: t('gov.districts'), path: '/government' },
    { label: t('gov.agencies'), path: '/government' },
    { label: t('schemes.cat.beneficiary'), path: '/schemes' },
    { label: t('schemes.cat.category'), path: '/schemes' },
  ];

  const footerAccent = isDark ? '#008250' : '#00a800';
  const footerHover = isDark ? '#00a666' : '#00c000';
  const footerBorder = isDark ? '#008250' : '#005600';
  const footerGlow1 = isDark ? 'rgba(0, 130, 80, 0.1)' : 'rgba(0, 86, 0, 0.1)';
  const footerGlow2 = isDark ? 'rgba(0, 130, 80, 0.05)' : 'rgba(0, 86, 0, 0.05)';
  const footerBtnHoverBg = isDark ? 'rgba(0, 130, 80, 0.2)' : 'rgba(0, 86, 0, 0.2)';

  return (
    <footer 
      className="relative bg-[#040904] text-gray-300 border-t pt-16 pb-8 z-10 shrink-0 w-full overflow-hidden select-none"
      style={{
        borderColor: isDark ? 'rgba(0, 130, 80, 0.25)' : 'rgba(0, 86, 0, 0.25)',
        '--footer-accent': footerAccent,
        '--footer-hover': footerHover,
        '--footer-border': footerBorder,
        '--footer-btn-hover-bg': footerBtnHoverBg,
      }}
    >
      {/* Interactive DotGrid Background */}
      <div className="absolute inset-0 z-0 opacity-[1] pointer-events-auto">
        <DotGrid
          dotSize={3}
          gap={20}
          baseColor="#0a2a0a"
          activeColor={footerAccent}
          proximity={100}
          shockRadius={200}
          shockStrength={3}
          resistance={600}
          returnDuration={1.8}
        />
      </div>

     

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="TN Emblem" className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(0,86,0,0.5)]" />
              <div>
                <h3 className="font-outfit font-bold text-white text-base tracking-wider uppercase leading-tight">
                  {language === 'en' ? 'Government' : 'தமிழ்நாடு'}
                </h3>
                <p 
                  className="font-outfit font-semibold text-xs tracking-widest uppercase leading-none mt-1"
                  style={{ color: 'var(--footer-accent)' }}
                >
                  {language === 'en' ? 'of Tamil Nadu' : 'அரசு'}
                </p>
              </div>
            </div>
            
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm mt-2">
              {language === 'en' 
                ? 'Official State Portal of the Government of Tamil Nadu. Integrated gateway to access all public services, schemes, and departments online.' 
                : 'தமிழ்நாடு அரசின் அதிகாரப்பூர்வ மாநில இணையதளம். அனைத்து பொதுச் சேவைகள், நலத்திட்டங்கள் மற்றும் துறைகளை ஆன்லைனில் அணுகும் ஒருங்கிணைந்த தளம்.'}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 mt-2">
              {[
                { 
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-3.3 0-6 2.7-6 6v1z" />
                    </svg>
                  ), 
                  href: 'https://www.facebook.com/CMOTamilnadu/' 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.2 2.4h3.3L14.3 11l8.5 11.3h-6.7L11 15.9l-6 6.4H1.7l7.6-8.7L1.2 2.4h6.9l4.9 6.5 5.2-6.5zm-1.2 17.6h1.8L7.1 4.7H5.2l11.8 15.3z" />
                    </svg>
                  ), 
                  href: 'https://x.com/CMOTamilnadu' 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  ), 
                  href: 'https://www.instagram.com/cmotamilnadu/' 
                }
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-[var(--footer-accent)] hover:bg-[var(--footer-btn-hover-bg)] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-outfit font-bold text-white text-sm tracking-wider uppercase border-l-2 border-[var(--footer-border)] pl-3">
              {language === 'en' ? 'Quick Links' : 'விரைவு இணைப்புகள்'}
            </h4>
            <ul className="flex flex-col gap-2.5 mt-2">
              {mainLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-[var(--footer-hover)] text-xs font-medium transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[var(--footer-hover)] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Megamenu Services */}
          <div className="flex flex-col gap-4">
            <h4 className="font-outfit font-bold text-white text-sm tracking-wider uppercase border-l-2 border-[var(--footer-border)] pl-3">
              {language === 'en' ? 'Online Services' : 'இணையச் சேவைகள்'}
            </h4>
            <ul className="flex flex-col gap-2.5 mt-2">
              {serviceLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-[var(--footer-hover)] text-xs font-medium transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[var(--footer-hover)] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Megamenu Government & Schemes */}
          <div className="flex flex-col gap-4">
            <h4 className="font-outfit font-bold text-white text-sm tracking-wider uppercase border-l-2 border-[var(--footer-border)] pl-3">
              {language === 'en' ? 'Governance & Schemes' : 'ஆளுமை & திட்டங்கள்'}
            </h4>
            <ul className="flex flex-col gap-2.5 mt-2">
              {govLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-[var(--footer-hover)] text-xs font-medium transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-[var(--footer-hover)] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Secretariat & Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-outfit font-bold text-white text-sm tracking-wider uppercase border-l-2 border-[var(--footer-border)] pl-3">
              {language === 'en' ? 'Contact Details' : 'தொடர்பு முகவரி'}
            </h4>
            <ul className="flex flex-col gap-4 mt-2">
              <li className="flex gap-3 items-start text-xs text-gray-400">
                <MapPin size={16} className="text-[var(--footer-accent)] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {language === 'en' 
                    ? 'Secretariat, Fort St. George, Chennai - 600009, Tamil Nadu, India.' 
                    : 'தலைமைச் செயலகம், புனித ஜார்ஜ் கோட்டை, சென்னை - 600009, தமிழ்நாடு, இந்தியா.'}
                </span>
              </li>
              <li className="flex gap-3 items-center text-xs text-gray-400">
                <Phone size={16} className="text-[var(--footer-accent)] shrink-0" />
                <span>+91-44-2567 1878</span>
              </li>
              <li className="flex gap-3 items-center text-xs text-gray-400">
                <Mail size={16} className="text-[var(--footer-accent)] shrink-0" />
                <a href="mailto:webmanager@tn.gov.in" className="hover:text-[var(--footer-hover)] transition-colors">
                  webmanager@tn.gov.in
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5 mb-8" />

        {/* Bottom Bar: Copyrights & Policy Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-500 text-[11px] font-medium text-center md:text-left flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[var(--footer-accent)]" />
            <span>
              {language === 'en' 
                ? `© ${currentYear} Government of Tamil Nadu. All rights reserved.` 
                : `© ${currentYear} தமிழ்நாடு அரசு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.`}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-medium text-gray-500">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="hover:text-[var(--footer-hover)] text-gray-400 font-semibold transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider pr-4 border-r border-white/10"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-[var(--footer-accent)]" />}
              <span>{isDark ? (language === 'en' ? 'Light' : 'ஒளி') : (language === 'en' ? 'Dark' : 'இருள்')}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="hover:text-[var(--footer-hover)] text-gray-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              aria-label="Switch Language"
            >
              <svg className="w-3.5 h-3.5 fill-current opacity-75 text-[var(--footer-accent)] shrink-0" viewBox="0 0 24 24">
                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
              </svg>
              <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
