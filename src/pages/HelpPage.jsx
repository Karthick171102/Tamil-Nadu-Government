import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Paperclip, X, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

/* ── Knowledge Base ──────────────────────────────────────── */
const kb = [
  {
    keys: ['community certificate','community','சமூகச் சான்றிதழ்','சமூக','caste','jati'],
    en: 'Community Certificate can be applied online via the e-Sevai portal or at your nearest taluk office. Documents needed: Aadhaar, ration card, school certificate. Processing takes 7-15 working days.',
    ta: 'சமூகச் சான்றிதழை e-Sevai போர்ட்டல் அல்லது அருகிலுள்ள தாலுகா அலுவலகத்தில் ஆன்லைனில் விண்ணப்பிக்கலாம். தேவையான ஆவணங்கள்: ஆதார், ரேஷன் கார்டு, பள்ளிச் சான்றிதழ். 7-15 வேலை நாட்கள் ஆகும்.',
  },
  {
    keys: ['income certificate','income','வருமானச் சான்றிதழ்','வருமான','salary'],
    en: 'Income Certificate is issued by the Revenue Department. Apply at e-Sevai centres or online at tnedistrict.tn.gov.in. Requires salary slip or self-declaration affidavit.',
    ta: 'வருமானச் சான்றிதழ் வருவாய்த் துறையால் வழங்கப்படுகிறது. e-Sevai மையங்களில் அல்லது tnedistrict.tn.gov.in இல் விண்ணப்பிக்கவும். சம்பள சீட்டு அல்லது சுய அறிவிப்பு தேவை.',
  },
  {
    keys: ['birth certificate','birth','பிறப்புச் சான்றிதழ்','பிறப்பு'],
    en: 'Birth Certificate: Apply within 21 days of birth at the local municipal/panchayat office for free. Late registration requires additional documentation. Online: crsorgi.gov.in.',
    ta: 'பிறப்புச் சான்றிதழ்: பிறந்த 21 நாட்களுக்குள் உள்ளூர் நகராட்சி/பஞ்சாயத்து அலுவலகத்தில் இலவசமாக விண்ணப்பிக்கவும். தாமதப் பதிவிற்கு கூடுதல் ஆவணங்கள் தேவை.',
  },
  {
    keys: ['patta','chitta','patta chitta','land','நிலம்','பட்டா','சிட்டா'],
    en: 'Patta Chitta: View and download your land ownership records online at eservices.tn.gov.in/eservicesnew/land/chitta.html. For corrections, visit the Village Administrative Officer (VAO).',
    ta: 'பட்டா சிட்டா: உங்கள் நில உரிமை ஆவணங்களை eservices.tn.gov.in இல் பதிவிறக்கம் செய்யலாம். திருத்தங்களுக்கு கிராம நிர்வாக அலுவலரை (VAO) அணுகவும்.',
  },
  {
    keys: ['ration','ration card','ரேஷன்','ரேஷன் கார்டு','smart card'],
    en: 'Ration Card (Smart Card): Apply at tnpds.gov.in or visit your nearest taluk supply office. Needed: Aadhaar, family photo, address proof. New cards are issued digitally.',
    ta: 'ரேஷன் கார்டு (ஸ்மார்ட் கார்டு): tnpds.gov.in இல் அல்லது அருகிலுள்ள தாலுகா வழங்கல் அலுவலகத்தில் விண்ணப்பிக்கவும். ஆதார், குடும்ப புகைப்படம், முகவரி ஆதாரம் தேவை.',
  },
  {
    keys: ['scheme','schemes','welfare','நலத்திட்டம்','திட்டம்','திட்டங்கள்'],
    en: 'Tamil Nadu offers 100+ welfare schemes including: Kalaignar Magalir Urimai Thogai (₹1000/month for women), free bus pass for students, Amma Unavagam, CM Health Insurance, and housing schemes. Visit /schemes for full details.',
    ta: 'தமிழ்நாடு 100+ நலத்திட்டங்களை வழங்குகிறது: கலைஞர் மகளிர் உரிமைத் தொகை (₹1000/மாதம்), மாணவர் இலவச பேருந்து பாஸ், அம்மா உணவகம், CM உடல்நலக் காப்பீடு மற்றும் வீட்டுத் திட்டங்கள். முழு விவரங்களுக்கு /schemes பக்கத்தைப் பார்க்கவும்.',
  },
  {
    keys: ['department','departments','துறை','துறைகள்'],
    en: 'Tamil Nadu has 60+ government departments including Revenue, Health, Education, Agriculture, Police, PWD, Social Welfare, IT, and more. Visit /departments for the full directory with contact details.',
    ta: 'தமிழ்நாட்டில் வருவாய், சுகாதாரம், கல்வி, வேளாண்மை, காவல், PWD, சமூக நலன், IT உள்ளிட்ட 60+ அரசுத் துறைகள் உள்ளன. முழு அடைவுக்கு /departments பக்கத்தைப் பார்க்கவும்.',
  },
  {
    keys: ['service','services','online','சேவை','சேவைகள்','ஆன்லைன்'],
    en: 'Government services available online include: certificate applications, land records, utility bill payments, vehicle registration, RTI filing, and grievance submission. Visit /services to browse all.',
    ta: 'ஆன்லைனில் கிடைக்கும் அரசுச் சேவைகள்: சான்றிதழ் விண்ணப்பங்கள், நில ஆவணங்கள், பில் செலுத்தல், வாகனப் பதிவு, RTI, புகார் அளித்தல். அனைத்தையும் பார்க்க /services பக்கத்திற்குச் செல்லவும்.',
  },
  {
    keys: ['grievance','complaint','புகார்','குறை'],
    en: 'File a grievance at pgportal.gov.in (national) or cmdashboard.tn.gov.in (state). You can also call the CM Helpline at 1100. Grievances are tracked with a unique ID.',
    ta: 'pgportal.gov.in (தேசிய) அல்லது cmdashboard.tn.gov.in (மாநிலம்) இல் புகார் அளிக்கலாம். CM Helpline 1100 என்ற எண்ணிலும் அழைக்கலாம். ஒவ்வொரு புகாருக்கும் தனி ID வழங்கப்படும்.',
  },
  {
    keys: ['contact','phone','number','எண்','தொடர்பு','helpline'],
    en: 'Key helplines: CM Helpline — 1100, Police — 100, Ambulance — 108, Fire — 101, Women Helpline — 181, Child Helpline — 1098, Disaster — 1070. Secretariat: +91-44-2567 1878.',
    ta: 'முக்கிய உதவி எண்கள்: CM Helpline — 1100, காவல் — 100, ஆம்புலன்ஸ் — 108, தீயணைப்பு — 101, பெண்கள் — 181, குழந்தை — 1098, பேரிடர் — 1070. செயலகம்: +91-44-2567 1878.',
  },
  {
    keys: ['hello','hi','hey','vanakkam','வணக்கம்','நல்ல','help','உதவி'],
    en: 'Hello! I\'m the TN Gov Assistant. I can help you with information about government services, schemes, certificates, departments, and helpline numbers. What would you like to know?',
    ta: 'வணக்கம்! நான் TN Gov உதவியாளர். அரசுச் சேவைகள், நலத்திட்டங்கள், சான்றிதழ்கள், துறைகள் மற்றும் உதவி எண்கள் பற்றிய தகவல்களுக்கு உதவ முடியும். எதைப் பற்றி தெரிந்துகொள்ள விரும்புகிறீர்கள்?',
  },
];

