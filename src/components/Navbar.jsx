import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Search, ArrowRight, FileBadge, FileText, Car, HeartPulse, GraduationCap, Tractor, Building2, Users, Wallet, Baby, Home as HomeIcon, Briefcase, Globe, MapPin, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

/* ── Searchable data ─────────────────────────────────────────── */
const searchableItems = [
  // Services
  { title: 'Community Certificate', tag: 'Service', dept: 'Revenue Department', path: '/services', color: '#2563eb' },
  { title: 'Income Certificate', tag: 'Service', dept: 'Revenue Department', path: '/services', color: '#7c3aed' },
  { title: 'Nativity Certificate', tag: 'Service', dept: 'Revenue Department', path: '/services', color: '#059669' },
  { title: 'Driving License', tag: 'Service', dept: 'Transport Department', path: '/services', color: '#d97706' },
  { title: 'Birth Certificate', tag: 'Service', dept: 'Health Department', path: '/services', color: '#e11d48' },
  { title: 'Death Certificate', tag: 'Service', dept: 'Health Department', path: '/services', color: '#0891b2' },
  { title: 'Scholarship Application', tag: 'Service', dept: 'Education Department', path: '/services', color: '#7c3aed' },
  { title: 'Patta Chitta', tag: 'Service', dept: 'Land Records', path: '/services', color: '#059669' },
  { title: 'Farmer ID Card', tag: 'Service', dept: 'Agriculture Department', path: '/services', color: '#d97706' },
  // Schemes
  { title: "CM's Comprehensive Health Insurance", tag: 'Scheme', dept: 'Health & Family Welfare', path: '/schemes', color: '#e11d48' },
  { title: 'Moovalur Ramamirtham Higher Education', tag: 'Scheme', dept: 'Education Department', path: '/schemes', color: '#7c3aed' },
  { title: 'Pudhumai Penn Scheme', tag: 'Scheme', dept: 'Education Department', path: '/schemes', color: '#2563eb' },
  { title: 'Kalaignar Magalir Urimai Thittam', tag: 'Scheme', dept: 'Social Welfare', path: '/schemes', color: '#d97706' },
  { title: 'Uzhavar Santhai Scheme', tag: 'Scheme', dept: 'Agriculture Department', path: '/schemes', color: '#059669' },
  { title: 'Free Laptop Scheme', tag: 'Scheme', dept: 'Education Department', path: '/schemes', color: '#0891b2' },
  { title: 'Chief Minister Housing Scheme', tag: 'Scheme', dept: 'Housing Board', path: '/schemes', color: '#7c3aed' },
  { title: 'Cradle Baby Scheme', tag: 'Scheme', dept: 'Health Department', path: '/schemes', color: '#e11d48' },
  { title: 'New Entrepreneur Enterprise Development', tag: 'Scheme', dept: 'MSME Department', path: '/schemes', color: '#d97706' },
  // Departments
  { title: 'Revenue and Disaster Management', tag: 'Department', dept: 'Land administration, disaster relief', path: '/departments', color: '#2563eb' },
  { title: 'Health and Family Welfare', tag: 'Department', dept: 'Public health, hospitals', path: '/departments', color: '#e11d48' },
  { title: 'School Education', tag: 'Department', dept: 'Schools, examinations', path: '/departments', color: '#7c3aed' },
  { title: 'Transport', tag: 'Department', dept: 'Vehicles, licensing', path: '/departments', color: '#d97706' },
  { title: 'Agriculture', tag: 'Department', dept: 'Farming, crop insurance', path: '/departments', color: '#059669' },
  { title: 'Information Technology', tag: 'Department', dept: 'Digital governance', path: '/departments', color: '#0891b2' },
  // Pages
  { title: 'Home', tag: 'Page', dept: 'Main page', path: '/', color: '#6b7280' },
  { title: 'Government Services', tag: 'Page', dept: 'Browse all services', path: '/services', color: '#6b7280' },
  { title: 'Welfare Schemes', tag: 'Page', dept: 'Discover all schemes', path: '/schemes', color: '#6b7280' },
  { title: 'Documents', tag: 'Page', dept: 'Download documents', path: '/documents', color: '#6b7280' },
  { title: 'News & Updates', tag: 'Page', dept: 'Latest news', path: '/news', color: '#6b7280' },
  { title: 'Help & Support', tag: 'Page', dept: 'Get assistance', path: '/help', color: '#6b7280' },
];

