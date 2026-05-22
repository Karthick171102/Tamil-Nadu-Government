import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Send, User, MapPin, Users, Briefcase, MessageSquare,
  ChevronDown, CheckCircle, AlertCircle, Shield, Search, FileText, Clock, Check,
  Upload, Trash2, X, Phone, Mail
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  DISTRICTS_LIST,
  getConstituenciesByDistrict,
  getMlaByConstituency,
  getOfficerByDistrict,
  ASSEMBLY_METADATA,
} from '../utils/mlaData';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import emailjs from '@emailjs/browser';


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
          w-full flex items-center gap-3 px-4 py-3 rounded-[2px] border border-solid text-sm text-left
          transition-all duration-200 outline-none
          ${disabled
            ? 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : `bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 
               text-gray-900 dark:text-gray-100 cursor-pointer 
               hover:border-[#ea580c]`
          }
          ${open ? 'border-[#ea580c] ring-2 ring-[#ea580c]/15' : ''}
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
            className="absolute z-50 w-full mt-1 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2px] shadow-2xl max-h-56 overflow-y-auto"
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
                        ? 'bg-[#ea580c]/8 dark:bg-[#ea580c]/15 text-[#ea580c] font-semibold'
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
                    {isActive && <span className="text-[#ea580c]">✓</span>}
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

