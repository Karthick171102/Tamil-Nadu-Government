import { motion } from 'framer-motion';
import { Building2, Search, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PixelCard from '../components/PixelCard';

const DepartmentsHub = () => {
  const { t } = useLanguage();

  const departments = [
    { name: t('dept.cat.revenue'), desc: t('dept.cat.revenueDesc'), count: 24 },
    { name: t('dept.cat.health'), desc: t('dept.cat.healthDesc'), count: 18 },
    { name: t('dept.cat.education'), desc: t('dept.cat.educationDesc'), count: 32 },
    { name: t('dept.cat.transport'), desc: t('dept.cat.transportDesc'), count: 12 },
    { name: t('dept.cat.agriculture'), desc: t('dept.cat.agricultureDesc'), count: 45 },
    { name: t('dept.cat.it'), desc: t('dept.cat.itDesc'), count: 8 },
  ];

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div style={{ padding: '40px 0 24px 0' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>
          {t('dept.title')}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
          {t('dept.subtitle')}
        </p>
      </div>

      <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
        {departments.map((dept, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="min-h-[280px] flex flex-col"
          >
            <PixelCard
              variant="green"
              className="group relative overflow-hidden h-full rounded-[2px] border border-black/8 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-[#005600]/20 transition-all duration-300 bg-white"
            >
              {/* Mild green gradient at top right alone */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#005600]/8 via-transparent to-transparent pointer-events-none z-1 rounded-tr-[2px]" />

              {/* Absolute Card Content Overlay */}
              <div className="relative flex-1 p-8 flex flex-col justify-between z-10">
                <div>
                  <div className="w-10 h-10 rounded-[2px] bg-[#005600]/8 text-[#005600] flex items-center justify-center mb-4 group-hover:bg-[#005600] group-hover:text-white transition-all duration-300">
                    <Building2 size={20} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-[#005600] transition-colors">{dept.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{dept.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/5">
                  <span className="text-[10px] font-bold text-[#005600] uppercase tracking-wider">{dept.count} {t('dept.activeServices')}</span>
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#005600] flex items-center gap-1.5 transition-colors uppercase tracking-wider">
                    {t('dept.viewDetails')}
                    <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </PixelCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsHub;
