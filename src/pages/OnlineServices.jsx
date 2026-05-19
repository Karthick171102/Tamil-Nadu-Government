import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ArrowRight, X,
  Building2, FileText, ExternalLink, Briefcase, GraduationCap, Gavel, Bus, Map, HelpCircle, FileCheck, Landmark, ShieldCheck, CreditCard, LayoutDashboard, Users
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PixelCard from '../components/PixelCard';

const OnlineServices = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Department');

  const departments = [
    { 
      label: t('dept.adiDravida'),
      key: 'adiDravida',
      color: '#005600'
    },
    { 
      label: t('dept.commercialTaxes'),
      key: 'commercialTaxes',
      color: '#005600'
    },
    { 
      label: t('dept.energy'),
      key: 'energy',
      color: '#005600'
    },
    { 
      label: t('dept.environment'),
      key: 'environment',
      color: '#005600'
    },
    { 
      label: t('dept.finance'),
      key: 'finance',
      color: '#005600'
    },
    { 
      label: t('dept.higherEducation'),
      key: 'higherEducation',
      color: '#005600'
    },
    { 
      label: t('dept.home'),
      key: 'home',
      color: '#005600'
    },
    { 
      label: t('dept.housing'),
      key: 'housing',
      color: '#005600'
    },
    { 
      label: t('dept.industries'),
      key: 'industries',
      color: '#005600'
    },
    { 
      label: t('dept.it'),
      key: 'it',
      color: '#005600'
    },
    { 
      label: t('dept.labour'),
      key: 'labour',
      color: '#005600'
    },
    { 
      label: t('dept.law'),
      key: 'law',
      color: '#005600'
    },
    { 
      label: t('dept.revenue'),
      key: 'revenue',
      color: '#005600'
    },
    { 
      label: t('dept.schoolEducation'),
      key: 'schoolEducation',
      color: '#005600'
    },
    { 
      label: t('dept.socialWelfare'),
      key: 'socialWelfare',
      color: '#005600'
    },
    { 
      label: t('dept.tourism'),
      key: 'tourism',
      color: '#005600'
    },
    { 
      label: t('dept.transport'),
      key: 'transport',
      color: '#005600'
    }
  ];

  const filters = [
    { label: t('onlineServices.department'), key: 'Department' },
    { label: t('onlineServices.service'), key: 'Service' },
    { label: t('onlineServices.category'), key: 'Category' }
  ];

  const serviceWiseItems = [
    { key: 'swSchemes', icon: LayoutDashboard },
    { key: 'societiesDocs', icon: FileText },
    { key: 'newDealerVAT', icon: Briefcase },
    { key: 'busRoutes', icon: Bus },
    { key: 'causeListDebts', icon: Gavel },
    { key: 'causeListDRT1', icon: Gavel },
    { key: 'causeListDRT2', icon: Gavel },
    { key: 'causeListDRT3', icon: Gavel },
    { key: 'causeListDRTCBE', icon: Gavel },
    { key: 'causeListDRTMDU', icon: Gavel },
    { key: 'causeListIPAB', icon: Gavel },
    { key: 'examResults', icon: GraduationCap },
    { key: 'areaProfile', icon: Map },
    { key: 'commTaxesPortal', icon: Landmark },
    { key: 'seniorityDates', icon: Briefcase },
    { key: 'collegeDetails', icon: GraduationCap },
    { key: 'digitalLibrary', icon: FileText },
    { key: 'diplomaVerify', icon: FileCheck },
    { key: 'scert', icon: GraduationCap },
    { key: 'ecsPayment', icon: CreditCard },
    { key: 'eDistrictCerts', icon: FileCheck },
    { key: 'eTendering', icon: Briefcase },
    { key: 'ewaybill', icon: CreditCard },
    { key: 'finAssistance', icon: CreditCard },
    { key: 'landGuideline', icon: Map },
    { key: 'seatAvailability', icon: Bus },
    { key: 'unidentifiedBodies', icon: Search },
    { key: 'remittanceParticulars', icon: Landmark },
    { key: 'galleriesVideo', icon: FileText },
    { key: 'grievanceStatus', icon: HelpCircle },
    { key: 'gstPortal', icon: Landmark },
    { key: 'gstReturn', icon: CreditCard },
    { key: 'projectIncentives', icon: Briefcase },
    { key: 'rtoJurisdiction', icon: Map },
    { key: 'epfoStatus', icon: Landmark },
    { key: 'knowYourRTO', icon: Map },
    { key: 'missingPerson', icon: Search },
    { key: 'revenueMutation', icon: FileText },
    { key: 'gstNewReg', icon: Landmark },
    { key: 'scholarshipApp', icon: GraduationCap },
    { key: 'tangedcoPortal', icon: Landmark },
    { key: 'bidProposal', icon: FileText },
    { key: 'complaintReg', icon: HelpCircle },
    { key: 'npAuthorisation', icon: FileText },
    { key: 'hypothecation', icon: FileText },
    { key: 'newVehicleApp', icon: Bus },
    { key: 'heavyVehicleCert', icon: FileCheck },
    { key: 'electricityBill', icon: CreditCard },
    { key: 'employmentReg', icon: Briefcase },
    { key: 'primerEducation', icon: GraduationCap },
    { key: 'projectOpp', icon: Briefcase },
    { key: 'readTextbooks', icon: GraduationCap },
    { key: 'ror', icon: FileText },
    { key: 'firCopy', icon: ShieldCheck },
    { key: 'trbResults', icon: GraduationCap },
    { key: 'tnpscResults', icon: Briefcase },
    { key: 'sidcoSchemes', icon: Briefcase },
    { key: 'chitCompany', icon: Landmark },
    { key: 'registeredSociety', icon: Landmark },
    { key: 'stampVendor', icon: Landmark },
    { key: 'searchTaxpayer', icon: Search },
    { key: 'marriageReg', icon: FileText },
    { key: 'startingRegNum', icon: FileText },
    { key: 'bidderEnrolment', icon: Briefcase },
    { key: 'cstForms', icon: FileText },
    { key: 'drivingLicenseStatus', icon: FileCheck },
    { key: 'tangedco', icon: Landmark },
    { key: 'pollutionControl', icon: ShieldCheck },
    { key: 'ttdc', icon: Map },
    { key: 'tenderResult', icon: FileText },
    { key: 'tendersInfo', icon: FileText },
    { key: 'tentativeKeys', icon: GraduationCap },
    { key: 'entrepreneurMem', icon: Briefcase },
    { key: 'tnegaCsc', icon: Landmark },
    { key: 'rtoAppointment', icon: FileText },
    { key: 'rtoGrievance', icon: HelpCircle },
    { key: 'publicGrievance', icon: HelpCircle },
    { key: 'refundStatus', icon: CreditCard },
    { key: 'regAppStatus', icon: FileCheck },
    { key: 'vatCommodity', icon: Search },
    { key: 'vatEpayment', icon: CreditCard },
    { key: 'vatRefund', icon: CreditCard },
    { key: 'vatReturns', icon: CreditCard },
    { key: 'porambokeVerify', icon: Map },
    { key: 'pattaVerify', icon: Map },
    { key: 'highCourtCauselist', icon: Gavel },
    { key: 'vehicleDetails', icon: Bus },
  ];

  const categoryItems = [
    { key: 'g2b', icon: Building2 },
    { key: 'g2c', icon: Users },
    { key: 'g2e', icon: Briefcase },
    { key: 'recruitment', icon: GraduationCap },
    { key: 'transaction', icon: CreditCard },
  ];

  const currentDisplayData = activeFilter === 'Service' 
    ? serviceWiseItems.map(item => ({ label: t(`svc.${item.key}`), key: item.key, icon: item.icon, type: 'service' }))
    : activeFilter === 'Category'
    ? categoryItems.map(item => ({ label: t(`onlineServices.cat.${item.key}`), key: item.key, icon: item.icon, type: 'category' }))
    : departments.map(dept => ({ ...dept, type: 'department', icon: Building2 }));

  const filtered = searchQuery.trim()
    ? currentDisplayData.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentDisplayData;

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 15 },
  };

  return (
    <div className="pb-20">
      {/* Hero + Search Section */}
      <section className="pt-10 pb-6 container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          {/* Heading and Tabs Group */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8  dark:border-white/10">
            <div className="pb-4">
              <motion.h1 variants={fadeInUp} className="text-2xl font-bold tracking-tight mb-2">
                {t('onlineServices.title')}
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                {t('onlineServices.subtitle')}
              </motion.p>
            </div>

            {/* Underlined Tab Style */}
            <motion.div variants={fadeInUp} className="flex gap-8 overflow-x-auto no-scrollbar w-full md:w-auto">
              {filters.map((filter, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`relative pb-4 px-1 text-sm font-bold transition-all duration-300 whitespace-nowrap tracking-wide uppercase ${
                    activeFilter === filter.key
                      ? 'text-[#005600] dark:text-green-400'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                  }`}
                >
                  {filter.label}
                  {activeFilter === filter.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#005600] dark:bg-green-400 rounded-t-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Search Bar matching ServicesHub */}
          <motion.div variants={fadeInUp} className="flex items-center gap-2 w-full max-w-[480px] bg-white dark:bg-[#0a0a0a] px-4 py-2.5 rounded-[2px] border border-black/8 dark:border-white/10 focus-within:border-[#005600] focus-within:ring-2 focus-within:ring-[#005600]/20 transition-all duration-300 mb-6">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeFilter === 'Service' 
                  ? t('onlineServices.searchPlaceholderSvc') 
                  : activeFilter === 'Category'
                  ? t('onlineServices.searchPlaceholderCat')
                  : t('onlineServices.searchPlaceholderDept')
              }
              className="flex-1 bg-transparent border-none text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={14} />
              </button>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Grid Content */}
      <section className="container mx-auto px-6">
        <motion.div
          key={`${activeFilter}-${searchQuery}`}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <motion.div key={index} variants={fadeInUp} className={item.type === 'service' ? 'h-[160px]' : 'h-[180px]'}>
                <PixelCard
                  variant="green"
                  className="group relative overflow-hidden h-full rounded-[2px] border border-black/8 dark:border-white/10 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-[#005600]/20 dark:hover:border-green-400/30 transition-all duration-300 bg-white dark:bg-[#0a0a0a]"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#005600]/5 dark:from-green-400/5 via-transparent to-transparent pointer-events-none z-1 rounded-tr-[2px]" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-start z-10">
                    <div className="w-9 h-9 mb-4 rounded-[2px] bg-[#005600]/8 dark:bg-green-400/10 text-[#005600] dark:text-green-400 flex items-center justify-center border border-[#005600]/10 z-20 group-hover:bg-[#005600] dark:group-hover:bg-green-400 group-hover:text-white dark:group-hover:text-black transition-all duration-300 shrink-0">
                      <item.icon size={18} />
                    </div>

                    <h3 className={`font-bold text-gray-900 dark:text-gray-100 tracking-tight group-hover:text-[#005600] dark:group-hover:text-green-400 transition-colors line-clamp-3 ${item.type === 'service' ? 'text-[13px] leading-relaxed' : 'text-sm'}`}>
                      {item.label}
                    </h3>

                    <div className="relative mt-auto min-h-[24px] overflow-hidden">
                      <div className="absolute inset-0 flex items-center gap-2 text-[#005600] dark:text-green-400 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.type === 'service' ? 'Open Service' : 'Explore'}</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </PixelCard>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="text-gray-400 text-sm">
                {t('onlineServices.noResults')} "<span className="font-medium text-gray-600">{searchQuery}</span>"
              </p>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default OnlineServices;
