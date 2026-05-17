import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowRight, FileText, Briefcase, GraduationCap,
  Tractor, Users, Globe, FileBadge, Building2, Landmark,
  MapPin, HelpCircle, FileDown
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
      {/* Hero Section Carousel */}
      <section
        className="relative w-full h-[45vh] min-h-[280px] md:h-[60vh] md:min-h-[420px] lg:h-[70vh] lg:min-h-[500px] max-h-[800px] overflow-hidden mb-16 bg-black"
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

        {/* Gradient overlays — strong blackout for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        {/* Caption */}
        <div className="absolute bottom-12 md:bottom-16 left-0 right-0 z-10 container mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-[600px]"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2 leading-tight font-outfit">
                {carouselSlides[currentImage].heading}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed line-clamp-2 md:line-clamp-none">
                {carouselSlides[currentImage].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators — bottom-right aligned, slim rectangles/squares */}
        <div className="absolute bottom-4 md:bottom-8 right-6 md:right-10 flex items-center gap-2 z-20">
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
