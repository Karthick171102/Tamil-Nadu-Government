import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowRight, FileText, X,
  Globe, Phone, Briefcase, ExternalLink, Users, BarChart3, ClipboardList, MessageSquare, Shield, Smartphone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PixelCard from '../components/PixelCard';

const ServicesHub = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { label: t('services.cat.onlineServices'), icon: Globe, desc: t('services.cat.onlineServicesDesc'), image: 'https://images.unsplash.com/photo-1588702547884-909355b9439d?auto=format&fit=crop&w=600&q=80', color: '#005600', path: '/services/online' },
    { label: t('services.cat.contactDirectory'), icon: Phone, desc: t('services.cat.contactDirectoryDesc'), image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?auto=format&fit=crop&w=600&q=80', color: '#005600', path: '#' },
    { label: t('services.cat.jobOpportunity'), icon: Briefcase, desc: t('services.cat.jobOpportunityDesc'), image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80', color: '#005600', path: '#' },
    { label: t('services.cat.importantWebsites'), icon: ExternalLink, desc: t('services.cat.importantWebsitesDesc'), image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', color: '#005600', path: '#' },
    { label: t('services.cat.census'), icon: Users, desc: t('services.cat.censusDesc'), image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80', color: '#005600', path: '#' },
    { label: t('services.cat.statistics'), icon: BarChart3, desc: t('services.cat.statisticsDesc'), image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80', color: '#005600', path: '#' },
    { label: t('services.cat.employmentDetails'), icon: ClipboardList, desc: t('services.cat.employmentDetailsDesc'), image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', color: '#005600', path: '#' },
    { label: t('services.cat.grievances'), icon: MessageSquare, desc: t('services.cat.grievancesDesc'), image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80', color: '#005600', path: '#' },
    { label: t('services.cat.forms'), icon: FileText, desc: t('services.cat.formsDesc'), image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80', color: '#005600', path: '#' },
    { label: t('services.cat.rtiContacts'), icon: Shield, desc: t('services.cat.rtiContactsDesc'), image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80', color: '#005600', path: '#' },
    { label: t('services.cat.mobileAppDirectory'), icon: Smartphone, desc: t('services.cat.mobileAppDirectoryDesc'), image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', color: '#005600', path: '#' }
  ];

  const filtered = searchQuery.trim()
    ? categories.filter(c =>
        c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <div className="pb-20">

      {/* Hero + Search */}
      <section className="pt-10 pb-10 container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeInUp} className="text-2xl font-bold tracking-tight mb-2">
            {t('services.title')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-sm text-gray-500 mb-6">
            {t('services.subtitle')}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex items-center gap-2 w-full max-w-[480px] bg-white px-4 py-2.5 rounded-[2px] border border-black/8 focus-within:border-[#005600] focus-within:ring-2 focus-within:ring-[#005600]/20 transition-all duration-300">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('services.searchPlaceholder')}
              className="flex-1 bg-transparent border-none text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={14} />
              </button>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Expanded Categories Grid */}
      <section className="container mx-auto px-6">
        <motion.div
          key={searchQuery}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          {filtered.length > 0 ? (
            filtered.map((cat, index) => (
              <motion.div key={index} variants={fadeInUp} className="h-[200px]">
                <PixelCard
                  variant="green"
                  onClick={() => cat.path !== '#' && navigate(cat.path)}
                  className="group relative overflow-hidden h-full rounded-[2px] border border-black/8 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-[#005600]/20 transition-all duration-300 bg-white"
                >
                  {/* Mild green gradient at top right alone */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#005600]/8 via-transparent to-transparent pointer-events-none z-1 rounded-tr-[2px]" />

                  {/* Absolute Card Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-start z-10">
                    {/* Top-Left Icon Badge */}
                    <div className="w-9 h-9 mb-4 rounded-[2px] bg-[#005600]/8 text-[#005600] flex items-center justify-center border border-[#005600]/10 z-20 group-hover:bg-[#005600] group-hover:text-white transition-all duration-300 shrink-0">
                      <cat.icon size={18} />
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-1 tracking-tight group-hover:text-[#005600] transition-colors">
                      {cat.label}
                    </h3>

                    {/* Transition Block: Description slides out and action slides up on hover */}
                    <div className="relative mt-2 min-h-[44px] overflow-hidden">
                      {/* Description that fades out and slides down slightly on hover */}
                      <div className="transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4 pointer-events-none">
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                          {cat.desc}
                        </p>
                      </div>

                      {/* "Open {servicename}" action that slides up and fades in on hover */}
                      <div className="absolute inset-0 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#005600] opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <span className="flex items-center gap-1.5">
                          <span>{language === 'en' ? 'Open' : 'திறக்கவும்'}</span>
                          <span className="text-gray-900 normal-case font-semibold">{cat.label}</span>
                        </span>
                        <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                      </div>
                    </div>
                  </div>
                </PixelCard>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="text-gray-400 text-sm">{t('services.noResults')} "<span className="font-medium text-gray-600">{searchQuery}</span>"</p>
            </div>
          )}
        </motion.div>
      </section>

    </div>
  );
};

export default ServicesHub;