const submenus = {
  '/services': {
    columns: [
      [
        { label: 'Online Services',    path: '/services' },
        { label: 'Contact Directory',  path: '/services' },
        { label: 'Job Opportunity',    path: '/services' },
        { label: 'Important Websites', path: '/services' },
      ],
      [
        { label: 'Census',             path: '/services' },
        { label: 'Statistics',         path: '/services' },
        { label: 'Employment Details', path: '/services' },
        { label: 'Grievances',         path: '/services' },
      ],
      [
        { label: 'Forms',              path: '/services' },
        { label: 'RTI Contacts',       path: '/services' },
        { label: 'Mobile App Directory', path: '/services' },
      ],
    ],
  },
  '/government': {
    columns: [
      [
        { label: 'Ministers',          path: '/government' },
        { label: 'Departments',        path: '/government' },
        { label: 'Districts',          path: '/government' },
      ],
      [
        { label: 'Agencies',           path: '/government' },
        { label: 'Contact Directory',  path: '/government' },
      ],
    ],
  },
  '/schemes': {
    columns: [
      [
        { label: 'By Beneficiary',     path: '/schemes' },
        { label: 'By Category',        path: '/schemes' },
        { label: 'By Department',      path: '/schemes' },
      ],
    ],
  },
};

const Navbar = ({ hide, isAtTop = true }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const translateMenuLabel = (label) => {
    const keyMap = {
      'Online Services': 'services.cat.onlineServices',
      'Contact Directory': 'services.cat.contactDirectory',
      'Job Opportunity': 'services.cat.jobOpportunity',
      'Important Websites': 'services.cat.importantWebsites',
      'Census': 'services.cat.census',
      'Statistics': 'services.cat.statistics',
      'Employment Details': 'services.cat.employmentDetails',
      'Grievances': 'services.cat.grievances',
      'Forms': 'services.cat.forms',
      'RTI Contacts': 'services.cat.rtiContacts',
      'Mobile App Directory': 'services.cat.mobileAppDirectory',
      
      'By Beneficiary': 'schemes.cat.beneficiary',
      'By Category': 'schemes.cat.category',
      'By Department': 'schemes.cat.department',

      'Ministers': 'gov.ministers',
      'Departments': 'gov.departments',
      'Districts': 'gov.districts',
      'Agencies': 'gov.agencies'
    };
    return keyMap[label] ? t(keyMap[label]) : label;
  };

  const navLinks = [
    { name: t('nav.home'),       path: '/',           hasSubmenu: false },
    { name: t('nav.services'),   path: '/services',   hasSubmenu: true  },
    { name: t('nav.government'), path: '/government', hasSubmenu: true  },
    { name: t('nav.documents'),  path: '/documents',  hasSubmenu: false },
    { name: t('nav.schemes'),    path: '/schemes',    hasSubmenu: true  },
    { name: t('nav.news'),       path: '/news',       hasSubmenu: false },
    { name: t('nav.help'),       path: '/help',       hasSubmenu: false },
  ];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return searchableItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.dept.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleResultClick = (path) => {
    setSearchQuery('');
    setSearchOverlayOpen(false);
    navigate(path);
  };

  // Close search overlay on ESC key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setSearchOverlayOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Auto-focus search input when overlay opens & lock body scroll
  useEffect(() => {
    if (searchOverlayOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setSearchQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [searchOverlayOpen]);

  const handleMouseEnter = (path) => {
    clearTimeout(timeoutRef.current);
    if (submenus[path]) setActiveDropdown(path);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  useEffect(() => {
    setActiveDropdown(null);
    setSearchQuery('');
    setSearchOverlayOpen(false);
  }, [location]);

  const tagColors = { Service: '#2563eb', Scheme: '#7c3aed', Department: '#059669', Page: '#6b7280' };

  return (
    <motion.header
      className="relative w-full z-[100] bg-transparent shrink-0"
      initial={{ y: -100, marginTop: 0 }}
      animate={{ 
        y: 0, 
        marginTop: hide ? -116 : (isAtTop ? 0 : -36) 
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Slim Strip (36px tall) */}
      <div className="h-[36px] bg-[#021a02]/90 backdrop-blur-md border-b border-white/5 flex items-center shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)] shrink-0 select-none">
        <div className="container mx-auto px-6 flex items-center justify-center gap-2 text-[11px] font-medium text-white/70">
          <span>
            {language === 'ta' ? 'மொழியை மாற்றவும்:' : 'Switch Language:'}
          </span>
          <button
            onClick={toggleLanguage}
            className="text-[#00e000] hover:text-white font-bold underline underline-offset-4 decoration-[#00e000]/40 hover:decoration-white transition-all duration-300 cursor-pointer font-outfit uppercase tracking-wider pl-1"
          >
            {language === 'ta' ? 'English' : 'தமிழ்'}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 flex items-center h-[80px]">
        {/* Left */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center gap-3 text-xl font-bold">
            <img src={isDark ? '/logo-dark.svg' : '/tn-logo.svg'} alt="TN Logo" className="w-[250px] object-contain" />
          </Link>
        </div>

        {/* Center */}
        <nav className="hidden xl:block shrink-0">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const hasDropdown = !!submenus[link.path];
              return (
                <li
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(link.path)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={link.path}
                    style={{ color: isActive ? '#ffffff' : '' }}
                    className={`flex items-center gap-1 rounded-full font-medium text-[0.9rem] transition-all duration-200 px-4 py-1.5 ${
                      isActive
                        ? 'bg-gray-900 shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                    }`}
                  >
                    {link.name}
                    {hasDropdown && (
                      <ChevronDown
                        size={13}
                        style={{ color: isActive ? '#ffffff' : '' }}
                        className={`transition-transform duration-200 ${isActive ? '' : 'text-gray-400'} ${activeDropdown === link.path ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === link.path && submenus[link.path] && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white/95 backdrop-blur-xl border border-gray-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-[2px] p-6"
                        style={{ zIndex: 200 }}
                        onMouseEnter={() => clearTimeout(timeoutRef.current)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* Decorative Top Arrow */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45" />

                        <div className="flex gap-6 relative z-10">
                          {submenus[link.path].columns.map((col, ci) => (
                            <ul key={ci} className="flex flex-col gap-1 min-w-[200px]">
                              {col.map((item) => (
                                <li key={item.label}>
                                  <Link
                                    to={item.path}
                                    className="group flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-[#005600] hover:bg-[#005600]/5 rounded-[2px] transition-all duration-200 whitespace-nowrap"
                                  >
                                    <span>{translateMenuLabel(item.label)}</span>
                                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[#005600]" />
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right */}
        <div className="flex-1 flex justify-end items-center gap-4">

          {/* Search Button */}
          <button
            onClick={() => setSearchOverlayOpen(true)}
            className="hidden xl:flex items-center justify-center w-10 h-10 rounded-full bg-white border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] text-gray-500 hover:text-[#005600] hover:border-[#005600]/30 hover:shadow-[0_4px_20px_rgba(0,86,0,0.1)] transition-all duration-300 cursor-pointer"
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <button
            className="xl:hidden text-gray-500 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:text-gray-900 hover:bg-black/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — Full-screen overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="xl:hidden fixed inset-0 bg-white z-[200] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <Link to="/" className="flex items-center gap-3 text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>
                <img src={isDark ? '/logo-dark.svg' : '/tn-logo.svg'} alt="TN Logo" className="w-[250px] object-contain" />
                
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`flex items-center justify-between px-5 py-4 rounded-xl text-[1.05rem] font-medium transition-all duration-200 ${
                        location.pathname === link.path
                          ? 'bg-[#005600]/10 text-[#005600]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                      <ArrowRight size={16} className={location.pathname === link.path ? 'text-[#005600]' : 'text-gray-300'} />
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Translate button just below all menus inside the hamburger */}
              <div className="mt-6 px-1">
                <button
                  onClick={() => {
                    toggleLanguage();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold bg-[#005600] text-white hover:bg-[#004d00] transition-all cursor-pointer shadow-[0_4px_12px_rgba(0,86,0,0.15)]"
                >
                  <img src="/translate.svg" className="w-4.5 h-4.5 object-contain" alt="Translate" />
                  <span>{language === 'en' ? 'தமிழ் இணையதளம்' : 'English Portal'}</span>
                </button>
              </div>
            </nav>

            {/* Bottom Search Bar — pinned */}
            <div className="relative shrink-0 border-t border-gray-100 px-5 py-4 bg-white">
              {/* Search Results Popover — floats above */}
              <AnimatePresence>
                {searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                    style={{ zIndex: 10 }}
                  >
                    {searchResults.length > 0 ? (
                      <ul className="max-h-[250px] overflow-y-auto py-1" style={{ scrollbarWidth: 'thin' }}>
                        {searchResults.map((item, idx) => (
                          <li key={idx}>
                            <button
                              onClick={() => { handleResultClick(item.path); setMobileMenuOpen(false); }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                <p className="text-xs text-gray-400 truncate">{item.dept}</p>
                              </div>
                              <span
                                className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                                style={{ backgroundColor: `${tagColors[item.tag]}10`, color: tagColors[item.tag] }}
                              >
                                {item.tag}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-5 text-center">
                        <p className="text-xs text-gray-400">{t('nav.noResults')} "<span className="font-medium text-gray-600">{searchQuery}</span>"</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 focus-within:border-[#005600] focus-within:ring-2 focus-within:ring-[#005600]/20 transition-all">
                <Search size={16} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  className="flex-1 bg-transparent border-none text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search Overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {searchOverlayOpen && (
          <motion.div
            className="fixed inset-0 z-[999] flex flex-col items-center justify-start pt-[18vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSearchOverlayOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Search Container */}
            <motion.div
              className="relative z-10 w-[90%] max-w-[640px]"
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            >
              {/* Input Row */}
              <div className="flex items-center gap-3 bg-white/95 backdrop-blur-xl px-5 py-4 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20">
                <Search size={22} className="text-gray-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  className="flex-1 bg-transparent border-none text-lg text-gray-900 outline-none placeholder:text-gray-400 font-medium"
                />
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                    <X size={18} />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-[11px] font-medium text-gray-400 border border-gray-200">ESC</kbd>
                )}
              </div>

              {/* Results */}
              <AnimatePresence>
                {searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                    className="mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden"
                  >
                    {searchResults.length > 0 ? (
                      <ul className="max-h-[340px] overflow-y-auto py-2" style={{ scrollbarWidth: 'thin' }}>
                        {searchResults.map((item, idx) => (
                          <li key={idx}>
                            <button
                              onClick={() => handleResultClick(item.path)}
                              className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-[#005600]/5 transition-colors duration-150 group"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#005600] transition-colors">{item.title}</p>
                                <p className="text-xs text-gray-400 truncate mt-0.5">{item.dept}</p>
                              </div>
                              <span
                                className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
                                style={{ backgroundColor: `${tagColors[item.tag]}15`, color: tagColors[item.tag] }}
                              >
                                {item.tag}
                              </span>
                              <ArrowRight size={14} className="text-gray-300 group-hover:text-[#005600] shrink-0 transition-all duration-200 group-hover:translate-x-0.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-5 py-10 text-center">
                        <p className="text-sm text-gray-400">{t('nav.noResults')} "<span className="font-medium text-gray-600">{searchQuery}</span>"</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Close hint */}
            <motion.p
              className="relative z-10 mt-6 text-xs text-white/40 font-medium tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 text-[10px] font-bold mx-1">ESC</kbd> or click outside to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
