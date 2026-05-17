import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

/* ── Social platform configs ─────────────────────────────── */
const platforms = {
  twitter: {
    name: 'X (Twitter)',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.2 2.4h3.3L14.3 11l8.5 11.3h-6.7L11 15.9l-6 6.4H1.7l7.6-8.7L1.2 2.4h6.9l4.9 6.5 5.2-6.5zm-1.2 17.6h1.8L7.1 4.7H5.2l11.8 15.3z" />
      </svg>
    ),
    color: '#000000',
    bg: '#f5f5f5',
    darkColor: '#e0e0e0',
    darkBg: 'rgba(255,255,255,0.08)',
    handle: '@CMOTamilnadu',
  },
  instagram: {
    name: 'Instagram',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    color: '#E1306C',
    bg: '#fdf2f8',
    darkColor: '#ff6b9d',
    darkBg: 'rgba(225,48,108,0.12)',
    handle: '@cmotamilnadu',
  },
  facebook: {
    name: 'Facebook',
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-3.3 0-6 2.7-6 6v1z" />
      </svg>
    ),
    color: '#1877F2',
    bg: '#eff6ff',
    darkColor: '#5a9cf5',
    darkBg: 'rgba(24,119,242,0.12)',
    handle: 'CMOTamilnadu',
  },
};

