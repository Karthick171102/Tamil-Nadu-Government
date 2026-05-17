import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Filter, Users, GraduationCap, HeartPulse, Tractor, Wallet, Baby, Home, Briefcase, Grid, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PixelCard from '../components/PixelCard';

const SchemesHub = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Women', 'Students', 'Farmers', 'Health', 'Housing'];

  const schemeMegamenuCards = [
    { label: t('schemes.cat.beneficiary'), icon: Users, desc: t('schemes.cat.beneficiaryDesc') },
    { label: t('schemes.cat.category'), icon: Grid, desc: t('schemes.cat.categoryDesc') },
    { label: t('schemes.cat.department'), icon: Building2, desc: t('schemes.cat.departmentDesc') }
  ];

  const schemes = [
    {
      title: "Chief Minister's Comprehensive Health Insurance",
      target: 'BPL Families',
      dept: 'Health & Family Welfare',
      icon: HeartPulse,
      color: '#e11d48',
      category: 'Health',
    },
    {
      title: 'Moovalur Ramamirtham Ammaiyar Higher Education',
      target: 'Girl Students',
      dept: 'Education Department',
      icon: GraduationCap,
      color: '#7c3aed',
      category: 'Students',
    },
    {
      title: 'Pudhumai Penn Scheme',
      target: 'Girl Students',
      dept: 'Education Department',
      icon: Wallet,
      color: '#2563eb',
      category: 'Women',
    },
    {
      title: 'Kalaignar Magalir Urimai Thittam',
      target: 'Women',
      dept: 'Social Welfare',
      icon: Users,
      color: '#d97706',
      category: 'Women',
    },
    {
      title: 'Uzhavar Santhai Scheme',
      target: 'Farmers',
      dept: 'Agriculture Department',
      icon: Tractor,
      color: '#059669',
      category: 'Farmers',
    },
    {
      title: 'Free Laptop Scheme',
      target: 'Students',
      dept: 'Education Department',
      icon: GraduationCap,
      color: '#0891b2',
      category: 'Students',
    },
    {
      title: 'Chief Minister Housing Scheme',
      target: 'Low Income Families',
      dept: 'Housing Board',
      icon: Home,
      color: '#7c3aed',
      category: 'Housing',
    },
    {
      title: 'Cradle Baby Scheme',
      target: 'Newborns',
      dept: 'Health Department',
      icon: Baby,
      color: '#e11d48',
      category: 'Health',
    },
    {
      title: 'New Entrepreneur cum Enterprise Development',
      target: 'Entrepreneurs',
      dept: 'MSME Department',
      icon: Briefcase,
      color: '#d97706',
      category: 'Women',
    },
  ];

  const filtered = activeCategory === 'All'
    ? schemes
    : schemes.filter(s => s.category === activeCategory);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <div className="pb-20">

      {/* Hero */}
      <section className="pt-10 pb-6 container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeInUp} className="text-2xl font-bold tracking-tight mb-2">
            {t('schemes.title')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-sm text-gray-500">
            {t('schemes.subtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Expanded Category Cards */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schemeMegamenuCards.map((card, idx) => (
            <motion.div
              key={idx}
              className="h-[260px]"
            >
              <PixelCard
                variant="green"
                className="group relative overflow-hidden h-full rounded-[2px] border border-black/8 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-[#005600]/20 transition-all duration-300 bg-white"
              >
                {/* Mild green gradient at top right alone */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#005600]/8 via-transparent to-transparent pointer-events-none z-1 rounded-tr-[2px]" />

                {/* Absolute Card Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-[2px] bg-[#005600]/8 text-[#005600] flex items-center justify-center shrink-0 group-hover:bg-[#005600] group-hover:text-white transition-all duration-300">
                        <card.icon size={20} />
                      </div>
                      <ArrowRight size={16} className="text-gray-400 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#005600]" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#005600] transition-colors">{card.label}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{card.desc}</p>
                  </div>
                  <button className="btn-primary w-full text-xs py-2">{t('schemes.explore')}</button>
                </div>
              </PixelCard>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default SchemesHub;
