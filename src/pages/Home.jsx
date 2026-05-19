import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowRight, FileText, Briefcase, GraduationCap,
  Tractor, Users, Globe, FileBadge, Building2, Landmark,
  MapPin, HelpCircle, FileDown, Bell, Megaphone, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import PixelCard from '../components/PixelCard';
import './Home.css';

const Home = () => {
  const { language, t } = useLanguage();

  const ctas = [
    { icon: FileBadge, label: t('home.ctaFindService'), desc: t('home.ctaFindServiceDesc'), path: '/services', color: '#2563eb' },
    { icon: Globe, label: t('home.ctaExploreSchemes'), desc: t('home.ctaExploreSchemesDesc'), path: '/schemes', color: '#7c3aed' },
    { icon: FileDown, label: t('home.ctaDownloadDoc'), desc: t('home.ctaDownloadDocDesc'), path: '#', color: '#059669' },
    { icon: Building2, label: t('home.ctaDept'), desc: t('home.ctaDeptDesc'), path: '/departments', color: '#d97706' },
    { icon: MapPin, label: t('home.ctaDistricts'), desc: t('home.ctaDistrictsDesc'), path: '#', color: '#e11d48' },
    { icon: HelpCircle, label: t('home.ctaHelp'), desc: t('home.ctaHelpDesc'), path: '#', color: '#0891b2' },
  ];

  const audiences = [
    { icon: <Users />, label: t('home.audCitizen') },
    { icon: <Briefcase />, label: t('home.audBusiness') },
    { icon: <GraduationCap />, label: t('home.audStudent') },
    { icon: <Tractor />, label: t('home.audFarmer') },
    { icon: <Landmark />, label: t('home.audOfficial') },
    { icon: <Globe />, label: t('home.audMedia') },
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const updates = [
    {
      title: language === 'en' ? 'G. Os of Public Department - MINISTERS - Allocation of Business - Notified' : 'அரசாணை (பொதுத் துறை) - அமைச்சர்கள் - துறை ஒதுக்கீடு - அறிவிக்கப்பட்டது',
      date: 'May 18, 2026',
      tag: language === 'en' ? 'G.Os' : 'அரசாணைகள்',
      isNew: true
    },
    {
      title: language === 'en' ? 'G. Os of Finance Department - PENSION – Dearness Allowance to the Pensioners and Family Pensioners – Enhanced Rate' : 'அரசாணை (நிதித் துறை) - ஓய்வூதியம் - ஓய்வூதியதாரர்கள் மற்றும் குடும்ப ஓய்வூதியதாரர்களுக்கான அகவிலைப்படி உயர்த்தப்பட்டது',
      date: 'May 17, 2026',
      tag: language === 'en' ? 'G.Os' : 'அரசாணைகள்',
      isNew: true
    },
    {
      title: language === 'en' ? 'Application form for the post of Sign Language Interpretor' : 'சைகை மொழி பெயர்ப்பாளர் பணிக்கான விண்ணப்பப் படிவம்',
      date: 'May 15, 2026',
      tag: language === 'en' ? 'Forms' : 'படிவங்கள்',
      isNew: false
    },
    {
      title: language === 'en' ? 'Tamil Nadu Wakf Board Election Form-I' : 'தமிழ்நாடு வக்ஃப் வாரிய தேர்தல் படிவம்-I',
      date: 'May 12, 2026',
      tag: language === 'en' ? 'Forms' : 'படிவங்கள்',
      isNew: false
    },
    {
      title: language === 'en' ? 'Directorate of Adi Dravidar Welfare- Application form for Financial Assistance to the Best Writers' : 'ஆதிதிராவிடர் நல இயக்குநரகம் - சிறந்த எழுத்தாளர்களுக்கான நிதியுதவி விண்ணப்பப் படிவம்',
      date: 'May 10, 2026',
      tag: language === 'en' ? 'Schemes' : 'திட்டங்கள்',
      isNew: false
    },
    {
      title: language === 'en' ? 'G.Os of Welfare of Differently Abled Persons Department' : 'மாற்றுத்திறனாளிகள் நலத் துறை அரசாணைகள்',
      date: 'May 05, 2026',
      tag: language === 'en' ? 'G.Os' : 'அரசாணைகள்',
      isNew: false
    }
  ];

  const carouselSlides = [
    {
      image: "/carousel-1.jpg",
      heading: t('home.slide1Title'),
      description: t('home.slide1Desc'),
    },
    {
      image: "/carousel-2.jpg",
      heading: t('home.slide2Title'),
      description: t('home.slide2Desc'),
    },
    {
      image: "/carousel-3.jpg",
      heading: t('home.slide3Title'),
      description: t('home.slide3Desc'),
    },
    {
      image: "/carousel-4.jpg",
      heading: t('home.slide4Title'),
      description: t('home.slide4Desc'),
    },
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const delta = touchStartX.current - touchEndX.current;
    const minSwipe = 50;
    if (delta > minSwipe) {
      // Swiped left → next slide
      setCurrentImage((prev) => (prev + 1) % carouselSlides.length);
    } else if (delta < -minSwipe) {
      // Swiped right → previous slide
      setCurrentImage((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    }
  }, [carouselSlides.length]);

  return (
    <div className="pb-20">
      {/* Hero Section & What's New Split */}
      <section className="relative container mx-auto px-6 mb-16 mt-6">
        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[60vh] lg:min-h-[450px] max-h-[700px]">
          {/* Carousel */}
          <div
            className="relative w-full lg:flex-1 h-[45vh] min-h-[280px] md:h-[50vh] md:min-h-[350px] lg:h-full overflow-hidden bg-black rounded-[4px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={currentImage}
                src={carouselSlides[currentImage].image}
                alt={carouselSlides[currentImage].heading}
                className="absolute inset-0 w-full h-full object-contain md:object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute bottom-8 md:bottom-12 left-0 right-0 z-10 px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="max-w-[700px]"
                >
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-tight font-outfit">
                    {carouselSlides[currentImage].heading}
                  </h2>
                  <p className="text-sm md:text-base text-white/80 leading-relaxed line-clamp-2">
                    {carouselSlides[currentImage].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute bottom-4 right-8 flex items-center gap-2 z-20">
              {carouselSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`transition-all duration-500 ease-out ${
                    idx === currentImage ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* What's New Panel */}
          <div className="w-full lg:w-[380px] h-full flex flex-col shrink-0 bg-white border border-black/8 rounded-[4px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-4 border-b border-black/8 flex items-center justify-between bg-[#f9f7f4]">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-red-600 animate-pulse" />
                <h2 className="font-bold font-outfit text-gray-900 tracking-wide uppercase text-sm">
                  {language === 'en' ? "What's New" : "புதிய அறிவிப்புகள்"}
                </h2>
              </div>
              <Link to="/news" className="text-xs font-bold text-[#005600] hover:underline flex items-center gap-1">
                {language === 'en' ? 'View All' : 'காண்க'} <ArrowRight size={12} />
              </Link>
            </div>
            
            <div className="flex-1 overflow-hidden p-4 relative ticker-mask pause-on-hover">
              <div className="flex flex-col gap-3 animate-scroll-vertical">
                {[...updates, ...updates].map((update, index) => (
                  <div key={index} className="h-[130px] shrink-0">
                    <PixelCard
                      variant="green"
                      className="group relative overflow-hidden h-full rounded-[2px] border border-black/5 hover:border-[#005600]/20 hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] transition-all duration-300 bg-white cursor-pointer"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#005600]/5 via-transparent to-transparent pointer-events-none z-1 rounded-tr-[2px]" />
                      <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-bold tracking-wider uppercase text-[#005600] bg-[#005600]/5 px-2 py-0.5 rounded-[2px]">
                            {update.tag}
                          </span>
                          {update.isNew && (
                            <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-[2px] animate-pulse">
                              {language === 'en' ? 'NEW' : 'புதியது'}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1 group-hover:text-[#005600] transition-colors line-clamp-2">
                          {update.title}
                        </h3>
                        <div className="flex items-center text-[10px] text-gray-400 gap-1.5 font-medium mt-auto">
                          <Calendar size={10} />
                          <span>{update.date}</span>
                        </div>
                      </div>
                    </PixelCard>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Primary CTAs Grid */}
      <section className="relative z-10 container mx-auto px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {ctas.map((cta, index) => (
            <motion.div key={index} variants={fadeInUp} className="h-[220px]">
              <Link to={cta.path} className="block h-full w-full">
                <PixelCard
                  variant="green"
                  className="group relative overflow-hidden h-full rounded-[2px] border border-black/8 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-[#005600]/20 transition-all duration-300 bg-white"
                >
                  {/* Mild green gradient at top right alone */}
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#005600]/8 via-transparent to-transparent pointer-events-none z-1 rounded-tr-[2px]" />

                  {/* Absolute Card Content Overlay */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-10 h-10 rounded-[2px] flex items-center justify-center bg-[#005600]/8 text-[#005600] group-hover:bg-[#005600] group-hover:text-white transition-all duration-300"
                      >
                        <cta.icon size={20} />
                      </div>
                      <ArrowRight
                        size={18}
                        className="text-gray-400 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#005600]"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#005600] transition-colors">{cta.label}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{cta.desc}</p>
                    </div>
                  </div>
                </PixelCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Audiences */}
      <section className="mt-[60px] container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl mb-8 text-center font-outfit font-bold">{t('home.audienceTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto w-full">
            {audiences.map((audience, index) => (
              <motion.button
                key={index}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-[2px] text-gray-500 text-lg font-medium transition-all bg-white border border-black/8 duration-300 hover:text-gray-900 hover:border-[#005600] hover:bg-[#005600]/5 [&>svg]:text-[#005600] w-full cursor-pointer select-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {audience.icon}
                <span>{audience.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>



      {/* Featured Services */}
      <section className="mt-[60px] container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8">
          <h2 className="text-3xl text-left font-outfit font-bold mb-0">{t('home.featuredTitle')}</h2>
          <Link to="/services" className="btn-secondary">{t('home.featuredViewAll')} <ArrowRight size={16} /></Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {[
            { title: t('home.communityCert'), dept: t('home.revenueDept'), time: language === 'en' ? '15 Days' : '15 நாட்கள்' },
            { title: t('home.pattaChitta'), dept: t('home.landRecords'), time: language === 'en' ? 'Instant' : 'உடனடி' },
            { title: t('home.birthCert'), dept: t('home.healthDept'), time: language === 'en' ? 'Online' : 'ஆன்லைன்' },
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
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
                    <span className="text-xs text-[#005600] font-semibold uppercase tracking-wider mb-2 inline-block">
                      {service.dept}
                    </span>
                    <h3 className="text-xl mb-1 font-outfit font-bold text-gray-900 group-hover:text-[#005600] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {language === 'en' ? 'Processing: ' : 'செயல்முறை நேரம்: '}{service.time}
                    </p>
                  </div>
                  <button className="btn-primary w-full text-xs py-2">{t('home.featuredApply')}</button>
                </div>
              </PixelCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