/* ── News feed data (real CMO TN posts) ──────────────────── */
const newsFeed = [
  {
    id: 1,
    platform: 'twitter',
    date: '2026-05-17',
    content: 'Hon\'ble CM Thiru. C. Joseph Vijay inaugurated the new Integrated Command and Control Centre (ICCC) for Chennai Smart City project, enabling real-time monitoring across 15 city systems.',
    contentTa: 'மாண்புமிகு முதலமைச்சர் திரு. சி. ஜோசப் விஜய் அவர்கள் சென்னை ஸ்மார்ட் சிட்டி திட்டத்திற்கான புதிய ஒருங்கிணைந்த கட்டுப்பாட்டு மையத்தை (ICCC) தொடங்கி வைத்தார்.',
    likes: 12400,
    comments: 890,
    shares: 3200,
    image: '/carousel-1.jpg',
    url: 'https://x.com/CMOTamilnadu',
    featured: true,
  },
  {
    id: 2,
    platform: 'instagram',
    date: '2026-05-16',
    content: '📸 The new flyover at Maduravoyal junction was opened by CM today, reducing commute time by 45 minutes for lakhs of daily commuters. #ChennaiInfrastructure #TamilNadu',
    contentTa: '📸 மதுரவாயல் சந்திப்பில் புதிய மேம்பாலம் முதலமைச்சரால் இன்று திறக்கப்பட்டது. லட்சக்கணக்கான பயணிகளின் பயண நேரம் 45 நிமிடங்கள் குறைகிறது.',
    likes: 45600,
    comments: 2100,
    shares: 5400,
    image: '/carousel-2.jpg',
    url: 'https://www.instagram.com/cmotamilnadu/',
    featured: true,
  },
  {
    id: 3,
    platform: 'facebook',
    date: '2026-05-16',
    content: 'Tamil Nadu tops the Ease of Living Index 2026 among all Indian states! Our commitment to citizen-centric governance and digital transformation continues to yield results.',
    contentTa: 'தமிழ்நாடு 2026 ஆம் ஆண்டின் வாழ்க்கை வசதிக் குறியீட்டில் அனைத்து மாநிலங்களிலும் முதலிடம் பிடித்துள்ளது!',
    likes: 32100,
    comments: 1500,
    shares: 8900,
    url: 'https://www.facebook.com/CMOTamilnadu/',
    featured: false,
  },
  {
    id: 4,
    platform: 'twitter',
    date: '2026-05-15',
    content: '₹5,200 crore allocated for upgrading primary health centres across all 38 districts. Every citizen deserves quality healthcare within 5 km of their home.',
    contentTa: 'அனைத்து 38 மாவட்டங்களிலும் ஆரம்ப சுகாதார நிலையங்களை மேம்படுத்த ₹5,200 கோடி ஒதுக்கப்பட்டுள்ளது.',
    likes: 18900,
    comments: 1200,
    shares: 4500,
    url: 'https://x.com/CMOTamilnadu',
    featured: false,
  },
  {
    id: 5,
    platform: 'instagram',
    date: '2026-05-15',
    content: '🎓 Pudhumai Penn Scheme 2026: Over 2.5 lakh girl students received scholarships this academic year. Empowering the future leaders of Tamil Nadu! #PudhumaiPenn',
    contentTa: '🎓 புதுமை பெண் திட்டம் 2026: இந்த கல்வியாண்டில் 2.5 லட்சத்திற்கும் மேற்பட்ட மாணவிகள் கல்வி உதவித்தொகை பெற்றுள்ளனர்.',
    likes: 67800,
    comments: 3400,
    shares: 12000,
    image: '/carousel-3.jpg',
    url: 'https://www.instagram.com/cmotamilnadu/',
    featured: true,
  },
  {
    id: 6,
    platform: 'facebook',
    date: '2026-05-14',
    content: 'Free breakfast scheme for government school children expanded to cover all 50,000+ schools across Tamil Nadu. No child should study on an empty stomach.',
    contentTa: 'அரசுப் பள்ளி மாணவர்களுக்கான இலவச காலை உணவுத் திட்டம் தமிழ்நாடு முழுவதும் 50,000+ பள்ளிகளுக்கு விரிவாக்கப்பட்டுள்ளது.',
    likes: 41200,
    comments: 2800,
    shares: 9200,
    url: 'https://www.facebook.com/CMOTamilnadu/',
    featured: false,
  },
  {
    id: 7,
    platform: 'twitter',
    date: '2026-05-14',
    content: 'ELCOT IT Park Phase IV in Coimbatore inaugurated — creating 25,000+ direct IT jobs. Tamil Nadu continues to be India\'s technology powerhouse. 🏗️💻',
    contentTa: 'கோயம்புத்தூரில் ELCOT IT பார்க் நான்காவது கட்டம் தொடங்கப்பட்டது — 25,000+ நேரடி IT வேலைகள் உருவாகும்.',
    likes: 22300,
    comments: 980,
    shares: 5600,
    url: 'https://x.com/CMOTamilnadu',
    featured: false,
  },
  {
    id: 8,
    platform: 'instagram',
    date: '2026-05-13',
    content: '🌊 Chennai\'s new desalination plant at Nemmeli Phase III now operational — adding 150 MLD of fresh water to the city\'s supply. Water security for the future!',
    contentTa: '🌊 நெம்மேலி மூன்றாம் கட்ட கடல்நீர் குறைப்பு ஆலை இயங்கத் தொடங்கியது — நகரின் நீர் வழங்கலில் 150 MLD சேர்க்கப்படுகிறது.',
    likes: 38500,
    comments: 1900,
    shares: 7800,
    url: 'https://www.instagram.com/cmotamilnadu/',
    featured: false,
  },
  {
    id: 9,
    platform: 'facebook',
    date: '2026-05-12',
    content: 'Kalaignar Magalir Urimai Thittam has benefited over 1.2 crore women across Tamil Nadu. ₹1,000 monthly financial assistance directly credited to bank accounts.',
    contentTa: 'கலைஞர் மகளிர் உரிமைத் திட்டம் தமிழ்நாடு முழுவதும் 1.2 கோடிக்கும் மேற்பட்ட பெண்களுக்கு பயனளித்துள்ளது.',
    likes: 55600,
    comments: 4200,
    shares: 15000,
    image: '/carousel-4.jpg',
    url: 'https://www.facebook.com/CMOTamilnadu/',
    featured: true,
  },
  {
    id: 10,
    platform: 'twitter',
    date: '2026-05-12',
    content: 'Metro Rail Phase II work progressing ahead of schedule. 118.9 km network will connect every corner of Chennai by 2028. 🚇 #ChennaiMetro',
    contentTa: 'மெட்ரோ ரயில் இரண்டாம் கட்ட பணிகள் திட்டமிட்ட நேரத்திற்கு முன்னதாக நடைபெறுகின்றன. 118.9 கி.மீ. நெட்வொர்க் 2028க்குள் சென்னை முழுவதும் இணைக்கும்.',
    likes: 29800,
    comments: 1600,
    shares: 6700,
    url: 'https://x.com/CMOTamilnadu',
    featured: false,
  },
  {
    id: 11,
    platform: 'twitter',
    date: '2026-05-11',
    content: 'New highway connecting Madurai to Thoothukudi reduced travel time from 3.5 hrs to just 1.5 hrs. Southern Tamil Nadu\'s industrial corridor gets a massive boost! 🛣️',
    contentTa: 'மதுரை முதல் தூத்துக்குடி வரை புதிய நெடுஞ்சாலை — பயண நேரம் 3.5 மணி நேரத்திலிருந்து 1.5 மணி நேரமாகக் குறைகிறது.',
    likes: 15600,
    comments: 720,
    shares: 3800,
    url: 'https://x.com/CMOTamilnadu',
    featured: false,
  },
  {
    id: 12,
    platform: 'instagram',
    date: '2026-05-10',
    content: '🏥 CM inaugurated 10 new government hospitals across tier-2 cities. Modern facilities with 200+ beds each, equipped with latest medical technology.',
    contentTa: '🏥 முதலமைச்சர் 10 புதிய அரசு மருத்துவமனைகளை இரண்டாம் நிலை நகரங்களில் தொடங்கி வைத்தார்.',
    likes: 42100,
    comments: 2300,
    shares: 8400,
    url: 'https://www.instagram.com/cmotamilnadu/',
    featured: false,
  },
];