function InfoCard({ label, value }) {
  return (
    <div className="cursor-default select-none pointer-events-none">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 cursor-default">
        {label}
      </label>
      <div className="flex items-start gap-3 px-4 py-3 rounded-[2px] bg-white dark:bg-[#1a120f]/50 border-2 border-[#ea580c]/30 dark:border-[#ea580c]/40">
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">
            {value || '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Utilities ────────────────────────────────────────────────────────────────
const getExtension = (mimeType) => {
  if (!mimeType) return '';
  if (mimeType.includes('pdf')) return '.pdf';
  if (mimeType.includes('png')) return '.png';
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return '.jpg';
  if (mimeType.includes('gif')) return '.gif';
  return '';
};

// ── Main Page ────────────────────────────────────────────────────────────────

const GrievancePage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const cn = language === 'en';

  const [view, setView] = useState('landing'); // 'landing', 'form', 'status', 'success'
  const [searchId, setSearchId] = useState('');
  const [searchError, setSearchError] = useState('');
  const [activeGrievance, setActiveGrievance] = useState(null);
  const [submittedGrievance, setSubmittedGrievance] = useState(null);
  const [modalAttachment, setModalAttachment] = useState(null);

  const [form, setForm] = useState({ fullName: '', phone: '', email: '', district: '', constituency: '', issue: '', attachments: [] });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState('idle'); // 'idle', 'sending', 'sent', 'failed', 'simulated'
  const [isSearching, setIsSearching] = useState(false);
  const [constituencies, setConstituencies] = useState([]);
  const [mlaRecord, setMlaRecord] = useState(null);
  const [officer, setOfficer] = useState('');

  // Local storage persistence for grievances list
  const [grievances, setGrievances] = useState(() => {
    const saved = localStorage.getItem('tn_grievances');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing grievances from localStorage', e);
      }
    }
    // Default demo data
    return [
      {
        id: 'TN-GRV-88273641',
        fullName: 'Karthick Kumar',
        phone: '9876543210',
        email: 'karthick.kumar@gmail.com',
        district: 'Chennai',
        constituency: 'Dr. Radhakrishnan Nagar',
        issue: 'Frequent power outages in our locality during evening hours causing issues for students studying for exams.',
        officer: 'District Revenue Officer - Chennai',
        mla: 'Dr. John Joseph',
        status: 'under_review',
        date: '2026-05-18',
        attachments: [
          {
            type: 'image/jpeg',
            dataUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
          }
        ]
      },
      {
        id: 'TN-GRV-12048596',
        fullName: 'Arun Mozhi',
        phone: '9876543211',
        email: 'arun.mozhi@yahoo.com',
        district: 'Thiruvallur',
        constituency: 'Ponneri',
        issue: 'Potholes on the main road connecting Ponneri railway station. Needs immediate patch work before the monsoon season.',
        officer: 'District Revenue Officer - Thiruvallur',
        mla: 'Dr. Ravi M.S.',
        status: 'resolved',
        date: '2026-05-10',
        resolution: 'The patch work has been completed by the local municipal authorities on 2026-05-15.',
        attachments: [
          {
            type: 'application/pdf',
            dataUrl: 'data:application/pdf;base64,TW9jayBQREYgQ29udGVudA=='
          }
        ]
      }
    ];
  });

  useEffect(() => {
    try {
      // Strip raw File objects and heavy base64 dataUrls before saving to localStorage.
      // Files are now stored in Supabase Storage (url field), so we only need metadata.
      const lightweight = grievances.map(g => ({
        ...g,
        attachments: (g.attachments || []).map(({ file: _f, dataUrl: _d, ...rest }) => rest)
      }));
      localStorage.setItem('tn_grievances', JSON.stringify(lightweight));
    } catch (e) {
      // QuotaExceededError — clear stale data and try again with just IDs
      console.warn('localStorage quota exceeded, clearing tn_grievances cache.', e);
      try { localStorage.removeItem('tn_grievances'); } catch (_) {}
    }
  }, [grievances]);

  // Load existing grievances from Supabase on mount
  useEffect(() => {
    const fetchSupabaseGrievances = async () => {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('grievances')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase fetch error:', error.message);
          return;
        }

        if (data && data.length > 0) {
          setGrievances(prev => {
            // Merge database grievances with local ones, prioritizing database ones
            const merged = [...data];
            prev.forEach(p => {
              if (!merged.some(m => m.id === p.id)) {
                merged.push(p);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error('Failed to load grievances from Supabase:', err);
      }
    };
    fetchSupabaseGrievances();
  }, []);

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
    
    if (!form.phone.trim()) {
      e.phone = cn ? 'Phone number is required.' : 'தொலைபேசி எண் தேவை.';
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      e.phone = cn ? 'Please enter a valid 10-digit phone number.' : 'சரியான 10-இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.';
    }

    if (!form.email.trim()) {
      e.email = cn ? 'Email ID is required.' : 'மின்னஞ்சல் முகவரி தேவை.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = cn ? 'Please enter a valid email address.' : 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.';
    }

    if (!form.district)        e.district = cn ? 'Please select a district.' : 'மாவட்டம் தேர்ந்தெடுக்கவும்.';
    if (!form.constituency)    e.constituency = cn ? 'Please select a constituency.' : 'தொகுதி தேர்ந்தெடுக்கவும்.';
    if (!form.issue.trim())    e.issue = cn ? 'Please describe your issue.' : 'உங்கள் பிரச்சனையை விவரிக்கவும்.';
    else if (form.issue.trim().length < 30)
                               e.issue = cn ? 'Please provide at least 30 characters.' : 'குறைந்தது 30 எழுத்துக்கள் தேவை.';
    return e;
  };

  // Upload a single attachment to Supabase Storage and return a public URL.
  const uploadAttachment = async (attachment, refId, idx) => {
    if (!isSupabaseConfigured() || !attachment.file) return null;
    const ext = attachment.name?.split('.').pop() || 'bin';
    const path = `${refId}/${idx}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('grievance-attachments')
      .upload(path, attachment.file, { cacheControl: '3600', upsert: false });
    if (error) {
      console.error('Storage upload error:', error.message);
      return null;
    }
    const { data } = supabase.storage
      .from('grievance-attachments')
      .getPublicUrl(path);
    return data?.publicUrl || null;
  };

  const sendEmailTicket = async (grievance) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const isPlaceholder = (val) => !val || val.includes('your_') || val.includes('your-') || val.includes('placeholder');
    if (isPlaceholder(serviceId) || isPlaceholder(templateId) || isPlaceholder(publicKey)) {
      console.warn('EmailJS keys are missing or placeholders. Running in Simulated Mode.');
      setEmailStatus('simulated');
      return;
    }

    setEmailStatus('sending');
    try {
      const host = window.location.origin;
      const logoUrl = host.includes('localhost') || host.includes('127.0.0.1')
        ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Seal_of_Tamil_Nadu.svg/200px-Seal_of_Tamil_Nadu.svg.png'
        : `${host}${cn ? '/tn-logo-en.svg' : '/tn-logo.svg'}`;

      await emailjs.send(
        serviceId,
        templateId,
        {
          ref_id: grievance.id,
          full_name: grievance.fullName,
          phone: grievance.phone,
          email: grievance.email,
          district: grievance.district,
          constituency: grievance.constituency,
          issue: grievance.issue,
          mla: grievance.mla,
          officer: grievance.officer,
          date: grievance.date,
          to_email: grievance.email,
          logo_url: logoUrl,
        },
        publicKey
      );
      setEmailStatus('sent');
    } catch (error) {
      console.error('Failed to send email via EmailJS:', error);
      setEmailStatus('failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);

    const refId = `TN-GRV-${Date.now().toString().slice(-8)}`;

    // ── Upload attachments to Supabase Storage ─────────────────────────────
    let processedAttachments = form.attachments;
    if (isSupabaseConfigured() && form.attachments.length > 0) {
      processedAttachments = await Promise.all(
        form.attachments.map(async (att, idx) => {
          const publicUrl = await uploadAttachment(att, refId, idx);
          // Strip the raw File object and heavy base64 before storing in DB
          const { file: _f, dataUrl: _d, ...rest } = att;
          return publicUrl
            ? { ...rest, url: publicUrl }         // storage URL
            : { ...rest, dataUrl: att.dataUrl };   // fallback: keep base64
        })
      );
    }

    const newGrievance = {
      id: refId,
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      district: form.district,
      constituency: form.constituency,
      issue: form.issue,
      attachments: processedAttachments,
      officer: officer,
      mla: mlaRecord?.mla || '',
      status: 'submitted',
      date: new Date().toISOString().split('T')[0]
    };

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('grievances')
          .insert([newGrievance]);
        if (error) {
          console.error('Failed to submit to Supabase:', error.message);
        }
      } catch (err) {
        console.error('Error submitting to Supabase:', err);
      }
    }

    // For local state/success screen keep the dataUrl preview for images so
    // they render immediately without needing to re-fetch from storage.
    const localGrievance = {
      ...newGrievance,
      attachments: form.attachments.map((att, idx) => ({
        ...processedAttachments[idx],
        dataUrl: att.dataUrl   // keep local preview
      }))
    };

    setGrievances(prev => [localGrievance, ...prev]);
    setSubmittedGrievance(localGrievance);
    setIsSubmitting(false);
    setView('success');
    sendEmailTicket(newGrievance);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const remainingSlots = 5 - form.attachments.length;
    if (remainingSlots <= 0) {
      alert(cn ? 'You can only upload up to 5 files.' : 'நீங்கள் அதிகபட்சமாக 5 கோப்புகளை மட்டுமே பதிவேற்ற முடியும்.');
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      alert(cn ? `Only the first ${remainingSlots} files will be added.` : `முதல் ${remainingSlots} கோப்புகள் மட்டுமே சேர்க்கப்படும்.`);
    }

    filesToUpload.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(cn ? `File exceeds 5MB limit.` : `கோப்பு 5MB வரம்பை மீறுகிறது.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => {
          if (f.attachments.length >= 5) return f;
          return {
            ...f,
            attachments: [
              ...f.attachments,
              {
                file,                   // raw File object for Supabase upload
                name: file.name,
                type: file.type,
                dataUrl: reader.result  // local preview (base64)
              }
            ]
          };
        });
      };
      reader.readAsDataURL(file);
    });
  };



  const resetForm = () => {
    setForm({ fullName: '', phone: '', email: '', district: '', constituency: '', issue: '', attachments: [] });
    setMlaRecord(null);
    setOfficer('');
    setErrors({});
    setSearchId('');
    setSearchError('');
    setSubmittedGrievance(null);
    setEmailStatus('idle');
    setView('landing');
  };

  // ── 1. Landing View ────────────────────────────────────────────────────────
  if (view === 'landing') {
    return (
      <div className="pb-20">
        {/* Page Header */}
        <section className="pt-10 pb-6 container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}>
            {/* Back breadcrumb */}
            <button
              onClick={() => navigate('/services')}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#ea580c] uppercase tracking-wider mb-5 transition-colors group cursor-pointer"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
              {cn ? 'Back to Services' : 'சேவைகளுக்கு திரும்பு'}
            </button>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
              {cn ? 'Grievance Redressal Center' : 'பொது மக்கள் குறைதீர்ப்பு மையம்'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {cn
                ? 'Submit petitions directly to your constituency representative and track official reviews and actions.'
                : 'உங்கள் சட்டமன்றத் தொகுதி உறுப்பினருக்கு நேரடியாக மனுக்களைச் சமர்ப்பித்து, அவற்றின் தீர்வு நிலையை நிகழ்நேரத்தில் கண்காணிக்கவும்.'}
            </p>
          </motion.div>
        </section>

        {/* Dashboard Actions */}
        <section className="container mx-auto px-6 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Card 1: Track Status */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="bg-white dark:bg-[#16120f]/40 border border-gray-200 dark:border-white/10 rounded-[2px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#ea580c]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-[2px] bg-[#ea580c]/8 text-[#ea580c] flex items-center justify-center mb-6">
                  <Search size={22} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {cn ? 'Track Grievance Status' : 'மனுவின் நிலையை அறிய'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                  {cn
                    ? 'Enter your 11-character Reference ID (e.g. TN-GRV-XXXXXXXX) to view the current progress of your submitted petition.'
                    : 'உங்கள் சமர்ப்பிக்கப்பட்ட மனுவின் தற்போதைய நிலையை அறிய 11-இலக்க குறிப்பு எண்ணை (உதாரணம்: TN-GRV-XXXXXXXX) உள்ளிடவும்.'}
                </p>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (isSearching) return;
                    if (!searchId.trim()) {
                      setSearchError(cn ? 'Please enter a Reference ID.' : 'குறிப்பு எண்ணை உள்ளிடவும்.');
                      return;
                    }

                    const queryId = searchId.trim().toUpperCase();
                    setIsSearching(true);

                    let found = null;
                    if (isSupabaseConfigured()) {
                      try {
                        const { data, error } = await supabase
                          .from('grievances')
                          .select('*')
                          .eq('id', queryId)
                          .maybeSingle();

                        if (data) {
                          found = data;
                        } else if (error) {
                          console.error('Supabase query error:', error.message);
                        }
                      } catch (err) {
                        console.error('Supabase query exception:', err);
                      }
                    }

                    // Fallback to local state/LocalStorage if not found or DB is not configured
                    if (!found) {
                      found = grievances.find(g => g.id.trim().toUpperCase() === queryId);
                    }

                    setIsSearching(false);

                    if (found) {
                      setActiveGrievance(found);
                      setSearchError('');
                      setView('status');
                    } else {
                      setSearchError(cn ? 'Reference ID not found.' : 'குறிப்பு எண் கண்டறியப்படவில்லை.');
                    }
                  }}
                  className="space-y-3"
                >
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-[2px] border bg-white dark:bg-white/5 transition-all duration-200 ${searchError ? 'border-red-400 ring-2 ring-red-400/15' : 'border-gray-200 dark:border-white/10 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-[#ea580c]/15'}`}>
                    <FileText size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />
                    <input
                      type="text"
                      value={searchId}
                      onChange={e => { setSearchId(e.target.value); setSearchError(''); }}
                      placeholder={cn ? 'e.g. TN-GRV-88273641' : 'எ.கா. TN-GRV-88273641'}
                      className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 font-mono uppercase"
                    />
                  </div>
                  {searchError && (
                    <p className="flex items-center gap-1.5 text-xs text-red-500">
                      <AlertCircle size={12} /> {searchError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isSearching}
                    className={`w-full py-3 text-sm font-bold bg-[#ea580c] hover:bg-[#ea580c]/90 text-white rounded-[2px] transition-colors cursor-pointer shadow-md shadow-orange-500/10 flex items-center justify-center gap-2 ${isSearching ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSearching ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {cn ? 'Tracking...' : 'தேடுகிறது...'}
                      </>
                    ) : (
                      cn ? 'Track Petition' : 'மனுவைக் கண்காணி'
                    )}
                  </button>
                </form>
              </div>

              {/* Helper list of mock IDs */}
              <div className="mt-8 pt-4 border-t border-gray-150 dark:border-white/5">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2">
                  {cn ? 'Demo Reference IDs to Test:' : 'சோதனை செய்ய மாதிரி குறிப்பு எண்கள்:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {grievances.slice(0, 2).map((g) => (
                    <button
                      key={g.id}
                      onClick={() => { setSearchId(g.id); setSearchError(''); }}
                      className="px-2 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2px] font-mono text-xs text-gray-600 dark:text-gray-300 hover:border-[#ea580c]/40 hover:bg-[#ea580c]/5 hover:text-[#ea580c] transition-all cursor-pointer"
                    >
                      {g.id}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card 2: File New */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="bg-white dark:bg-[#16120f]/40 border border-gray-200 dark:border-white/10 rounded-[2px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#ea580c]/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-[2px] bg-[#ea580c]/8 text-[#ea580c] flex items-center justify-center mb-6">
                  <MessageSquare size={22} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {cn ? 'File a New Grievance' : 'புதிய புகார் சமர்ப்பிக்க'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                  {cn
                    ? 'Submit a new petition about local civic issues, utilities, roads, or education. Your complaint will be routed directly to your MLA and assigned officer.'
                    : 'உள்ளூர் குடிமைப் பிரச்சனைகள், சாலைகள் அல்லது கல்வி குறித்து புதிய மனுவை சமர்ப்பிக்கவும். உங்கள் புகார் நேரடியாக சட்டமன்ற உறுப்பினர் மற்றும் நியமிக்கப்பட்ட அதிகாரிக்கு அனுப்பப்படும்.'}
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-white/3 rounded-[2px] border border-gray-150 dark:border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                      <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                        {cn ? 'Automated MLA matching via constituency' : 'தொகுதியின் அடிப்படையில் MLA தானாகவே ஒதுக்கப்படுவார்'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                      <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                        {cn ? 'Direct routing to district level nodal officer' : 'மாவட்ட அளவிலான நோடல் அதிகாரிக்கு நேரடி வழியமைப்பு'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setView('form')}
                    className="w-full py-3 text-sm font-bold bg-[#ea580c] hover:bg-[#ea580c]/90 text-white rounded-[2px] transition-colors cursor-pointer shadow-md shadow-orange-500/10"
                  >
                    {cn ? 'Start New Complaint' : 'புதிய புகாரைத் தொடங்குக'}
                  </button>
                </div>
              </div>

              {/* Bottom footer note */}
              <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 italic select-none">
                {cn
                  ? 'All petitions are reviewed under the Citizen Charter rules.'
                  : 'அனைத்து மனுக்களும் குடிமக்கள் சாசன விதிகளின் கீழ் ஆய்வு செய்யப்படுகின்றன.'}
              </div>
            </motion.div>

          </div>
        </section>
      </div>
    );
  }

  // ── 2. Status Tracking Timeline View ────────────────────────────────────────
  if (view === 'status' && activeGrievance) {
    const steps = [
      {
        title: cn ? 'Grievance Submitted' : 'மனு சமர்ப்பிக்கப்பட்டது',
        desc: cn ? 'Your petition has been successfully registered.' : 'உங்கள் மனு வெற்றிகரமாகப் பதிவு செய்யப்பட்டுள்ளது.',
        date: activeGrievance.date,
        isCompleted: true
      },
      {
        title: cn ? 'Under Review' : 'ஆய்வில் உள்ளது',
        desc: cn ? 'Assigned officer is reviewing the description and details.' : 'ஒதுக்கப்பட்ட அதிகாரி மனுவின் விவரங்களை ஆய்வு செய்கிறார்.',
        isCompleted: activeGrievance.status === 'under_review' || activeGrievance.status === 'resolved',
        isActive: activeGrievance.status === 'under_review'
      },
      {
        title: cn ? 'Forwarded to MLA' : 'சட்டமன்ற உறுப்பினருக்கு அனுப்பப்பட்டது',
        desc: cn ? 'The petition has been shared with your constituency representative.' : 'மனு உங்கள் தொகுதி சட்டமன்ற உறுப்பினருக்கு அனுப்பப்பட்டுள்ளது.',
        isCompleted: activeGrievance.status === 'resolved',
        isActive: activeGrievance.status === 'under_review'
      },
      {
        title: cn ? 'Resolved' : 'தீர்க்கப்பட்டது',
        desc: activeGrievance.status === 'resolved' 
          ? (activeGrievance.resolution || (cn ? 'Resolution provided.' : 'மனுவிற்கு தீர்வு வழங்கப்பட்டுள்ளது.'))
          : (cn ? 'Waiting for final resolution.' : 'முடிவுக்காக காத்திருக்கிறது.'),
        isCompleted: activeGrievance.status === 'resolved',
        isActive: false
      }
    ];

    const getStatusBadge = (status) => {
      if (status === 'resolved') {
        return (
          <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-full">
            {cn ? 'Resolved' : 'தீர்க்கப்பட்டது'}
          </span>
        );
      }
      if (status === 'under_review') {
        return (
          <span className="px-3 py-1 text-xs font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-full">
            {cn ? 'Under Review' : 'ஆய்வில் உள்ளது'}
          </span>
        );
      }
      return (
        <span className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-full">
          {cn ? 'Submitted' : 'சமர்ப்பிக்கப்பட்டது'}
        </span>
      );
    };

    return (
      <>
        <div className="pb-20">
          {/* Page Header */}
          <section className="pt-10 pb-6 container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}>
              {/* Back link */}
              <button
                onClick={() => setView('landing')}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#ea580c] uppercase tracking-wider mb-5 transition-colors group cursor-pointer"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
                {cn ? 'Back to Grievance Center' : 'குறைதீர்ப்பு மையத்திற்குத் திரும்பு'}
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 font-mono mb-1">
                    {activeGrievance.id}
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {cn ? 'Submitted on' : 'சமர்ப்பிக்கப்பட்ட தேதி'}: {activeGrievance.date}
                  </p>
                </div>
                <div>
                  {getStatusBadge(activeGrievance.status)}
                </div>
              </div>
            </motion.div>
          </section>

          {/* Content columns */}
          <section className="container mx-auto px-6 pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 mx-auto">           

              {/* Details Column */}
              <div className="lg:col-span-7 bg-white dark:bg-[#16120f]/20 border border-gray-200 dark:border-white/15 p-8 rounded-[2px] shadow-sm divide-y divide-gray-150 dark:divide-white/5 h-fit">
                <h2 className="text-md font-bold text-gray-900 dark:text-gray-100 pb-4 mb-4">
                  {cn ? 'Petition Details' : 'மனுவின் விவரங்கள்'}
                </h2>

                <div className="py-4">
                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    {cn ? 'Petitioner Name' : 'மனுதாரர் பெயர்'}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{activeGrievance.fullName}</span>
                </div>

                <div className="py-4">
                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    {cn ? 'Contact Info' : 'தொடர்பு தகவல்'}
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200 block">
                    {activeGrievance.phone || '—'} • {activeGrievance.email || '—'}
                  </span>
                </div>

                <div className="py-4">
                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    {cn ? 'District & Constituency' : 'மாவட்டம் & தொகுதி'}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {activeGrievance.district} • {activeGrievance.constituency}
                  </span>
                </div>

                <div className="py-4">
                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    {cn ? 'Assigned MLA' : 'சட்டமன்ற உறுப்பினர்'}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{activeGrievance.mla || '—'}</span>
                </div>

                <div className="py-4">
                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                    {cn ? 'Nodal Officer' : 'நோடல் அதிகாரி'}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{activeGrievance.officer || '—'}</span>
                </div>

                <div className="py-4">
                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                    {cn ? 'Grievance Description' : 'புகாரின் விளக்கம்'}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-white/2 p-3 border border-gray-150 dark:border-white/5 rounded-[2px]">
                    {activeGrievance.issue}
                  </p>
                </div>

                {/* Legacy Single Attachment Support */}
                {activeGrievance.attachment && !activeGrievance.attachments && (
                  <div className="py-4">
                    <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-2">
                      {cn ? 'Attachment' : 'இணைப்பு'}
                    </span>
                    {activeGrievance.attachment.type?.startsWith('image/') ? (
                      <div 
                        onClick={() => setModalAttachment(activeGrievance.attachment)}
                        className="border border-gray-200 dark:border-white/10 rounded-[2px] overflow-hidden bg-gray-50 dark:bg-white/2 p-2.5 cursor-pointer hover:opacity-80 transition-all max-w-xs"
                        title={cn ? 'Click to view' : 'காண கிளிக் செய்க'}
                      >
                        <img 
                          src={activeGrievance.attachment.dataUrl} 
                          alt="Attachment" 
                          className="max-h-36 w-auto object-contain mx-auto rounded-[2px]"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-white/10 rounded-[2px] bg-gray-50 dark:bg-white/2 max-w-md">
                        <FileText size={18} className="text-gray-400 dark:text-gray-500 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                            {cn ? 'Supporting Document' : 'துணை ஆவணம்'}
                          </p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setModalAttachment(activeGrievance.attachment)}
                          className="text-xs font-bold text-[#ea580c] hover:underline mr-3 cursor-pointer"
                        >
                          {cn ? 'View' : 'காண்க'}
                        </button>
                        <a 
                          href={activeGrievance.attachment.dataUrl} 
                          download={`document${getExtension(activeGrievance.attachment.type)}`}
                          className="text-xs font-bold text-[#ea580c] hover:underline"
                        >
                          {cn ? 'Download' : 'பதிவிறக்கம்'}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Multiple Attachments Support */}
                {activeGrievance.attachments && activeGrievance.attachments.length > 0 && (
                  <div className="py-4">
                    <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-3">
                      {cn ? 'Attachments' : 'இணைப்புகள்'} ({activeGrievance.attachments.length})
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {activeGrievance.attachments.map((file, idx) => {
                        const isImg = file.type?.startsWith('image/');
                        const src = file.url ?? file.dataUrl;
                        return (
                          <div key={idx} className="border border-gray-200 dark:border-white/10 rounded-[2px] p-3 bg-gray-50/50 dark:bg-white/2 flex flex-col items-center justify-center min-h-[110px] relative">
                            {isImg ? (
                              <div 
                                onClick={() => setModalAttachment(file)}
                                className="w-14 h-14 rounded-[2px] border border-gray-250 dark:border-white/10 overflow-hidden bg-white dark:bg-black cursor-pointer hover:opacity-85 transition-opacity"
                                title={cn ? 'Click to view' : 'காண கிளிக் செய்க'}
                              >
                                <img
                                  src={src}
                                  alt={`Attachment ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <div 
                                  onClick={() => setModalAttachment(file)}
                                  className="w-10 h-10 rounded-[2px] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                  title={cn ? 'Click to view' : 'காண கிளிக் செய்க'}
                                >
                                  <FileText size={20} className="text-gray-400 dark:text-gray-500" />
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    type="button"
                                    onClick={() => setModalAttachment(file)}
                                    className="text-[10px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                                  >
                                    {cn ? 'View' : 'காண்க'}
                                  </button>
                                  <span className="text-[10px] text-gray-300 dark:text-gray-700 select-none">|</span>
                                  <a 
                                    href={src} 
                                    download={`document_${idx + 1}${getExtension(file.type)}`}
                                    className="text-[10px] font-bold text-[#ea580c] hover:underline"
                                  >
                                    {cn ? 'Download' : 'பதிவிறக்கம்'}
                                  </a>
                                </div>
                              </div>
                            )}
                            <div className="text-[10px] text-gray-400 mt-2 font-semibold select-none">
                              {isImg ? (cn ? `Image ${idx + 1}` : `படம் ${idx + 1}`) : (cn ? `Document ${idx + 1}` : `ஆவணம் ${idx + 1}`)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline Column */}
              <div className="lg:col-span-3 bg-white dark:bg-[#16120f]/20 border border-gray-200 dark:border-white/15 p-8 rounded-[2px] shadow-sm">
                <h2 className="text-md font-bold text-gray-900 dark:text-gray-100 mb-8 border-b border-gray-150 dark:border-white/5 pb-4">
                  {cn ? 'Petition Timeline' : 'மனுவின் காலக்கெடு வரைபடம்'}
                </h2>

                <div className="space-y-10 relative">
                  {steps.map((step, idx) => {
                    let circleBg = 'bg-gray-100 dark:bg-white/5 text-gray-400';
                    if (step.isCompleted) {
                      circleBg = 'bg-[#ea580c] text-white';
                    } else if (step.isActive) {
                      circleBg = 'bg-amber-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.35)]';
                    }

                    return (
                      <div key={idx} className="relative flex gap-6 items-start">
                        {/* Line connector to next circle */}
                        {idx < steps.length - 1 && (
                          <div
                            className={`absolute top-8 left-[15px] bottom-0 w-[2px] -translate-x-1/2 ${
                              step.isCompleted && steps[idx+1].isCompleted
                                ? 'bg-[#ea580c]/30'
                                : 'bg-gray-100 dark:bg-white/5'
                            }`}
                            style={{ height: 'calc(100% + 24px)' }}
                          />
                        )}

                        {/* Circle */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold text-xs ${circleBg}`}>
                          {step.isCompleted ? <Check size={14} /> : idx + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <h3 className={`text-sm font-bold ${step.isCompleted || step.isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'}`}>
                              {step.title}
                            </h3>
                          </div>
                          <p className={`text-xs mt-1 leading-relaxed ${step.isCompleted || step.isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-700'}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Resolution block */}
                {activeGrievance.status === 'resolved' && activeGrievance.resolution && (
                  <div className="mt-8 p-5 bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-200/50 dark:border-emerald-900/30 rounded-[2px]">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={16} className="text-emerald-700 dark:text-emerald-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                        {cn ? 'Official Resolution Summary' : 'அதிகாரப்பூர்வ தீர்வுச் சுருக்கம்'}
                      </h4>
                    </div>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed font-medium">
                      {activeGrievance.resolution}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </section>
        </div>

        <AnimatePresence>
          {modalAttachment && (
            <AttachmentModal
              attachment={modalAttachment}
              onClose={() => setModalAttachment(null)}
              cn={cn}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // ── 3. Success Screen ──────────────────────────────────────────────────────
  if (view === 'success' && submittedGrievance) {
    return (
      <>
        <div className="min-h-[80vh] flex flex-col items-center justify-start pt-28 pb-16 px-6">
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
                className="w-20 h-20 rounded-full bg-[#ea580c]/10 flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle size={42} className="text-[#ea580c]" />
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

            {/* Email dispatch status */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46 }}
              className="mb-6"
            >
              {emailStatus === 'sending' && (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-400 text-xs rounded-[2px] animate-pulse">
                  <Clock size={16} className="text-[#ea580c] animate-spin shrink-0" />
                  <span>
                    {cn 
                      ? `Sending email ticket to ${submittedGrievance.email}...` 
                      : `மின்னஞ்சல் முகவரிக்கு (${submittedGrievance.email}) உறுதிப்படுத்தல் சீட்டு அனுப்பப்படுகிறது...`}
                  </span>
                </div>
              )}

              {emailStatus === 'sent' && (
                <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-[2px]">
                  <Check size={16} className="text-emerald-500 shrink-0" />
                  <span>
                    {cn 
                      ? `Confirmation ticket sent to ${submittedGrievance.email}!` 
                      : `உறுதிப்படுத்தல் சீட்டு ${submittedGrievance.email} முகவரிக்கு அனுப்பப்பட்டது!`}
                  </span>
                </div>
              )}

              {emailStatus === 'failed' && (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-[2px]">
                  <AlertCircle size={16} className="text-red-500 shrink-0" />
                  <span>
                    {cn 
                      ? `Failed to send email to ${submittedGrievance.email}. Please save your Reference ID.` 
                      : `மின்னஞ்சல் அனுப்புவதில் தோல்வி (${submittedGrievance.email}). குறிப்பு எண்ணைச் சேமிக்கவும்.`}
                  </span>
                </div>
              )}

              {emailStatus === 'simulated' && (
                <div className="flex flex-col gap-1.5 px-4 py-3 bg-[#ea580c]/5 border border-[#ea580c]/20 text-[#ea580c] text-xs rounded-[2px]">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-[#ea580c] shrink-0" />
                    <span className="font-semibold">
                      {cn ? 'Ticket Email Simulated' : 'மின்னஞ்சல் சீட்டு உருவகப்படுத்தப்பட்டது'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                    {cn 
                      ? `A ticket email was simulated for ${submittedGrievance.email}. Configure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in .env.local for live delivery.` 
                      : `${submittedGrievance.email} முகவரிக்கான மின்னஞ்சல் சீட்டு வெற்றிகரமாகத் தற்காலிகமாகப் பதிவு செய்யப்பட்டது. நேரடி மின்னஞ்சல் விநியோகத்திற்கு .env.local-இல் VITE_EMAILJS_* மாறிகளை உள்ளமைக்கவும்.`}
                  </p>
                </div>
              )}
            </motion.div>

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
                <span className="text-sm font-mono font-bold text-[#ea580c]">{submittedGrievance.id}</span>
              </div>
              {/* Petitioner */}
              <div className="px-5 py-3.5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {cn ? 'Petitioner' : 'மனுதாரர்'}
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{submittedGrievance.fullName}</span>
              </div>
              {/* Phone Number */}
              <div className="px-5 py-3.5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {cn ? 'Phone Number' : 'தொலைபேசி எண்'}
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{submittedGrievance.phone || '—'}</span>
              </div>
              {/* Email ID */}
              <div className="px-5 py-3.5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {cn ? 'Email ID' : 'மின்னஞ்சல் முகவரி'}
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{submittedGrievance.email || '—'}</span>
              </div>
              {/* Constituency */}
              <div className="px-5 py-3.5 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {cn ? 'Constituency' : 'தொகுதி'}
                </span>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {submittedGrievance.constituency}
                </span>
              </div>
              {/* MLA */}
              {submittedGrievance.mla && (
                <div className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 shrink-0">
                    {cn ? 'Assigned MLA' : 'சட்டமன்ற உறுப்பினர்'}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{submittedGrievance.mla}</span>
                </div>
              )}
              {/* Officer */}
              <div className="px-5 py-3.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
                  {cn ? 'Assigned Officer' : 'ஒதுக்கப்பட்ட அதிகாரி'}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{submittedGrievance.officer}</span>
              </div>
              {/* Legacy Single Attachment Support */}
              {submittedGrievance.attachment && !submittedGrievance.attachments && (
                <div className="px-5 py-3.5 border-t border-gray-150 dark:border-white/5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                    {cn ? 'Attachment' : 'இணைப்பு'}
                  </span>
                  {submittedGrievance.attachment.type?.startsWith('image/') ? (
                    <div 
                      onClick={() => setModalAttachment(submittedGrievance.attachment)}
                      className="border border-gray-200 dark:border-white/10 rounded-[2px] overflow-hidden bg-gray-50 dark:bg-white/2 p-2.5 cursor-pointer hover:opacity-85 transition-all max-w-xs"
                      title={cn ? 'Click to view' : 'காண கிளிக் செய்க'}
                    >
                      <img 
                        src={submittedGrievance.attachment.dataUrl} 
                        alt="Attachment" 
                        className="max-h-36 w-auto object-contain mx-auto rounded-[2px]"
                      />
                      <div className="text-[10px] text-gray-450 dark:text-gray-400 text-center mt-1.5 font-semibold select-none">
                        {cn ? 'Image' : 'படம்'}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-white/10 rounded-[2px] bg-gray-50 dark:bg-white/2 max-w-md">
                      <FileText size={18} className="text-gray-400 dark:text-gray-500 shrink-0" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate flex-1 select-none">
                        {cn ? 'Document' : 'ஆவணம்'}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setModalAttachment(submittedGrievance.attachment)}
                        className="text-xs font-bold text-[#ea580c] hover:underline cursor-pointer"
                      >
                        {cn ? 'View' : 'காண்க'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Multiple Attachments Support */}
              {submittedGrievance.attachments && submittedGrievance.attachments.length > 0 && (
                <div className="px-5 py-4 border-t border-gray-150 dark:border-white/5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-3">
                    {cn ? 'Attachments' : 'இணைப்புகள்'} ({submittedGrievance.attachments.length})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {submittedGrievance.attachments.map((file, idx) => {
                      const isImg = file.type?.startsWith('image/');
                      const src = file.url ?? file.dataUrl;
                      return (
                        <div key={idx} className="border border-gray-200 dark:border-white/10 rounded-[2px] p-3 bg-gray-50/50 dark:bg-white/2 flex flex-col items-center justify-center min-h-[110px] relative">
                          {isImg ? (
                            <div 
                              onClick={() => setModalAttachment(file)}
                              className="w-14 h-14 rounded-[2px] border border-gray-250 dark:border-white/10 overflow-hidden bg-white dark:bg-black cursor-pointer hover:opacity-85 transition-opacity"
                              title={cn ? 'Click to view' : 'காண கிளிக் செய்க'}
                            >
                              <img
                                src={src}
                                alt={`Attachment ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <div 
                                onClick={() => setModalAttachment(file)}
                                className="w-10 h-10 rounded-[2px] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                title={cn ? 'Click to view' : 'காண கிளிக் செய்க'}
                              >
                                <FileText size={20} className="text-gray-400 dark:text-gray-500" />
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  type="button"
                                  onClick={() => setModalAttachment(file)}
                                  className="text-[10px] font-bold text-[#ea580c] hover:underline cursor-pointer"
                                >
                                  {cn ? 'View' : 'காண்க'}
                                </button>
                                <span className="text-[10px] text-gray-300 dark:text-gray-700 select-none">|</span>
                                <a 
                                  href={src} 
                                  download={`document_${idx + 1}${getExtension(file.type)}`}
                                  className="text-[10px] font-bold text-[#ea580c] hover:underline"
                                >
                                  {cn ? 'Download' : 'பதிவிறக்கம்'}
                                </a>
                              </div>
                            </div>
                          )}
                          <div className="text-[10px] text-gray-405 mt-2 font-semibold select-none">
                            {isImg ? (cn ? `Image ${idx + 1}` : `படம் ${idx + 1}`) : (cn ? `Document ${idx + 1}` : `ஆவணம் ${idx + 1}`)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex gap-3"
            >
              <button
                onClick={() => {
                  setActiveGrievance(submittedGrievance);
                  setView('status');
                }}
                className="flex-1 py-3 text-sm font-bold bg-[#ea580c] hover:bg-[#ea580c]/90 text-white rounded-[2px] transition-colors cursor-pointer"
              >
                {cn ? 'Track Live Status' : 'நேரடி கண்காணிப்பு'}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-[2px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                {cn ? 'Grievance Center' : 'குறைதீர்ப்பு மையம்'}
              </button>
            </motion.div>
          </motion.div>
        </div>

        <AnimatePresence>
          {modalAttachment && (
            <AttachmentModal
              attachment={modalAttachment}
              onClose={() => setModalAttachment(null)}
              cn={cn}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // ── 4. Form View ───────────────────────────────────────────────────────────
  return (
    <div className="pb-20">

      {/* Page Header */}
      <section className="pt-10 pb-6 container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.38 }}>

          {/* Breadcrumb */}
          <button
            onClick={() => setView('landing')}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#ea580c] uppercase tracking-wider mb-5 transition-colors group cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-150" />
            {cn ? 'Back to Grievance Center' : 'குறைதீர்ப்பு மையத்திற்குத் திரும்பு'}
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
            {cn ? 'Submit a Grievance' : 'புகார் சமர்ப்பிக்க'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {cn
              ? `Submit your petition to the ${ASSEMBLY_METADATA.electionYear} Tamil Nadu Legislative Assembly representative for your constituency.`
              : `உங்கள் தொகுதியின் ${ASSEMBLY_METADATA.electionYear} தமிழ்நாடு சட்டமன்ற உறுப்பினருக்கு மனு சமர்ப்பிக்கவும்.`}
          </p>
        </motion.div>
      </section>

      {/* Form Body */}
      <section className="container mx-auto px-6 pt-10">
        <div className="max-w-6xl mx-auto">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.1 }}
            noValidate
          >
            {/* 2-Column Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-7 bg-white dark:bg-[#16120f]/20 border border-gray-200 dark:border-white/10 p-6 rounded-[2px] shadow-sm flex flex-col gap-6">
                
                {/* ── Full Name ── */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    {cn ? 'Full Name' : 'முழு பெயர்'} <span className="text-red-400">*</span>
                  </label>
                  <div className={`
                    flex items-center gap-3 px-4 py-3 rounded-[2px] border bg-white dark:bg-white/5 transition-all duration-200
                    ${errors.fullName
                      ? 'border-red-400 ring-2 ring-red-400/15'
                      : 'border-gray-200 dark:border-white/10 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-[#ea580c]/15'
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

                {/* ── Phone Number & Email ID ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      {cn ? 'Phone Number' : 'தொலைபேசி எண்'} <span className="text-red-400">*</span>
                    </label>
                    <div className={`
                      flex items-center gap-3 px-4 py-3 rounded-[2px] border bg-white dark:bg-white/5 transition-all duration-200
                      ${errors.phone
                        ? 'border-red-400 ring-2 ring-red-400/15'
                        : 'border-gray-200 dark:border-white/10 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-[#ea580c]/15'
                      }
                    `}>
                      <Phone size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />
                      <input
                        id="phone"
                        type="tel"
                        maxLength="10"
                        value={form.phone}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          setForm(f => ({ ...f, phone: val }));
                        }}
                        placeholder={cn ? '10-digit number' : '10-இலக்க எண்'}
                        className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                      />
                    </div>
                    {errors.phone && (
                      <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                        <AlertCircle size={12} /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email ID */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      {cn ? 'Email ID' : 'மின்னஞ்சல் முகவரி'} <span className="text-red-400">*</span>
                    </label>
                    <div className={`
                      flex items-center gap-3 px-4 py-3 rounded-[2px] border bg-white dark:bg-white/5 transition-all duration-200
                      ${errors.email
                        ? 'border-red-400 ring-2 ring-red-400/15'
                        : 'border-gray-200 dark:border-white/10 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-[#ea580c]/15'
                      }
                    `}>
                      <Mail size={15} className="text-gray-400 dark:text-gray-500 shrink-0" />
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder={cn ? 'Enter email address' : 'மின்னஞ்சல் முகவரியை உள்ளிடுக'}
                        className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600"
                      />
                    </div>
                    {errors.email && (
                      <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500">
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>
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
                      <div className="flex flex-col gap-3 pb-1">
                        <InfoCard
                          label={cn ? 'Assigned MLA' : 'ஒதுக்கப்பட்ட சட்டமன்ற உறுப்பினர்'}
                          value={mlaRecord.mla}
                        />
                        <InfoCard
                          label={cn ? 'Assigned Officer' : 'ஒதுக்கப்பட்ட அதிகாரி'}
                          value={officer}
                        />
                      </div>
                      {/* AC Info strip */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/3 rounded-[2px] border border-gray-100 dark:border-white/5">
                        <span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-wider font-semibold">
                          {cn ? 'Assembly Constituency No.' : 'தொகுதி எண்.'}
                        </span>
                        <span className="text-[10px] font-black text-[#ea580c] font-mono">
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
                      : 'border-gray-200 dark:border-white/10 focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-[#ea580c]/15'
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
                      <span className={`text-[11px] font-medium transition-colors ${form.issue.length < 30 ? 'text-gray-400' : 'text-[#ea580c]'}`}>
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

              </div>

              {/* Right Column: Upload Documents */}
              <div className="lg:col-span-5 bg-white dark:bg-[#16120f]/20 border border-gray-200 dark:border-white/10 p-6 rounded-[2px] shadow-sm">
                
                {/* ── Supporting Document / Attachment ── */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                    {cn ? 'Supporting Documents' : 'துணை ஆவணங்கள்'} <span className="text-gray-400 font-normal">({cn ? 'Optional' : 'விருப்பத்திற்குரியது'})</span>
                  </label>
                  
                  <div className="space-y-4">
                    {/* File Upload Box (Only shown if less than 5 files) */}
                    {form.attachments.length < 5 && (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2px] p-6 hover:border-[#ea580c] hover:bg-gray-50/50 dark:hover:bg-white/2 cursor-pointer transition-all duration-200">
                        <div className="flex flex-col items-center text-center">
                          <Upload size={20} className="text-gray-400 dark:text-gray-500 mb-2" />
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            {cn ? `Upload Document / Image (${form.attachments.length}/5)` : `ஆவணம் அல்லது படம் பதிவேற்றுக (${form.attachments.length}/5)`}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                            {cn ? 'PDF, PNG, JPG, JPEG up to 5MB' : 'PDF, PNG, JPG, JPEG அதிகபட்சம் 5MB'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleFileChange}
                          className="hidden"
                          multiple
                        />
                      </label>
                    )}

                    {/* Attached Files List */}
                    {form.attachments.length > 0 && (
                      <div className="space-y-2.5">
                        {form.attachments.map((file, idx) => {
                          const isImg = file.type?.startsWith('image/');
                          const src = file.url ?? file.dataUrl;
                          return (
                            <div 
                              key={idx} 
                              className="border border-gray-200 dark:border-white/10 rounded-[2px] p-3 bg-gray-50/50 dark:bg-white/2 flex items-center justify-between gap-3 relative group"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                {isImg ? (
                                  <div 
                                    onClick={() => setModalAttachment(file)}
                                    className="w-12 h-12 rounded-[2px] border border-gray-200 dark:border-white/10 overflow-hidden shrink-0 bg-white dark:bg-black cursor-pointer hover:opacity-85 transition-opacity"
                                    title={cn ? 'Click to view' : 'காண கிளிக் செய்க'}
                                  >
                                    <img
                                      src={src}
                                      alt={`Attachment ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div 
                                    onClick={() => setModalAttachment(file)}
                                    className="w-12 h-12 rounded-[2px] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                    title={cn ? 'Click to view' : 'காண கிளிக் செய்க'}
                                  >
                                    <FileText size={20} className="text-gray-400 dark:text-gray-500" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200 select-none">
                                    {file.name || (isImg ? (cn ? `Image ${idx + 1}` : `படம் ${idx + 1}`) : (cn ? `Document ${idx + 1}` : `ஆவணம் ${idx + 1}`))}
                                  </p>
                                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5 select-none">
                                    <Check size={10} /> {isImg ? (cn ? 'Image loaded' : 'படம் ஏற்றப்பட்டது') : (cn ? 'Document loaded' : 'ஆவணம் ஏற்றப்பட்டது')}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setModalAttachment(file)}
                                  className="text-xs font-bold text-[#ea580c] hover:underline cursor-pointer px-2 py-1"
                                >
                                  {cn ? 'View' : 'காண்க'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setForm(f => ({
                                      ...f,
                                      attachments: f.attachments.filter((_, fileIdx) => fileIdx !== idx)
                                    }));
                                  }}
                                  className="p-1.5 rounded-full text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                                  title={cn ? 'Remove attachment' : 'இணைப்பை நீக்கு'}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* ── Divider ── */}
            <div className="w-full h-px bg-gray-150 dark:bg-white/10 mt-8 mb-6" />

            {/* ── Buttons ── */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setView('landing')}
                className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-[2px] hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 transition-all duration-200 cursor-pointer"
              >
                {cn ? 'Go Back' : 'திரும்பு'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold bg-[#ea580c] text-white rounded-[2px] hover:bg-[#ea580c]/90 shadow-lg shadow-orange-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {cn ? 'Submitting...' : 'சமர்ப்பிக்கிறது...'}
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    {cn ? 'Submit Grievance' : 'புகாரை சமர்ப்பி'}
                  </>
                )}
              </button>
            </div>

          </motion.form>
        </div>
      </section>

      <AnimatePresence>
        {modalAttachment && (
          <AttachmentModal
            attachment={modalAttachment}
            onClose={() => setModalAttachment(null)}
            cn={cn}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

// ── Attachment Preview Modal ────────────────────────────────────────────────
function AttachmentModal({ attachment, onClose, cn }) {
  // Listen for Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isImage = attachment.type?.startsWith('image/');

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative z-10 w-full max-w-3xl bg-white dark:bg-[#0f170f] border border-gray-200 dark:border-white/15 rounded-[4px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-white/5 bg-gray-50 dark:bg-white/2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate select-none">
              {isImage ? (cn ? 'Image Preview' : 'படத்தின் முன்னோட்டம்') : (cn ? 'Document Preview' : 'ஆவணத்தின் முன்னோட்டம்')}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5 select-none">
              {attachment.type || 'Unknown Type'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center min-h-[300px] bg-gray-50/50 dark:bg-black/10">
          {isImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={attachment.url ?? attachment.dataUrl}
                alt="Attachment Preview"
                className="max-h-[60vh] max-w-full object-contain rounded-[2px] shadow-md border border-gray-200 dark:border-white/10"
              />
            </div>
          ) : (
            <div className="w-full max-w-md bg-white dark:bg-[#152315]/50 border border-gray-200 dark:border-white/10 p-8 rounded-[4px] text-center shadow-lg">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 flex items-center justify-center mx-auto mb-5 border border-gray-150 dark:border-white/5">
                <FileText size={32} />
              </div>
              <h4 className="text-md font-bold text-gray-900 dark:text-gray-100 mb-2 truncate select-none">
                {attachment.name || (cn ? 'Supporting Document' : 'துணை ஆவணம்')}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 select-none">
                {cn 
                  ? 'Supporting Document (PDF or other binary file)' 
                  : 'துணை ஆவணம் (PDF அல்லது வேறு கோப்பு)'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={attachment.url ?? attachment.dataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-[2px] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-center"
                >
                  {cn ? 'Open in New Tab' : 'புதிய தாவலில் திறக்கவும்'}
                </a>
                <a
                  href={attachment.url ?? attachment.dataUrl}
                  download={attachment.name || (isImage ? `image${getExtension(attachment.type)}` : `document${getExtension(attachment.type)}`)}
                  className="px-5 py-2.5 text-xs font-bold bg-[#ea580c] text-white rounded-[2px] hover:bg-[#ea580c]/90 transition-colors text-center shadow-md shadow-orange-500/10"
                >
                  {cn ? 'Download File' : 'கோப்பை பதிவிறக்கு'}
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default GrievancePage;