const defaultReply = {
  en: 'I\'m not sure about that. Try asking about: certificates, schemes, departments, services, helpline numbers, education, health, or agriculture.',
  ta: 'இது பற்றி எனக்கு சரியாகத் தெரியவில்லை. சான்றிதழ்கள், திட்டங்கள், துறைகள், சேவைகள், உதவி எண்கள் பற்றி கேளுங்கள்.',
};

function findAnswer(query) {
  const q = query.toLowerCase().trim();
  let best = null;
  let bestScore = 0;
  for (const entry of kb) {
    let score = 0;
    for (const k of entry.keys) {
      if (q.includes(k.toLowerCase())) score += k.length;
    }
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  return best;
}

const quickActions = {
  en: [
    { label: 'Certificates', query: 'What certificates can I apply for?' },
    { label: 'Schemes', query: 'Tell me about welfare schemes' },
    { label: 'Departments', query: 'List government departments' },
    { label: 'Helplines', query: 'What are the helpline numbers?' },
    { label: 'Education', query: 'Education schemes for students' },
    { label: 'Health', query: 'Health insurance and hospitals' },
  ],
  ta: [
    { label: 'சான்றிதழ்கள்', query: 'சான்றிதழ்கள் எவை?' },
    { label: 'திட்டங்கள்', query: 'நலத்திட்டங்கள் பற்றி சொல்லுங்கள்' },
    { label: 'துறைகள்', query: 'அரசுத் துறைகள்' },
    { label: 'உதவி எண்', query: 'உதவி எண்கள் என்ன?' },
    { label: 'கல்வி', query: 'மாணவர்களுக்கான கல்வி திட்டங்கள்' },
    { label: 'சுகாதாரம்', query: 'சுகாதார காப்பீடு மற்றும் மருத்துவமனைகள்' },
  ],
};

const HelpPage = () => {
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = (text) => {
    const q = (text || input).trim();
    if (!q && !attachment) return;

    const newMessage = { role: 'user', text: q };
    if (attachment) {
      newMessage.attachment = attachment.name;
    }

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTyping(true);

    setTimeout(() => {
      const match = findAnswer(q);
      const reply = match
        ? (language === 'ta' ? match.ta : match.en)
        : (language === 'ta' ? defaultReply.ta : defaultReply.en);
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
      setTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      handleSend(); 
    }
  };

  const actions = quickActions[language] || quickActions.en;

  return (
    <div className="flex flex-col w-full fixed left-0 right-0 bottom-0 z-40" style={{ top: '116px', backgroundColor: 'var(--bg-color)' }}>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col gap-6" style={{ scrollbarWidth: 'none' }}>
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-8 pb-10">
          
          {/* Empty State / Hero */}
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center mt-12 md:mt-24 mb-10 w-full"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-sm overflow-hidden border"
                style={{ backgroundColor: '#ffffff', borderColor: 'var(--border-color)' }}>
                <img src="/favicon.svg" alt="TN Logo" className="w-12 h-12 object-contain" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] text-xs font-semibold mb-5 border"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', color: 'var(--accent-primary)', borderColor: 'var(--border-color)' }}>
                <Sparkles size={12} />
                <span>{language === 'ta' ? 'AI உதவியாளர்' : 'AI Assistant'}</span>
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
                {language === 'ta' ? 'உங்களுக்கு எப்படி உதவ முடியும்?' : 'How can we help you?'}
              </h1>
              
              <p className="text-[15px] mb-10" style={{ color: 'var(--text-secondary)' }}>
                {language === 'ta'
                  ? 'சேவைகள், திட்டங்கள், சான்றிதழ்கள் பற்றி கேளுங்கள்'
                  : 'Ask me about services, schemes, or certificates'}
              </p>

              {/* Clickable Badges */}
              <div className="flex flex-wrap justify-center gap-3 w-full max-w-2xl">
                {actions.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(a.query)}
                    className="text-[13px] font-medium px-5 py-3 rounded-[2px] border transition-all duration-200 cursor-pointer hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                    style={{
                      backgroundColor: isDark ? 'var(--card-bg)' : '#ffffff',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat Messages */}
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'bot' ? (
                  // Bot Message: Icon on left, text on right (Minimalist)
                  <div className="flex items-start gap-4 max-w-[85%] md:max-w-[75%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border overflow-hidden" style={{ backgroundColor: '#ffffff', borderColor: 'var(--border-color)' }}>
                      <img src="/favicon.svg" alt="TN Logo" className="w-5 h-5 object-contain" />
                    </div>
                    <div className="pt-1 text-[15px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  // User Message: Subtle background block
                  <div className="flex items-start gap-3 max-w-[85%] md:max-w-[70%]">
                    <div
                      className="px-5 py-3 rounded-[2px] text-[15px] leading-relaxed border flex flex-col"
                      style={{ 
                        backgroundColor: isDark ? 'var(--card-bg)' : '#ffffff',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)' 
                      }}
                    >
                      {msg.attachment && (
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-[2px] ${msg.text ? 'mb-2' : ''}`} style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
                          <FileText size={16} />
                          <span className="text-sm font-medium truncate max-w-[150px]">{msg.attachment}</span>
                        </div>
                      )}
                      {msg.text && <span>{msg.text}</span>}
                    </div>
                    <div className="w-8 h-8 rounded-[2px] flex items-center justify-center shrink-0 border" style={{ backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                      <User size={18} />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
              <div className="flex items-start gap-4 max-w-[85%] md:max-w-[75%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border overflow-hidden" style={{ backgroundColor: '#ffffff', borderColor: 'var(--border-color)' }}>
                  <img src="/favicon.svg" alt="TN Logo" className="w-5 h-5 object-contain" />
                </div>
                <div className="pt-2.5 flex gap-1.5 items-center h-[24px]">
                  {[0, 1, 2].map(d => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent-primary)', animationDelay: `${d * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Modern Floating Input Area */}
      <div className="w-full pb-6 px-4 shrink-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)] to-transparent pt-6">
        <div className="max-w-3xl mx-auto w-full">
          <div
            className="flex flex-col rounded-[2px] p-1.5 border shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            style={{ backgroundColor: isDark ? 'var(--card-bg)' : '#ffffff', borderColor: 'var(--border-color)' }}
          >
            {attachment && (
              <div className="flex items-center gap-2 mx-2 mt-2 px-3 py-2 rounded-[2px] w-fit border" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: 'var(--border-color)' }}>
                <FileText size={16} style={{ color: 'var(--accent-primary)' }} />
                <span className="text-[13px] font-medium max-w-[200px] truncate" style={{ color: 'var(--text-primary)' }}>{attachment.name}</span>
                <button onClick={handleRemoveAttachment} className="ml-2 hover:text-red-500 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                  <X size={16} />
                </button>
              </div>
            )}
            
            <div className="flex items-end w-full">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="w-10 h-10 mb-1 ml-1 rounded-[2px] flex items-center justify-center shrink-0 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <Paperclip size={20} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'ta' ? 'தமிழ்நாடு அரசு AI இடம் கேளுங்கள்...' : 'Ask the Tamil Nadu Govt AI...'}
                className="flex-1 bg-transparent border-none outline-none text-[15px] resize-none max-h-[150px] py-3 px-3"
                style={{ color: 'var(--text-primary)', scrollbarWidth: 'none' }}
                rows={1}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
                }}
              />

            
            <button
              onClick={() => { if (input.trim() || attachment) handleSend(); }}
              className="w-10 h-10 mb-1 mr-1 rounded-[2px] flex items-center justify-center shrink-0 transition-transform active:scale-95 border"
              style={{ 
                backgroundColor: (input.trim() || attachment) ? 'var(--accent-primary)' : (isDark ? '#2a2a2a' : '#f5f5f5'), 
                color: (input.trim() || attachment) ? '#fff' : 'var(--text-tertiary)',
                borderColor: (input.trim() || attachment) ? 'var(--accent-primary)' : 'var(--border-color)'
              }}
            >
              <Send size={18} className={(input.trim() || attachment) ? "ml-0.5" : ""} />
            </button>
            </div>
          </div>
          <div className="text-center mt-1">
            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
              {language === 'ta' 
                ? 'AI உருவாக்கும் தகவல்கள் துல்லியமாக இருக்காமல் போகலாம். முக்கிய தகவல்களுக்கு அதிகாரப்பூர்வ தளங்களை அணுகவும்.' 
                : 'AI-generated information may be inaccurate. Please verify critical information via official channels.'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HelpPage;