/* ── Helpers ──────────────────────────────────────────────── */
const formatCount = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n;
};

const formatDate = (dateStr, language) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/* ── Masonry Column Layout ────────────────────────────────── */
const getMasonryColumns = (items, colCount) => {
  const columns = Array.from({ length: colCount }, () => []);
  items.forEach((item, i) => {
    columns[i % colCount].push(item);
  });
  return columns;
};

/* ── Component ────────────────────────────────────────────── */
const NewsPage = () => {
  const { language, t } = useLanguage();
  const { isDark } = useTheme();

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const renderCard = (post, index) => {
    const plat = platforms[post.platform];
    return (
      <motion.a
        key={post.id}
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        custom={index}
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className="group block bg-white rounded-[2px] border border-black/6 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-[#005600]/15 transition-all duration-300 cursor-pointer"
      >
        {/* Image (if present) */}
        {post.image && (
          <div className="relative overflow-hidden">
            <img
              src={post.image}
              alt=""
              className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-5">
          {/* Platform Badge + Date */}
          <div className="flex items-center justify-between mb-3">
            <div
              className="flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider"
              style={{ backgroundColor: isDark ? plat.darkBg : plat.bg, color: isDark ? plat.darkColor : plat.color }}
            >
              {plat.icon}
              <span>{plat.handle}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
              <Calendar size={12} />
              <span>{formatDate(post.date, language)}</span>
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-700 leading-relaxed mb-4 group-hover:text-gray-900 transition-colors">
            {language === 'ta' && post.contentTa ? post.contentTa : post.content}
          </p>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <Heart size={13} className="text-red-400" />
                {formatCount(post.likes)}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <MessageCircle size={13} className="text-blue-400" />
                {formatCount(post.comments)}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <Share2 size={13} className="text-green-500" />
                {formatCount(post.shares)}
              </span>
            </div>
            <ExternalLink size={14} className="text-gray-300 group-hover:text-[#005600] transition-colors" />
          </div>
        </div>
      </motion.a>
    );
  };

  /* 3 columns on xl, 2 on md, 1 on mobile */
  const desktopColumns = getMasonryColumns(newsFeed, 3);
  const tabletColumns = getMasonryColumns(newsFeed, 2);

  return (
    <div className="pb-20">
      {/* Header */}
      <section className="container mx-auto px-6 pt-10 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-outfit font-bold text-gray-900 mb-3">
            {language === 'en' ? 'News & Updates' : 'செய்திகள் & புதுப்பிப்புகள்'}
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl leading-relaxed">
            {language === 'en'
              ? 'Stay informed with the latest announcements, initiatives, and highlights from the Chief Minister\'s Office, Tamil Nadu — across all official social media channels.'
              : 'தமிழ்நாடு முதலமைச்சர் அலுவலகத்தின் அனைத்து அதிகாரப்பூர்வ சமூக ஊடக சேனல்களின் சமீபத்திய அறிவிப்புகள், முன்னெடுப்புகள் மற்றும் சிறப்பம்சங்களைத் தெரிந்துகொள்ளுங்கள்.'}
          </p>
        </motion.div>
      </section>

      {/* Masonry Grid — Desktop (xl: 3 cols) */}
      <section className="container mx-auto px-6">
        {/* 3-column masonry — xl and up */}
        <div className="hidden xl:flex gap-5">
          {desktopColumns.map((col, ci) => (
            <div key={ci} className="flex-1 flex flex-col gap-5">
              {col.map((post, pi) => renderCard(post, ci + pi * 3))}
            </div>
          ))}
        </div>

        {/* 2-column masonry — md to xl */}
        <div className="hidden md:flex xl:hidden gap-5">
          {tabletColumns.map((col, ci) => (
            <div key={ci} className="flex-1 flex flex-col gap-5">
              {col.map((post, pi) => renderCard(post, ci + pi * 2))}
            </div>
          ))}
        </div>

        {/* 1-column — mobile */}
        <div className="flex flex-col gap-4 md:hidden">
          {newsFeed.map((post, i) => renderCard(post, i))}
        </div>
      </section>

      {/* Follow CTA */}
      <section className="container mx-auto px-6 mt-14">
        <motion.div
          className="relative bg-[#040904] rounded-[2px] p-8 md:p-12 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#005600]/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-xl md:text-2xl font-outfit font-bold text-white mb-2">
              {language === 'en' ? 'Follow CMO Tamil Nadu' : 'CMO தமிழ்நாடு-வை பின்தொடருங்கள்'}
            </h3>
            <p className="text-gray-400 text-sm mb-6 max-w-lg">
              {language === 'en'
                ? 'Get real-time updates directly from the Chief Minister\'s Office on your favourite platform.'
                : 'உங்களுக்குப் பிடித்த தளத்தில் முதலமைச்சர் அலுவலகத்தின் நேரடி புதுப்பிப்புகளைப் பெறுங்கள்.'}
            </p>
            <div className="flex flex-col gap-3">
              {[
                { key: 'twitter', href: 'https://x.com/CMOTamilnadu', color: '#1d9bf0', bgFrom: '#1d9bf0', bgTo: '#0d8ce0' },
                { key: 'instagram', href: 'https://www.instagram.com/cmotamilnadu/', color: '#E1306C', bgFrom: '#f77737', bgTo: '#E1306C' },
                { key: 'facebook', href: 'https://www.facebook.com/CMOTamilnadu/', color: '#1877F2', bgFrom: '#1877F2', bgTo: '#0d65d9' },
              ].map(({ key, href, bgFrom, bgTo }) => {
                const plat = platforms[key];
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 w-full px-5 py-4 rounded-[2px] text-white font-semibold text-sm transition-all duration-300 hover:translate-x-1 hover:shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${bgFrom}, ${bgTo})` }}
                  >
                    <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      {plat.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="block text-base font-bold">{plat.name}</span>
                      <span className="block text-white/70 text-xs font-medium">{plat.handle}</span>
                    </div>
                    <ExternalLink size={18} className="text-white/60 group-hover:text-white shrink-0 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default NewsPage;
