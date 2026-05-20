import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Play, Pause, ChevronLeft, ChevronRight, Search,
  Globe, Shield, FileText, Building2, MapPin, HelpCircle,
  X, Quote, FileBadge, GraduationCap, Tractor, Users,
  Landmark, Bell, Megaphone, Calendar, Download, Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import PixelCard from '../components/PixelCard';
import './Home.css';

const Home = () => {
  const { language, t } = useLanguage();
  const [showKuralPopup, setShowKuralPopup] = useState(false);

  const [kuralData, setKuralData] = useState({
    Number: 2,
    Line1: "கற்றதனால் ஆய பயனென்கொல் வாலறிவன்",
    Line2: "நற்றாள் தொழாஅர் எனின்.",
    Translation: "That lore is vain which does not fall  At His good feet who knoweth all",
    mv: "தூய அறிவு வடிவாக விளங்கும் இறைவனுடைய நல்ல திருவடிகளை தொழாமல் இருப்பாரானால், அவர் கற்ற கல்வியினால் ஆகிய பயன் என்ன?",
    explanation: "What Profit have those derived from learning, who worship not the good feet of Him who is possessed of pure knowledge ?"
  });

  useEffect(() => {
    // Determine daily Kural index: May 20, 2026 is Day 1 (Kural 1), May 21, 2026 is Day 2 (Kural 2).
    const baseDate = new Date(2026, 4, 20); // 4 = May in JS Date
    const today = new Date();
    
    const baseMidnight = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const diffTime = todayMidnight - baseMidnight;
    const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const targetNumber = (diffDays % 1330) + 1;

    fetch('/thirukkural.json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.kural && Array.isArray(data.kural)) {
          const found = data.kural.find((k) => k.Number === targetNumber);
          if (found) {
            setKuralData(found);
          }
        }
      })
      .catch((err) => console.error('Failed to load dynamic Thirukkural:', err));
  }, []);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenKuralPopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setShowKuralPopup(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const currentKuralNo = language === 'en' ? `Kural ${kuralData.Number}` : `குறள் ${kuralData.Number}`;
  const currentKuralLine1 = kuralData.Line1;
  const currentKuralLine2 = kuralData.Line2;
  const currentKuralMeaningTa = kuralData.mv || kuralData.sp || kuralData.mk;
  const currentKuralMeaningEn = kuralData.explanation || kuralData.Translation;

  const closeKuralPopup = () => {
    setShowKuralPopup(false);
    sessionStorage.setItem('hasSeenKuralPopup', 'true');
  };

  const generateKuralCanvas = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d');

    // 1. Draw beautiful dark green gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, 1200);
    grad.addColorStop(0, '#002e00'); // deep green
    grad.addColorStop(0.5, '#001a00'); // dark green
    grad.addColorStop(1, '#000c00'); // rich almost black green
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1200);

    // 2. Draw gold borders
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 760, 1160);
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, 744, 1144);

    // Helper to load image
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
      });
    };

    try {
      // Load both logo and thiruvalluvar image
      const [logoImg, valluvarImg] = await Promise.all([
        loadImage('/logo-dark.svg'),
        loadImage('/thiruvalluvar.png')
      ]);

      // 3. Draw logo (centered at top)
      const logoW = 340;
      const logoH = 65;
      const logoX = (800 - logoW) / 2;
      const logoY = 65;
      ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);

      // 4. Draw horizontal separator below logo
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 160);
      ctx.lineTo(700, 160);
      ctx.stroke();

      // 5. Draw Thiruvalluvar Portrait
      const valluvarSize = 340;
      const valluvarX = (800 - valluvarSize) / 2;
      const valluvarY = 195;

      // Draw image
      ctx.drawImage(valluvarImg, valluvarX, valluvarY, valluvarSize, valluvarSize);

      // Draw gold border around portrait
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3;
      ctx.strokeRect(valluvarX - 2, valluvarY - 2, valluvarSize + 4, valluvarSize + 4);

      // 6. Draw Kural No / Title
      ctx.fillStyle = '#d4af37'; // gold color
      ctx.font = 'bold 22px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(currentKuralNo.toUpperCase(), 80, 595);

      // 7. Draw Tamil Kural Lines (bold, white)
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 28px "Anek Tamil", sans-serif';
      ctx.fillText(currentKuralLine1, 80, 650);
      ctx.fillText(currentKuralLine2, 80, 695);

      // 8. Draw divider below kural text
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(80, 740);
      ctx.lineTo(720, 740);
      ctx.stroke();

      // Helper to wrap text
      const wrapText = (text, x, y, maxWidth, lineHeight, font, color) => {
        ctx.font = font;
        ctx.fillStyle = color;
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line.trim(), x, currentY);
        return currentY + lineHeight;
      };

      // 9. Draw Tamil explanation
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 16px "Anek Tamil", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('அதிகார விளக்கம் / Tamil Meaning', 80, 780);

      const nextY = wrapText(
        `"${currentKuralMeaningTa}"`,
        80,
        815,
        640,
        30,
        'italic 20px "Anek Tamil", sans-serif',
        '#e0e0e0'
      );

      // 10. Draw English explanation
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 16px "Space Grotesk", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('English Translation & Meaning', 80, nextY + 25);

      wrapText(
        `"${currentKuralMeaningEn}"`,
        80,
        nextY + 60,
        640,
        28,
        'italic 18px "Space Grotesk", sans-serif',
        '#e0e0e0'
      );

      // 11. Footer credits
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '14px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Tamil Nadu Government Portal  •  www.tn.gov.in', 400, 1140);

      return canvas;
    } catch (error) {
      console.error('Error rendering canvas:', error);
      alert('Could not render Thirukkural card.');
      throw error;
    }
  };

  const handleDownloadKural = async () => {
    try {
      const canvas = await generateKuralCanvas();
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${currentKuralNo.replace(/\s+/g, '_')}_Thirukkural.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareKural = async () => {
    try {
      const canvas = await generateKuralCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Could not generate sharing image.');
          return;
        }
        const fileName = `${currentKuralNo.replace(/\s+/g, '_')}_Thirukkural.png`;
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: t('kural.title'),
              text: `${currentKuralNo} - ${currentKuralLine1} / ${currentKuralLine2}`,
            });
          } catch (shareError) {
            if (shareError.name !== 'AbortError') {
              console.error('Share failed:', shareError);
            }
          }
        } else {
          // Fallback to download
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = fileName;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          alert(language === 'en'
            ? 'Web sharing is not supported on this browser. The image has been downloaded instead!'
            : 'இந்த உலாவியில் பகிர்வு வசதி இல்லை. எனவே படம் பதிவிறக்கம் செய்யப்பட்டுள்ளது!'
          );
        }
      }, 'image/png');
    } catch (e) {
      console.error(e);
    }
  };

  const ctas = [
    { icon: FileBadge, label: t('home.ctaFindService'), desc: t('home.ctaFindServiceDesc'), path: '/services', color: '#2563eb' },
    { icon: Globe, label: t('home.ctaExploreSchemes'), desc: t('home.ctaExploreSchemesDesc'), path: '/schemes', color: '#7c3aed' },
    { icon: FileText, label: t('home.ctaDownloadDoc'), desc: t('home.ctaDownloadDocDesc'), path: '#', color: '#059669' },
    { icon: Building2, label: t('home.ctaDept'), desc: t('home.ctaDeptDesc'), path: '/departments', color: '#d97706' },
    { icon: MapPin, label: t('home.ctaDistricts'), desc: t('home.ctaDistrictsDesc'), path: '#', color: '#e11d48' },
    { icon: HelpCircle, label: t('home.ctaHelp'), desc: t('home.ctaHelpDesc'), path: '#', color: '#0891b2' },
  ];

  const audiences = [
    { icon: <Users />, label: t('home.audCitizen') },
    { icon: <Building2 />, label: t('home.audBusiness') },
    { icon: <GraduationCap />, label: t('home.audStudent') },
    { icon: <Tractor />, label: t('home.audFarmer') },
    { icon: <Landmark />, label: t('home.audOfficial') },
    { icon: <Globe />, label: t('home.audMedia') },
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const updates = [
    { title: language === 'en' ? 'G. Os of Public Department - MINISTERS - Allocation of Business - Notified' : 'அரசாணை (பொதுத் துறை) - அமைச்சர்கள் - துறை ஒதுக்கீடு - அறிவிக்கப்பட்டது', date: 'May 18, 2026', tag: language === 'en' ? 'G.Os' : 'அரசாணைகள்', isNew: true },
    { title: language === 'en' ? 'G. Os of Finance Department - PENSION – Dearness Allowance to the Pensioners and Family Pensioners – Enhanced Rate' : 'அரசாணை (நிதித் துறை) - ஓய்வூதியம் - ஓய்வூதியதாரர்கள் மற்றும் குடும்ப ஓய்வூதியதாரர்களுக்கான அகவிலைப்படி உயர்த்தப்பட்டது', date: 'May 17, 2026', tag: language === 'en' ? 'G.Os' : 'அரசாணைகள்', isNew: true },
    { title: language === 'en' ? 'Application form for the post of Sign Language Interpretor' : 'சைகை மொழி பெயர்ப்பாளர் பணிக்கான விண்ணப்பப் படிவம்', date: 'May 15, 2026', tag: language === 'en' ? 'Forms' : 'படிவங்கள்', isNew: false },
    { title: language === 'en' ? 'Tamil Nadu Wakf Board Election Form-I' : 'தமிழ்நாடு வக்ஃப் வாரிய தேர்தல் படிவம்-I', date: 'May 12, 2026', tag: language === 'en' ? 'Forms' : 'படிவங்கள்', isNew: false },
    { title: language === 'en' ? 'Directorate of Adi Dravidar Welfare- Application form for Financial Assistance to the Best Writers' : 'ஆதிதிராவிடர் நல இயக்குநரகம் - சிறந்த எழுத்தாளர்களுக்கான நிதியுதவி விண்ணப்பப் படிவம்', date: 'May 10, 2026', tag: language === 'en' ? 'Schemes' : 'திட்டங்கள்', isNew: false },
    { title: language === 'en' ? 'G.Os of Welfare of Differently Abled Persons Department' : 'மாற்றுத்திறனாளிகள் நலத் துறை அரசாணைகள்', date: 'May 05, 2026', tag: language === 'en' ? 'G.Os' : 'அரசாணைகள்', isNew: false }
  ];

  const carouselSlides = [
    { image: "/carousel-1.jpg", heading: t('home.slide1Title'), description: t('home.slide1Desc') },
    { image: "/carousel-2.jpg", heading: t('home.slide2Title'), description: t('home.slide2Desc') },
    { image: "/carousel-3.jpg", heading: t('home.slide3Title'), description: t('home.slide3Desc') },
    { image: "/carousel-4.jpg", heading: t('home.slide4Title'), description: t('home.slide4Desc') },
    { image: "/carousel-5.jpg", heading: t('home.slide5Title'), description: t('home.slide5Desc') },
    { image: "/carousel-6.jpg", heading: t('home.slide6Title'), description: t('home.slide6Desc') },
    { image: "/carousel-7.jpg", heading: t('home.slide7Title'), description: t('home.slide7Desc') },
    { image: "/carousel-8.jpg", heading: t('home.slide8Title'), description: t('home.slide8Desc') },
    { image: "/carousel-9.jpg", heading: t('home.slide9Title'), description: t('home.slide9Desc') },
    { image: "/carousel-10.jpg", heading: t('home.slide10Title'), description: t('home.slide10Desc') },
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
      setCurrentImage((prev) => (prev + 1) % carouselSlides.length);
    } else if (delta < -minSwipe) {
      setCurrentImage((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    }
  }, [carouselSlides.length]);

  return (
    <div className="pb-20">
      <section className="relative container mx-auto px-6 mb-16 mt-6">
        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[60vh] lg:min-h-[450px] max-h-[700px]">
          <div
            className="relative w-full lg:flex-1 h-[45vh] min-h-[280px] md:h-[50vh] md:min-h-[350px] lg:h-full overflow-hidden bg-black rounded-[4px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                <img
                  src={carouselSlides[currentImage].image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 opacity-40"
                />
                <motion.img
                  src={carouselSlides[currentImage].image}
                  alt={carouselSlides[currentImage].heading}
                  className="relative w-full h-full object-contain z-10"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-8 md:bottom-12 left-0 right-0 z-30 px-8">
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
                  className={`transition-all duration-500 ease-out ${idx === currentImage ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="w-full lg:w-[380px] h-[400px] lg:h-full flex flex-col shrink-0 bg-white dark:bg-black border border-black/8 dark:border-white/10 rounded-[4px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-4 border-b border-black/8 dark:border-white/10 flex items-center justify-between bg-[#f9f7f4] dark:bg-[#111]">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-red-600 dark:text-red-500 animate-pulse" />
                <h2 className="font-bold font-outfit text-gray-900 dark:text-white tracking-wide uppercase text-sm">
                  {language === 'en' ? "What's New" : "புதிய அறிவிப்புகள்"}
                </h2>
              </div>
              <Link to="/news" className="text-xs font-bold text-[#005600] dark:text-green-400 hover:underline flex items-center gap-1">
                {language === 'en' ? 'View All' : 'காண்க'} <ArrowRight size={12} />
              </Link>
            </div>
            <div className="flex-1 overflow-hidden p-4 relative ticker-mask pause-on-hover">
              <div className="flex flex-col gap-3 animate-scroll-vertical">
                {[...updates, ...updates].map((update, index) => (
                  <div key={index} className="h-[130px] shrink-0">
                    <PixelCard
                      variant="green"
                      className="group relative overflow-hidden h-full rounded-[2px] border border-black/5 dark:border-white/5 hover:border-[#005600]/20 dark:hover:border-green-400/30 hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] transition-all duration-300 bg-white dark:bg-[#0a0a0a] cursor-pointer"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#005600]/5 dark:from-green-400/5 via-transparent to-transparent pointer-events-none z-1 rounded-tr-[2px]" />
                      <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-bold tracking-wider uppercase text-[#005600] dark:text-green-400 bg-[#005600]/5 dark:bg-green-400/10 px-2 py-0.5 rounded-[2px]">
                            {update.tag}
                          </span>
                          {update.isNew && (
                            <span className="text-[9px] font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded-[2px] animate-pulse">
                              {language === 'en' ? 'NEW' : 'புதியது'}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug mb-1 group-hover:text-[#005600] dark:group-hover:text-green-400 transition-colors line-clamp-2">
                          {update.title}
                        </h3>
                        <div className="flex items-center text-[10px] text-gray-400 dark:text-gray-500 gap-1.5 font-medium mt-auto">
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
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#005600]/8 via-transparent to-transparent pointer-events-none z-1 rounded-tr-[2px]" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-[2px] flex items-center justify-center bg-[#005600]/8 text-[#005600] group-hover:bg-[#005600] group-hover:text-white transition-all duration-300">
                        <cta.icon size={20} />
                      </div>
                      <ArrowRight size={18} className="text-gray-400 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#005600]" />
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

      <section className="mt-[60px] container mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeInUp}>
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
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#005600]/8 via-transparent to-transparent pointer-events-none z-1 rounded-tr-[2px]" />
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  <div>
                    <span className="text-xs text-[#005600] font-semibold uppercase tracking-wider mb-2 inline-block">{service.dept}</span>
                    <h3 className="text-xl mb-1 font-outfit font-bold text-gray-900 group-hover:text-[#005600] transition-colors">{service.title}</h3>
                    <p className="text-gray-400 text-xs">{language === 'en' ? 'Processing: ' : 'செயல்முறை நேரம்: '}{service.time}</p>
                  </div>
                  <button className="btn-primary w-full text-xs py-2">{t('home.featuredApply')}</button>
                </div>
              </PixelCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto overflow-hidden">
            <div className="p-0 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full max-w-[240px] aspect-square shrink-0 rounded-[12px] overflow-hidden border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 relative z-20">
                <img src="/thiruvalluvar.png" alt="Thiruvalluvar" className="w-full h-full object-contain" />
              </div>

              <div className="flex-1 relative z-20">
                <div className="flex items-center gap-2 mb-6">
                  <Quote size={24} className="text-[#005600] dark:text-green-400 rotate-180" />
                  <span className="text-sm font-bold uppercase tracking-widest text-gray-400">{t('kural.title')}</span>
                </div>

                <h2 className="text-xs md:text-[clamp(1.5rem,4.5vw,2.5rem)] font-black text-gray-900 dark:text-white mb-6 leading-tight font-anek-tamil">
                  <div className="mb-2 whitespace-nowrap">{currentKuralLine1}</div>
                  <div className="whitespace-nowrap">{currentKuralLine2}</div>
                </h2>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#005600] dark:text-green-400 mb-2">Tamil Meaning</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed italic font-anek-tamil">
                      "{currentKuralMeaningTa}"
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#005600] dark:text-green-400 mb-2">English Meaning</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed italic">
                      "{currentKuralMeaningEn}"
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4 max-w-xs md:max-w-sm">
                    <button
                      onClick={handleDownloadKural}
                      className="flex-1 py-2.5 bg-[#005600] hover:bg-[#004d00] text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-[2px] shadow-lg shadow-[#005600]/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download size={12} />
                      {language === 'en' ? 'Download' : 'பதிவிறக்கு'}
                    </button>
                    <button
                      onClick={handleShareKural}
                      className="flex-1 py-2.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-800 dark:text-white text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-[2px] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Share2 size={12} />
                      {language === 'en' ? 'Share' : 'பகிர்'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showKuralPopup && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={closeKuralPopup}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white dark:bg-[#0a0a0a] rounded-[2px] shadow-2xl overflow-hidden border border-white/10"
            >
              <PixelCard variant="green" className="h-full w-full">
                <button
                  onClick={closeKuralPopup}
                  className="absolute top-4 right-4 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="flex flex-col md:flex-row relative z-20">
                  <div className="w-full md:w-1/2 h-64 md:h-auto md:aspect-square bg-gray-50 dark:bg-[#121212] flex items-center justify-center p-4">
                    <img src="/thiruvalluvar.png" alt="Thiruvalluvar" className="w-full h-full object-contain rounded-[12px] md:rounded-none" />
                  </div>

                  <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                    <div className="text-[#005600] dark:text-green-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                      {currentKuralNo}
                    </div>

                    <h3 className="text-xs md:text-[clamp(1.2rem,4.2vw,2rem)] font-black text-gray-900 dark:text-white mb-6 leading-tight font-anek-tamil">
                      <div className="mb-2 whitespace-nowrap">{currentKuralLine1}</div>
                      <div className="whitespace-nowrap">{currentKuralLine2}</div>
                    </h3>

                    <div className="space-y-4 mb-8">
                      <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed italic font-anek-tamil">
                        "{currentKuralMeaningTa}"
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed italic">
                        "{currentKuralMeaningEn}"
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleDownloadKural}
                        className="flex-1 py-3 bg-[#005600] hover:bg-[#004d00] text-white text-[11px] font-bold uppercase tracking-widest transition-all duration-300 rounded-[2px] shadow-lg shadow-[#005600]/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download size={14} />
                        {language === 'en' ? 'Download' : 'பதிவிறக்கு'}
                      </button>
                      <button
                        onClick={handleShareKural}
                        className="flex-1 py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-800 dark:text-white text-[11px] font-bold uppercase tracking-widest transition-all duration-300 rounded-[2px] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Share2 size={14} />
                        {language === 'en' ? 'Share' : 'பகிர்'}
                      </button>
                    </div>
                  </div>
                </div>
              </PixelCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
