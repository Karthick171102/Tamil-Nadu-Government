import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, ArrowUp } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import Home from './pages/Home';
import ServicesHub from './pages/ServicesHub';
import DepartmentsHub from './pages/DepartmentsHub';
import GovernmentHub from './pages/GovernmentHub';
import DocumentsHub from './pages/DocumentsHub';
import SchemesHub from './pages/SchemesHub';
import PlaceholderPage from './pages/PlaceholderPage';
import NewsPage from './pages/NewsPage';
import HelpPage from './pages/HelpPage';
import { useLanguage } from './context/LanguageContext';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};

function App() {
  const location = useLocation();
  const mainRef = useRef(null);
  const { t, language, toggleLanguage } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [footerVisibleHeight, setFooterVisibleHeight] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        const scrollTop = mainRef.current.scrollTop;
        const scrollHeight = mainRef.current.scrollHeight;
        const clientHeight = mainRef.current.clientHeight;
        const maxScroll = scrollHeight - clientHeight;

        // Show back-to-top button
        setShowScrollTop(scrollTop > 300);

        // Check if user is at the topmost position alone
        setIsAtTop(scrollTop === 0);

        // Check if footer meets header
        const footerEl = document.querySelector('footer');
        if (footerEl) {
          const footerHeight = footerEl.offsetHeight;
          const footerTopViewport = scrollHeight - footerHeight - scrollTop;
          // Meets header (height 80px)
          const meetsHeader = footerTopViewport <= 80;
          setHideNavbar(meetsHeader && maxScroll > 150);

          // Calculate visible height of footer in the viewport
          const visibleHeight = Math.max(0, clientHeight - footerTopViewport);
          setFooterVisibleHeight(visibleHeight);
        } else {
          setHideNavbar(false);
          setFooterVisibleHeight(0);
        }
      }
    };

    const mainEl = mainRef.current;
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (mainEl) {
        mainEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <motion.div
        className="flex flex-col fixed inset-0 overflow-hidden w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="grid-bg"></div>
        <Navbar hide={hideNavbar} isAtTop={isAtTop} />
        <main ref={mainRef} className="flex-1 overflow-y-auto w-full flex flex-col justify-between">
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/services" element={<PageWrapper><ServicesHub /></PageWrapper>} />
                <Route path="/departments" element={<PageWrapper><DepartmentsHub /></PageWrapper>} />
                <Route path="/government" element={<PageWrapper><GovernmentHub /></PageWrapper>} />
                <Route path="/documents" element={<PageWrapper><DocumentsHub /></PageWrapper>} />
                <Route path="/schemes" element={<PageWrapper><SchemesHub /></PageWrapper>} />
                <Route path="/news" element={<PageWrapper><NewsPage /></PageWrapper>} />
                <Route path="/help" element={<PageWrapper><HelpPage /></PageWrapper>} />
              </Routes>
            </AnimatePresence>
          </div>
          {location.pathname !== '/help' && <Footer />}
        </main>


        {/* Floating Back to Top Button — anchored bottom 24px, center (slides up dynamically with the footer) */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              onClick={scrollToTop}
              initial={{ opacity: 0, y: 30, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 30, x: '-50%' }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.92 }}
              className="fixed left-1/2 z-[999] w-12 h-12 bg-white text-gray-700 hover:text-gray-900 rounded-full border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center cursor-pointer select-none transition-all duration-300"
              style={{ bottom: `${24 + footerVisibleHeight}px` }}
              aria-label="Back to Top"
            >
              <ArrowUp size={20} className="text-gray-500 hover:text-gray-900 transition-colors" />
            </motion.button>
          )}
        </AnimatePresence>
        <Analytics />
      </motion.div>
    </>
  );
}

export default App;
