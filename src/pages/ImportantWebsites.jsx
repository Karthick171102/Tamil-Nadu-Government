import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ArrowLeft, X, ExternalLink, ChevronDown,
  GraduationCap, Building2, Globe, Leaf, Briefcase, Map, Landmark, Gavel, Users, HeartPulse, Zap, Trees, BookOpen, Compass, ShieldCheck, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PixelCard from '../components/PixelCard';
import { IMPORTANT_WEBSITES } from '../utils/importantWebsitesData';

// Map category IDs to Lucide icons
const categoryIcons = {
  education: GraduationCap,
  municipal: Building2,
  services: Globe,
  agriculture: Leaf,
  industry: Briefcase,
  infrastructure: Map,
  finance: Landmark,
  judiciary: Gavel,
  social_welfare: Users,
  employment: Briefcase,
  health: HeartPulse,
  utilities: Zap,
  environment: Trees,
  culture: BookOpen,
  tourism: Compass,
  state_enterprises: ShieldCheck
};

const ImportantWebsites = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeCategory = IMPORTANT_WEBSITES.find(cat => cat.category_id === activeTab);

  // Flatten or filter websites
  let baseWebsites = [];
  if (activeTab === 'all') {
    IMPORTANT_WEBSITES.forEach(cat => {
      cat.websites.forEach(web => {
        baseWebsites.push({
          ...web,
          category_id: cat.category_id,
          category_name: cat.name
        });
      });
    });
  } else if (activeCategory) {
    baseWebsites = activeCategory.websites.map(web => ({
      ...web,
      category_id: activeCategory.category_id,
      category_name: activeCategory.name
    }));
  }

  // Filter based on search query
  const filtered = searchQuery.trim()
    ? baseWebsites.filter(web =>
        web.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        web.name[language === 'en' ? 'ta' : 'en'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        web.url.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : baseWebsites;

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  const handleCardClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Clean URL for display
  const getDisplayUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace('www.', '');
    } catch {
      return url.replace('http://', '').replace('https://', '').split('/')[0];
    }
  };

  const ActiveIcon = activeTab === 'all' ? Globe : (categoryIcons[activeTab] || HelpCircle);

  return (
    <div className="pb-20">
      {/* Breadcrumb + Header Section */}
      <section className="pt-10 pb-4 container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          {/* Back to Services breadcrumb */}
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#005600] dark:hover:text-green-400 uppercase tracking-wider mb-5 transition-colors group cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
            {language === 'en' ? 'Back to Services' : 'சேவைகளுக்கு திரும்பு'}
          </button>

          {/* Heading and Page Metadata */}
          <motion.h1 variants={fadeInUp} className="text-2xl font-bold tracking-tight mb-2">
            {t('importantWebsites.title')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-sm text-gray-500 dark:text-gray-400 max-w-xl">
            {t('importantWebsites.subtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Main Content Layout */}
      <section className="container mx-auto px-6 mt-4">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Desktop Sidebar (Visible on desktop only) */}
          <div className="hidden md:block w-64 lg:w-72 shrink-0">
            <div className="sticky top-24 flex flex-col gap-1 bg-white dark:bg-[#0a0a0a] p-4 rounded-[4px] border border-black/8 dark:border-white/10 max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
              <h2 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-3 px-2">
                {language === 'en' ? 'Categories' : 'பிரிவுகள்'}
              </h2>
              
              {/* "All" Tab */}
              <button
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-xs font-bold transition-all duration-200 cursor-pointer text-left ${
                  activeTab === 'all'
                    ? 'bg-[#005600] text-white border-l-2 border-[#005600] dark:bg-green-400 dark:text-black dark:border-green-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-[#005600]/5 dark:hover:bg-green-400/5 hover:text-[#005600] dark:hover:text-green-400'
                }`}
              >
                <Globe size={16} />
                <span>{t('importantWebsites.all')}</span>
              </button>

              {/* Dynamic Category Tabs */}
              {IMPORTANT_WEBSITES.map((cat) => {
                const Icon = categoryIcons[cat.category_id] || HelpCircle;
                const isActive = activeTab === cat.category_id;
                return (
                  <button
                    key={cat.category_id}
                    onClick={() => {
                      setActiveTab(cat.category_id);
                      setSearchQuery('');
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-xs font-bold transition-all duration-200 cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#005600] text-white border-l-2 border-[#005600] dark:bg-green-400 dark:text-black dark:border-green-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-[#005600]/5 dark:hover:bg-green-400/5 hover:text-[#005600] dark:hover:text-green-400'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-white dark:text-black' : 'text-gray-400'} />
                    <span className="truncate">{cat.name[language]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Category Dropdown (Visible on mobile only) */}
          <div className="block md:hidden w-full relative z-30 mb-6">
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-2 block">
              {language === 'en' ? 'Select Category' : 'பிரிவைத் தேர்ந்தெடுக்கவும்'}
            </label>
            <div className="relative">
              {/* Dropdown Trigger */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between bg-white dark:bg-[#0a0a0a] px-4 py-3 rounded-[2px] border border-black/8 dark:border-white/10 text-xs font-bold text-gray-750 dark:text-white shadow-sm cursor-pointer focus:border-[#005600] focus:ring-1 focus:ring-[#005600]/20"
              >
                <div className="flex items-center gap-2.5">
                  <ActiveIcon size={16} className="text-[#005600] dark:text-green-400" />
                  <span>
                    {activeTab === 'all'
                      ? t('importantWebsites.all')
                      : IMPORTANT_WEBSITES.find(c => c.category_id === activeTab)?.name[language]}
                  </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu Overlay */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    {/* Invisible backdrop to dismiss dropdown */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#0a0a0a] border border-black/8 dark:border-white/10 rounded-[2px] shadow-lg max-h-60 overflow-y-auto no-scrollbar z-50 p-1"
                    >
                      {/* "All" Option */}
                      <button
                        onClick={() => {
                          setActiveTab('all');
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-xs font-bold text-left cursor-pointer ${
                          activeTab === 'all'
                            ? 'bg-[#005600] text-white dark:bg-green-400 dark:text-black'
                            : 'text-gray-650 dark:text-gray-300 hover:bg-[#005600]/5 dark:hover:bg-green-400/5'
                        }`}
                      >
                        <Globe size={16} />
                        <span>{t('importantWebsites.all')}</span>
                      </button>

                      {/* Category Options */}
                      {IMPORTANT_WEBSITES.map((cat) => {
                        const Icon = categoryIcons[cat.category_id] || HelpCircle;
                        const isActive = activeTab === cat.category_id;
                        return (
                          <button
                            key={cat.category_id}
                            onClick={() => {
                              setActiveTab(cat.category_id);
                              setIsDropdownOpen(false);
                              setSearchQuery('');
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-xs font-bold text-left cursor-pointer ${
                              isActive
                                ? 'bg-[#005600] text-white dark:bg-green-400 dark:text-black'
                                : 'text-gray-655 dark:text-gray-300 hover:bg-[#005600]/5 dark:hover:bg-green-400/5'
                            }`}
                          >
                            <Icon size={16} />
                            <span className="truncate">{cat.name[language]}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Search + Grid */}
          <div className="flex-grow">
            
            {/* Search Input */}
            <div className="flex items-center gap-2 w-full max-w-[480px] bg-white dark:bg-[#0a0a0a] px-4 py-2.5 rounded-[2px] border border-black/8 dark:border-white/10 focus-within:border-[#005600] focus-within:ring-2 focus-within:ring-[#005600]/20 dark:focus-within:border-green-400/50 dark:focus-within:ring-green-400/20 transition-all duration-300 mb-6">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('importantWebsites.searchPlaceholder')}
                className="flex-1 bg-transparent border-none text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Active Category Description Banner */}
            {activeTab !== 'all' && activeCategory && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-[#005600]/4 dark:bg-green-400/5 border-l-2 border-[#005600] dark:border-green-400 px-4 py-2.5 rounded-[2px]"
              >
                <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed">
                  {activeCategory.description[language]}
                </p>
              </motion.div>
            )}

            {/* Websites Card Grid */}
            <motion.div
              key={`${activeTab}-${searchQuery}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              initial="hidden"
              animate="show"
              variants={staggerContainer}
            >
              {filtered.length > 0 ? (
                filtered.map((web, index) => {
                  const Icon = categoryIcons[web.category_id] || HelpCircle;
                  return (
                    <motion.div key={index} variants={fadeInUp} className="min-h-[160px] flex flex-col">
                      <PixelCard
                        variant="green"
                        onClick={() => handleCardClick(web.url)}
                        className="group relative overflow-hidden h-full rounded-[2px] border border-black/8 dark:border-white/10 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-[#005600]/20 dark:hover:border-green-400/30 transition-all duration-300 bg-white dark:bg-[#0a0a0a]"
                      >
                        {/* Corner gradient */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#005600]/5 dark:from-green-400/5 via-transparent to-transparent pointer-events-none z-1 rounded-tr-[2px]" />

                        {/* External Link Indicator in corner */}
                        <div className="absolute top-4 right-4 text-gray-300 dark:text-gray-600 group-hover:text-[#005600] dark:group-hover:text-green-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                          <ExternalLink size={14} />
                        </div>

                        <div className="relative flex-1 p-5 flex flex-col justify-between z-10 h-full">
                          <div>
                            {/* Icon Badge */}
                            <div className="w-9 h-9 mb-4 rounded-[2px] bg-[#005600]/8 dark:bg-green-400/10 text-[#005600] dark:text-green-400 flex items-center justify-center border border-[#005600]/10 z-20 group-hover:bg-[#005600] dark:group-hover:bg-green-400 group-hover:text-white dark:group-hover:text-black transition-all duration-300 shrink-0">
                              <Icon size={18} />
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm tracking-tight leading-snug group-hover:text-[#005600] dark:group-hover:text-green-400 transition-colors line-clamp-2 pr-6">
                              {web.name[language]}
                            </h3>
                          </div>

                          {/* Display URL */}
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-4 tracking-wider uppercase truncate">
                            {getDisplayUrl(web.url)}
                          </p>
                        </div>
                      </PixelCard>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full py-16 text-center">
                  <p className="text-gray-400 text-sm">
                    {t('importantWebsites.noResults')} "<span className="font-medium text-gray-600 dark:text-gray-300">{searchQuery}</span>"
                  </p>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ImportantWebsites;
