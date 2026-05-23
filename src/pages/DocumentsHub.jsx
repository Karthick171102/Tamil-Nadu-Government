import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ArrowRight, X, FileText, BookOpen, ScrollText, Mail, Megaphone, Scale,
  TrendingUp, Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PixelCard from '../components/PixelCard';

const DocumentsHub = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { label: t('doc.gos'), icon: FileText, desc: t('doc.gosDesc'), color: '#005600' },
    { label: t('doc.policyNotes'), icon: BookOpen, desc: t('doc.policyNotesDesc'), color: '#005600' },
    { label: t('doc.performanceBudget'), icon: TrendingUp, desc: t('doc.performanceBudgetDesc'), color: '#005600' },
    { label: t('doc.citizenCharter'), icon: Award, desc: t('doc.citizenCharterDesc'), color: '#005600' },
    { label: t('doc.rules'), icon: ScrollText, desc: t('doc.rulesDesc'), color: '#005600' },
    { label: t('doc.circulars'), icon: Mail, desc: t('doc.circularsDesc'), color: '#005600' },
    { label: t('doc.announcements'), icon: Megaphone, desc: t('doc.announcementsDesc'), color: '#005600' },
    { label: t('doc.acts'), icon: Scale, desc: t('doc.actsDesc'), color: '#005600' },
  ];

  const filtered = searchQuery
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
      <section className="pt-10 pb-10 container mx-auto px-6">
        <motion.div initial="hidden" animate="show" variants={staggerContainer}>
          <motion.h1 variants={fadeInUp} className="text-2xl font-bold tracking-tight mb-2">
            {t('nav.documents')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-sm text-gray-500 mb-6">
            {t('ph.desc.documents')}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex items-center gap-2 w-full max-w-[480px] bg-white px-4 py-2.5 rounded-[2px] border border-black/8 focus-within:border-[#005600] focus-within:ring-2 focus-within:ring-[#005600]/20 transition-all duration-300">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ta' ? 'தேடுக...' : 'Search...'}
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
              <motion.div key={index} variants={fadeInUp} className="min-h-[200px] flex flex-col">
                <PixelCard
                  variant="green"
                  className="group relative overflow-hidden h-full rounded-[2px] border border-black/8 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-[#005600]/20 transition-all duration-300 bg-white"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#005600]/8 via-transparent to-transparent pointer-events-none z-1 rounded-tr-[2px]" />
                  <div className="relative flex-1 p-6 flex flex-col justify-start z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-[2px] bg-[#005600]/8 text-[#005600] group-hover:bg-[#005600] group-hover:text-white transition-all duration-300 flex items-center justify-center">
                        <cat.icon size={20} />
                      </div>
                      <ArrowRight size={18} className="text-gray-400 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#005600]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-[#005600] transition-colors line-clamp-1">{cat.label}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{cat.desc}</p>
                    </div>
                  </div>
                </PixelCard>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-500 text-sm">
                {language === 'ta' ? 'முடிவுகள் எதுவும் இல்லை.' : 'No results found.'}
              </p>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default DocumentsHub;
