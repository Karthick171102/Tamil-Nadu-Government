import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Send, User, MapPin, Users, Briefcase, MessageSquare,
  ChevronDown, CheckCircle, AlertCircle, Shield
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  DISTRICTS_LIST,
  getConstituenciesByDistrict,
  getMlaByConstituency,
  getOfficerByDistrict,
  PARTY_COLORS,
  ASSEMBLY_METADATA,
} from '../utils/mlaData';

// ── Party Badge ──────────────────────────────────────────────────────────────

function PartyBadge({ party }) {
  const style = PARTY_COLORS[party] || { bg: '#555', text: '#fff' };
  return (
    <span
      className="inline-block text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-[2px] ml-2 align-middle"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {party}
    </span>
  );
}

// ── Custom Animated Select ───────────────────────────────────────────────────

function CustomSelect({ id, label, value, onChange, options, placeholder, icon: Icon, disabled = false }) {
  const [open, setOpen] = useState(false);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest(`#${id}-wrapper`)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, id]);

  const selected = options.find(o => (o.value ?? o) === value);

  return (
    <div id={`${id}-wrapper`} className="relative">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(v => !v)}
        className={`
          w-full flex items-center gap-3 px-4 py-3 rounded-[2px] border text-sm text-left
          transition-all duration-200 outline-none
          ${disabled
            ? 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : `bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 
               text-gray-900 dark:text-gray-100 cursor-pointer 
               hover:border-[#005600] dark:hover:border-[#008250]`
          }
          ${open ? 'border-[#005600] dark:border-[#008250] ring-2 ring-[#005600]/15 dark:ring-[#008250]/20' : ''}
        `}
      >
        {Icon && <Icon size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />}
        <span className={`flex-1 truncate ${!value ? 'text-gray-400 dark:text-gray-600' : ''}`}>
          {selected ? (selected.label ?? selected) : placeholder}
        </span>
        <ChevronDown size={15} className={`text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -6, scaleY: 0.94 }}
            transition={{ duration: 0.14 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-[#111811] border border-gray-200 dark:border-white/10 rounded-[2px] shadow-2xl max-h-56 overflow-y-auto"
            style={{ transformOrigin: 'top' }}
          >
            {options.map((opt, i) => {
              const val = opt.value ?? opt;
              const lbl = opt.label ?? opt;
              const isActive = val === value;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => { onChange(val); setOpen(false); }}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm transition-colors duration-100 flex items-center gap-2
                      ${isActive
                        ? 'bg-[#005600]/8 dark:bg-[#008250]/15 text-[#005600] dark:text-[#008250] font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                      }
                    `}
                  >
                    {opt.ac_no && (
                      <span className="text-[10px] text-gray-400 dark:text-gray-600 w-6 shrink-0 font-mono">
                        {opt.ac_no}
                      </span>
                    )}
                    <span className="flex-1">{lbl}</span>
                    {isActive && <span className="text-[#005600] dark:text-[#008250]">✓</span>}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Auto-Filled Info Card ────────────────────────────────────────────────────

function InfoCard({ label, value, icon: Icon, badge }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      <div className="flex items-start gap-3 px-4 py-3 rounded-[2px] bg-[#005600]/5 dark:bg-[#008250]/10 border border-[#005600]/15 dark:border-[#008250]/20">
        {Icon && <Icon size={15} className="text-[#005600] dark:text-[#008250] shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">
            {value || '—'}
          </span>
          {badge && <PartyBadge party={badge} />}
        </div>
        <Shield size={12} className="text-[#005600]/40 dark:text-[#008250]/40 shrink-0 mt-0.5" />
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

const GrievancePage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const cn = language === 'en';

  const [form, setForm] = useState({ fullName: '', district: '', constituency: '', issue: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [constituencies, setConstituencies] = useState([]);
  const [mlaRecord, setMlaRecord] = useState(null);
  const [officer, setOfficer] = useState('');

  // Rebuild constituencies when district changes
  useEffect(() => {
    if (form.district) {
      const list = getConstituenciesByDistrict(form.district);
      setConstituencies(list.map(m => ({ value: m.constituency, label: m.constituency, ac_no: m.ac_no })));
      setForm(f => ({ ...f, constituency: '' }));
      setMlaRecord(null);
      setOfficer(getOfficerByDistrict(form.district));
    } else {
      setConstituencies([]);
      setMlaRecord(null);
      setOfficer('');
    }
  }, [form.district]);

  // Look up MLA when constituency changes
  useEffect(() => {
    if (form.constituency) {
      setMlaRecord(getMlaByConstituency(form.constituency));
    } else {
      setMlaRecord(null);
    }
  }, [form.constituency]);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = cn ? 'Full name is required.' : 'பெயர் தேவை.';
    if (!form.district)        e.district = cn ? 'Please select a district.' : 'மாவட்டம் தேர்ந்தெடுக்கவும்.';
    if (!form.constituency)    e.constituency = cn ? 'Please select a constituency.' : 'தொகுதி தேர்ந்தெடுக்கவும்.';
    if (!form.issue.trim())    e.issue = cn ? 'Please describe your issue.' : 'உங்கள் பிரச்சனையை விவரிக்கவும்.';
    else if (form.issue.trim().length < 30)
                               e.issue = cn ? 'Please provide at least 30 characters.' : 'குறைந்தது 30 எழுத்துக்கள் தேவை.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm({ fullName: '', district: '', constituency: '', issue: '' });
    setMlaRecord(null);
    setOfficer('');
    setErrors({});
    setSubmitted(false);
  };

  const refId = `TN-GRV-${Date.now().toString().slice(-8)}`;

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg"
        >
          {/* Success Icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 220, damping: 14 }}
              className="w-20 h-20 rounded-full bg-[#005600]/10 dark:bg-[#008250]/15 flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle size={42} className="text-[#005600] dark:text-[#008250]" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
            >
              {cn ? 'Grievance Submitted!' : 'புகார் சமர்ப்பிக்கப்பட்டது!'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed"
            >
              {cn
                ? 'Your grievance has been registered and will be reviewed by the assigned officials.'
                : 'உங்கள் புகார் பதிவு செய்யப்பட்டு நியமிக்கப்பட்ட அதிகாரிகளால் ஆய்வு செய்யப்படும்.'}
            </motion.p>
          </div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2px] divide-y divide-gray-100 dark:divide-white/8 mb-6"
          >
            {/* Reference */}
            <div className="px-5 py-3.5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {cn ? 'Reference ID' : 'குறிப்பு எண்'}
              </span>
              <span className="text-sm font-mono font-bold text-[#005600] dark:text-[#008250]">{refId}</span>
            </div>
            {/* Petitioner */}
            <div className="px-5 py-3.5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {cn ? 'Petitioner' : 'மனுதாரர்'}
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{form.fullName}</span>
            </div>
            {/* Constituency */}
            <div className="px-5 py-3.5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {cn ? 'Constituency' : 'தொகுதி'}
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {form.constituency}
                {mlaRecord && <span className="text-xs text-gray-400 ml-1">(AC {mlaRecord.ac_no})</span>}
              </span>
            </div>
            {/* MLA */}
            {mlaRecord && (
              <div className="px-5 py-3.5 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 shrink-0">
                  {cn ? 'Assigned MLA' : 'சட்டமன்ற உறுப்பினர்'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{mlaRecord.mla}</span>
                  <PartyBadge party={mlaRecord.party} />
                </div>
              </div>
            )}
            {/* Officer */}
            <div className="px-5 py-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                {cn ? 'Assigned Officer' : 'ஒதுக்கப்பட்ட அதிகாரி'}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{officer}</span>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex gap-3"
          >
            <button
              onClick={resetForm}
              className="flex-1 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-[2px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              {cn ? 'Submit Another' : 'மேலும் சமர்ப்பிக்க'}
            </button>
            <button
              onClick={() => navigate('/services')}
              className="flex-1 py-3 text-sm font-bold bg-[#005600] dark:bg-[#008250] text-white rounded-[2px] hover:bg-[#004d00] dark:hover:bg-[#006941] transition-colors"
            >
              {cn ? 'Back to Services' : 'சேவைகளுக்கு திரும்பு'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="pb-20">

      {/* Page Header */}
      <section className="pt-10 pb-8 border-b border-gray-100 dark:border-white/5">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}>

            {/* Breadcrumb */}
            <button
              onClick={() => navigate('/services')}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#005600] dark:hover:text-[#008250] uppercase tracking-wider mb-6 transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
              {cn ? 'Back to Services' : 'சேவைகளுக்கு திரும்பு'}
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-[2px] bg-[#005600]/8 dark:bg-[#008250]/15 text-[#005600] dark:text-[#008250] flex items-center justify-center shrink-0">
                <MessageSquare size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-1">
                  {cn ? 'Submit a Grievance' : 'புகார் சமர்ப்பிக்க'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
                  {cn
                    ? `Submit your petition to the ${ASSEMBLY_METADATA.electionYear} Tamil Nadu Legislative Assembly representative for your constituency.`
                    : `உங்கள் தொகுதியின் ${ASSEMBLY_METADATA.electionYear} தமிழ்நாடு சட்டமன்ற உறுப்பினருக்கு மனு சமர்ப்பிக்கவும்.`}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form Body */}
      <section className="container mx-auto px-6 pt-10">
        <div className="max-w-2xl mx-auto">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.1 }}
            noValidate
          >
            <div className="flex flex-col gap-6">

              {/* ── Full Name ── */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  {cn ? 'Full Name' : 'முழு பெயர்'} <span className="text-red-400">*</span>
                </label>
                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-[2px] border bg-white dark:bg-white/5 transition-all duration-200
                  ${errors.fullName
                    ? 'border-red-400 ring-2 ring-red-400/15'
                    : 'border-gray-200 dark:border-white/10 focus-within:border-[#005600] dark:focus-within:border-[#008250] focus-within:ring-2 focus-within:ring-[#005600]/15 dark:focus-within:ring-[#008250]/20'
                  }
                `}>
                  <User size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />
                  <input
                    id="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder={cn ? 'Enter your full name' : 'உங்கள் முழு பெயரை உள்ளிடுக'}
                    className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                </div>
                {errors.fullName && (
                  <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* ── District ── */}
              <div>
                <CustomSelect
                  id="district"
                  label={<>{cn ? 'District' : 'மாவட்டம்'} <span className="text-red-400">*</span></>}
                  value={form.district}
                  onChange={v => setForm(f => ({ ...f, district: v }))}
                  options={DISTRICTS_LIST}
                  placeholder={cn ? 'Select your district' : 'உங்கள் மாவட்டத்தை தேர்ந்தெடுக்கவும்'}
                  icon={MapPin}
                />
                {errors.district && (
                  <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.district}
                  </p>
                )}
              </div>

              {/* ── Constituency ── */}
              <div>
                <CustomSelect
                  id="constituency"
                  label={<>{cn ? 'Constituency' : 'சட்டமன்றத் தொகுதி'} <span className="text-red-400">*</span></>}
                  value={form.constituency}
                  onChange={v => setForm(f => ({ ...f, constituency: v }))}
                  options={constituencies}
                  placeholder={
                    form.district
                      ? (cn ? 'Select your constituency' : 'தொகுதி தேர்ந்தெடுக்கவும்')
                      : (cn ? 'Select a district first' : 'முதலில் மாவட்டம் தேர்ந்தெடுக்கவும்')
                  }
                  icon={Users}
                  disabled={!form.district}
                />
                {errors.constituency && (
                  <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.constituency}
                  </p>
                )}
              </div>

              {/* ── Auto-filled: MLA & Officer ── */}
              <AnimatePresence>
                {form.constituency && mlaRecord && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.28 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-1">
                      <InfoCard
                        label={cn ? 'Assigned MLA' : 'ஒதுக்கப்பட்ட சட்டமன்ற உறுப்பினர்'}
                        value={mlaRecord.mla}
                        icon={Briefcase}
                        badge={mlaRecord.party}
                      />
                      <InfoCard
                        label={cn ? 'Assigned Officer' : 'ஒதுக்கப்பட்ட அதிகாரி'}
                        value={officer}
                        icon={User}
                      />
                    </div>
                    {/* AC Info strip */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/3 rounded-[2px] border border-gray-100 dark:border-white/5">
                      <span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wider font-semibold">
                        {cn ? 'Assembly Constituency No.' : 'தொகுதி எண்.'}
                      </span>
                      <span className="text-[10px] font-black text-[#005600] dark:text-[#008250] font-mono">
                        {String(mlaRecord.ac_no).padStart(3, '0')}
                      </span>
                      <span className="text-[10px] text-gray-300 dark:text-gray-700 mx-1">•</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wider font-semibold">
                        {cn ? '17th Tamil Nadu Legislative Assembly' : '17வது தமிழ்நாடு சட்டமன்றம்'}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Describe Issue ── */}
              <div>
                <label htmlFor="issue" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  {cn ? 'Describe Your Issue' : 'உங்கள் பிரச்சனையை விவரிக்கவும்'} <span className="text-red-400">*</span>
                </label>
                <div className={`
                  rounded-[2px] border bg-white dark:bg-white/5 transition-all duration-200
                  ${errors.issue
                    ? 'border-red-400 ring-2 ring-red-400/15'
                    : 'border-gray-200 dark:border-white/10 focus-within:border-[#005600] dark:focus-within:border-[#008250] focus-within:ring-2 focus-within:ring-[#005600]/15 dark:focus-within:ring-[#008250]/20'
                  }
                `}>
                  <textarea
                    id="issue"
                    value={form.issue}
                    onChange={e => setForm(f => ({ ...f, issue: e.target.value }))}
                    placeholder={cn
                      ? 'Briefly describe your grievance — what happened, when it occurred, and what resolution you expect…'
                      : 'உங்கள் பிரச்சனையை சுருக்கமாக விவரிக்கவும் — என்ன நடந்தது, எப்போது நடந்தது, என்ன தீர்வு எதிர்பார்க்கிறீர்கள்…'}
                    rows={5}
                    style={{ resize: 'none' }}
                    className="w-full bg-transparent px-4 py-3 text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 leading-relaxed"
                  />
                  <div className="px-4 pb-2.5 flex justify-end">
                    <span className={`text-[11px] font-medium transition-colors ${form.issue.length < 30 ? 'text-gray-400' : 'text-[#005600] dark:text-[#008250]'}`}>
                      {form.issue.length} {cn ? 'chars' : 'எழுத்துக்கள்'}
                      {form.issue.length < 30
                        ? ` (${cn ? 'min' : 'குறைந்தது'} 30)`
                        : ' ✓'}
                    </span>
                  </div>
                </div>
                {errors.issue && (
                  <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.issue}
                  </p>
                )}
              </div>

              {/* ── Divider ── */}
              <div className="w-full h-px bg-gray-100 dark:bg-white/6" />

              {/* ── Buttons ── */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/services')}
                  className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-[2px] hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 transition-all duration-200"
                >
                  {cn ? 'Go Back' : 'திரும்பு'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 text-sm font-bold bg-[#005600] dark:bg-[#008250] text-white rounded-[2px] hover:bg-[#004d00] dark:hover:bg-[#006941] shadow-lg shadow-[#005600]/20 dark:shadow-[#008250]/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Send size={14} />
                  {cn ? 'Submit Grievance' : 'புகாரை சமர்ப்பி'}
                </button>
              </div>

            </div>
          </motion.form>
        </div>
      </section>

    </div>
  );
};

export default GrievancePage;
