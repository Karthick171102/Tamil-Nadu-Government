import fs from 'fs';
import path from 'path';

// Define descriptions for departments
const deptDesc = {
  commercialTaxes: {
    en: "Tax administration, registration of businesses, and revenue audits.",
    ta: "வரி நிர்வாகம், வணிகப் பதிவுகள் மற்றும் வருவாய் தணிக்கைகள்."
  },
  energy: {
    en: "Power generation, renewable energy initiatives, and grid administration.",
    ta: "மின் உற்பத்தி, புதுப்பிக்கத்தக்க எரிசக்தி முயற்சிகள் மற்றும் கட்டமைப்பு நிர்வாகம்."
  },
  environment: {
    en: "Forest protection, biodiversity management, and climate change action.",
    ta: "வனப் பாதுகாப்பு, பல்லுயிர் மேலாண்மை மற்றும் காலநிலை மாற்ற நடவடிக்கை."
  },
  finance: {
    en: "State budget preparation, treasury management, and public audits.",
    ta: "மாநில வரவு-செயலவு தயாரிப்பு, கருவூல மேலாண்மை மற்றும் பொது தணிக்கை."
  },
  higherEducation: {
    en: "Universities coordination, collegiate education, and tech training.",
    ta: "பல்கலைக்கழகங்களின் ஒருங்கிணைப்பு, கல்லூரி கல்வி மற்றும் தொழில்நுட்ப பயிற்சி."
  },
  home: {
    en: "Law and order maintenance, police administration, and excise controls.",
    ta: "சட்டம்-ஒழுங்கு பராமரிப்பு, காவல்துறை நிர்வாகம் மற்றும் கலால் கட்டுப்பாடுகள்."
  },
  housing: {
    en: "Urban planning, housing development, and land zoning approvals.",
    ta: "நகர திட்டமிடல், வீட்டுவசதி மேம்பாடு மற்றும் நில மண்டல அனுமதிகள்."
  },
  industries: {
    en: "Industrial investment promotion, commerce, and MSME growth support.",
    ta: "தொழில்துறை முதலீட்டு ஊக்குவிப்பு, வர்த்தகம் மற்றும் குறு, சிறு, நடுத்தர நிறுவனங்கள் வளர்ச்சி."
  },
  it: {
    en: "E-governance implementation, state software systems, and tech infrastructure.",
    ta: "மின்-ஆளுமை செயல்படுத்தல், மாநில மென்பொருள் அமைப்புகள் மற்றும் தொழில்நுட்ப உள்கட்டமைப்பு."
  },
  labour: {
    en: "Worker safety, employment registration, and skill training programs.",
    ta: "தொழிலாளர் பாதுகாப்பு, வேலைவாய்ப்புப் பதிவு மற்றும் திறன் பயிற்சித் திட்டங்கள்."
  },
  law: {
    en: "Drafting state legislations, legal counsel, and judicial advice.",
    ta: "மாநில சட்ட வரைவுகள், சட்ட ஆலோசனை மற்றும் நீதித்துறை வழிகாட்டுதல்கள்."
  },
  revenue: {
    en: "Land records administration, disaster relief coordination, and certificates.",
    ta: "நில ஆவணங்கள் நிர்வாகம், பேரிடர் நிவாரண ஒருங்கிணைப்பு மற்றும் சான்றிதழ் சேவைகள்."
  },
  schoolEducation: {
    en: "Primary and secondary school administration, curriculum, and student welfare.",
    ta: "தொடக்க மற்றும் இடைநிலைப் பள்ளி நிர்வாகம், பாடத்திட்டம் மற்றும் மாணவர் நலன்."
  },
  socialWelfare: {
    en: "Women empowerment programs, child development, and pension schemes.",
    ta: "பெண்கள் அதிகாரமளிப்புத் திட்டங்கள், குழந்தைகள் வளர்ச்சி மற்றும் ஓய்வூதியத் திட்டங்கள்."
  },
  tourism: {
    en: "Heritage site maintenance, cultural promotion, and religious endowments.",
    ta: "பாரம்பரிய தளங்கள் பராமரிப்பு, கலாச்சார ஊக்குவிப்பு மற்றும் அறநிலைய நிர்வாகம்."
  },
  transport: {
    en: "RTO vehicle registration, driving licensing, and road safety regulation.",
    ta: "RTO வாகனப் பதிவு, ஓட்டுநர் உரிமம் மற்றும் சாலைப் பாதுகாப்பு ஒழுங்குமுறை."
  }
};

// Define descriptions for categories
const catDesc = {
  g2b: {
    en: "Services for businesses, registrations, licensing, and trade operations.",
    ta: "வணிகங்களுக்கான சேவைகள், பதிவுகள், உரிமங்கள் மற்றும் வர்த்தக நடவடிக்கைகள்."
  },
  g2c: {
    en: "Public utility services, certificates, and welfare applications for citizens.",
    ta: "பொது மக்களுக்கான பயன்பாட்டுச் சேவைகள், சான்றிதழ்கள் மற்றும் நலத்திட்ட விண்ணப்பங்கள்."
  },
  g2e: {
    en: "Internal services, pay slips, and career updates for government employees.",
    ta: "அரசு ஊழியர்களுக்கான உள் சேவைகள், ஊதியச் சீட்டுகள் மற்றும் பணி மேம்பாடுகள்."
  },
  recruitment: {
    en: "Public service exam notifications, results, and career opportunities.",
    ta: "அரசுத் தேர்வு அறிவிப்புகள், தேர்வு முடிவுகள் மற்றும் வேலைவாய்ப்புகள்."
  },
  transaction: {
    en: "Secure digital payments for taxes, electricity bills, and utility fees.",
    ta: "வரிகள், மின்சாரக் கட்டணம் மற்றும் பயன்பாட்டுக் கட்டணங்களுக்கான பாதுகாப்பான டிஜிட்டல் கொடுப்பனவுகள்."
  }
};

// Function to map a service key and title to a high-quality description
function getServiceDescription(key, title) {
  const t = title.toLowerCase();
  
  if (t.includes('cause list') || t.includes('drt') || t.includes('court') || t.includes('ipab')) {
    return {
      en: "View daily judicial cause lists, schedules, and appellate tribunal registers.",
      ta: "தினசரி நீதித்துறை வழக்கு பட்டியல்கள், அட்டவணைகள் மற்றும் மேல்முறையீட்டு தீர்ப்பாய பதிவேடுகளைப் பார்க்கவும்."
    };
  }
  if (t.includes('guideline') || t.includes('land') || t.includes('patta') || t.includes('poramboke') || t.includes('ror') || t.includes('register extract')) {
    return {
      en: "Verify land records, check guidelines values, ownership registries, and classification charts.",
      ta: "நில ஆவணங்களை சரிபார்க்கவும், வழிகாட்டி மதிப்புகள், உரிமை பதிவேடுகள் மற்றும் வகைப்பாடு வரைபடங்களை சரிபார்க்கவும்."
    };
  }
  if (t.includes('bill') || t.includes('electricity') || t.includes('tangedco')) {
    return {
      en: "Online payment gateway for electricity bills and service connection utilities.",
      ta: "மின்சாரக் கட்டணங்கள் மற்றும் சேவை இணைப்புப் பயன்பாடுகளுக்கான ஆன்லைன் கட்டண நுழைவாயில்."
    };
  }
  if (t.includes('gst') || t.includes('tax') || t.includes('vat') || t.includes('remittance') || t.includes('ewaybill')) {
    return {
      en: "Commercial tax portals, registration utilities, return filing systems, and refunds.",
      ta: "வணிக வரி இணையதளங்கள், பதிவு பயன்பாடுகள், வரி தாக்கல் முறைகள் மற்றும் பணம் திரும்பப்பெறுதல்."
    };
  }
  if (t.includes('scholarship') || t.includes('college') || t.includes('polytechnic') || t.includes('scert') || t.includes('textbooks') || t.includes('diploma') || t.includes('exam')) {
    return {
      en: "Education administration, textbooks download, online exams, and student welfare registrations.",
      ta: "கல்வி நிர்வாகம், பாடப்புத்தகங்கள் பதிவிறக்கம், ஆன்லைன் தேர்வுகள் மற்றும் மாணவர் நலப் பதிவுகள்."
    };
  }
  if (t.includes('rto') || t.includes('driving') || t.includes('license') || t.includes('vehicle') || t.includes('transit') || t.includes('bus')) {
    return {
      en: "Access transport division, driving license applications, vehicle registration, and transit routes.",
      ta: "போக்குவரத்துத் துறை, ஓட்டுநர் உரிம விண்ணப்பங்கள், வாகனப் பதிவு மற்றும் போக்குவரத்து வழித்தடங்களை அணுகவும்."
    };
  }
  if (t.includes('tender') || t.includes('bid') || t.includes('procurement') || t.includes('sidco') || t.includes('entrepreneur')) {
    return {
      en: "Access state public procurement bulletins, online bidding systems, and industrial incentives.",
      ta: "மாநில பொது கொள்முதல் புல்லட்டின்கள், ஆன்லைன் ஏல முறைகள் மற்றும் தொழில்துறை ஊக்கத்தொகைகளை அணுகவும்."
    };
  }
  if (t.includes('missing') || t.includes('bodies') || t.includes('fir') || t.includes('unidentified') || t.includes('police')) {
    return {
      en: "Public safety tools, FIR copy requests, missing persons search, and identification assistance.",
      ta: "பொது பாதுகாப்பு கருவிகள், FIR நகல் கோரிக்கைகள், காணாமல் போனோர் தேடல் மற்றும் அடையாளம் காணும் உதவி."
    };
  }
  if (t.includes('grievance') || t.includes('complaint')) {
    return {
      en: "Submit public cell petitions directly, register complaints, and track resolution status.",
      ta: "பொது மனுக்களை நேரடியாக சமர்ப்பிக்கவும், புகார்களைப் பதிவு செய்யவும் மற்றும் தீர்வு நிலையைக் கண்காணிக்கவும்."
    };
  }
  if (t.includes('employment') || t.includes('seniority') || t.includes('job') || t.includes('tnpsc') || t.includes('trb')) {
    return {
      en: "Register for employment exchange portals, track vacancy statuses, and apply for recruitments.",
      ta: "வேலைவாய்ப்பு பரிமாற்ற இணையதளங்களில் பதிவு செய்யவும், காலிப்பணியிட நிலைகளைக் கண்காணிக்கவும் மற்றும் ஆட்சேர்ப்புகளுக்கு விண்ணப்பிக்கவும்."
    };
  }
  if (t.includes('society') || t.includes('societies') || t.includes('chit') || t.includes('marriage') || t.includes('vendor')) {
    return {
      en: "Search official state records for registered marriages, societies, chits, and stamp vendors.",
      ta: "பதிவுசெய்யப்பட்ட திருமணங்கள், சங்கங்கள், சீட்டுகள் மற்றும் முத்திரை விற்பனையாளர்களுக்கான அதிகாரப்பூர்வ மாநில பதிவுகளை தேடவும்."
    };
  }
  
  // Default fallbacks based on name
  return {
    en: `Official government portal for accessing ${title.toLowerCase()} services online.`,
    ta: `${title} சேவைகளை ஆன்லைனில் அணுகுவதற்கான அதிகாரப்பூர்வ அரசு இணையதளம்.`
  };
}

// Read translations file
const filePath = 'c:\\TN-Gov\\src\\utils\\translations.js';
let content = fs.readFileSync(filePath, 'utf-8');

// Parse out translation blocks for en and ta
const lines = content.split('\n');
const enServices = {};
let currentBlock = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('en: {')) {
    currentBlock = 'en';
  } else if (line.includes('ta: {')) {
    currentBlock = 'ta';
  }
  
  if (currentBlock === 'en') {
    const match = line.match(/'(svc\.[a-zA-Z0-9]+)':\s*'(.*)',?/);
    if (match) {
      enServices[match[1]] = match[2];
    }
  }
}

console.log('Parsed service keys count:', Object.keys(enServices).length);

// Generate new description translation keys
const enDescKeys = {};
const taDescKeys = {};

// Categories desc
for (const [key, val] of Object.entries(catDesc)) {
  enDescKeys[`'onlineServices.cat.${key}.desc'`] = `'${val.en}'`;
  taDescKeys[`'onlineServices.cat.${key}.desc'`] = `'${val.ta}'`;
}

// Departments desc
for (const [key, val] of Object.entries(deptDesc)) {
  enDescKeys[`'dept.${key}.desc'`] = `'${val.en}'`;
  taDescKeys[`'dept.${key}.desc'`] = `'${val.ta}'`;
}

// Services desc
for (const [keyPath, title] of Object.entries(enServices)) {
  const key = keyPath.replace('svc.', '');
  const desc = getServiceDescription(key, title);
  enDescKeys[`'svc.${key}.desc'`] = `'${desc.en.replace(/'/g, "\\'")}'`;
  taDescKeys[`'svc.${key}.desc'`] = `'${desc.ta.replace(/'/g, "\\'")}'`;
}

// Now let's inject them into the file!
const enBlockStr = Object.entries(enDescKeys).map(([k, v]) => `    ${k}: ${v},`).join('\n');
const taBlockStr = Object.entries(taDescKeys).map(([k, v]) => `    ${k}: ${v},`).join('\n');

// Find the index of the line that starts the ta block
let taBlockStartLineIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === 'ta: {') {
    taBlockStartLineIndex = i;
    break;
  }
}

// The en block ends right before the ta block starts.
// Find the closing brace of the en block, which is the first `},` searching backwards from ta block start.
let enClosingBraceIndex = -1;
for (let i = taBlockStartLineIndex - 1; i >= 0; i--) {
  if (lines[i].trim() === '},') {
    enClosingBraceIndex = i;
    break;
  }
}

// Find the line that closes the ta block, which is the first `}` before the end of the file that is followed by `};`
let taClosingBraceIndex = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].trim() === '}' && i + 1 < lines.length && lines[i+1].trim().startsWith('};')) {
    taClosingBraceIndex = i;
    break;
  }
}

console.log('Inserting en block before line:', enClosingBraceIndex);
console.log('Inserting ta block before line:', taClosingBraceIndex);

if (enClosingBraceIndex !== -1 && taClosingBraceIndex !== -1) {
  // Ensure the line before the en closing brace ends with a comma
  if (!lines[enClosingBraceIndex - 1].trim().endsWith(',')) {
    lines[enClosingBraceIndex - 1] = lines[enClosingBraceIndex - 1].trimEnd() + ',';
  }
  // Insert en block before the closing brace
  lines.splice(enClosingBraceIndex, 0, enBlockStr);
  
  // Recalculate ta indices after en block insertion
  const offset = 1;
  const newTaClosingBraceIndex = taClosingBraceIndex + offset;
  
  // Ensure the line before the ta closing brace ends with a comma
  if (!lines[newTaClosingBraceIndex - 1].trim().endsWith(',')) {
    lines[newTaClosingBraceIndex - 1] = lines[newTaClosingBraceIndex - 1].trimEnd() + ',';
  }
  // Insert ta block before the closing brace
  lines.splice(newTaClosingBraceIndex, 0, taBlockStr);
  
  const newContent = lines.join('\n');
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log('Successfully updated translations.js with all descriptions!');
} else {
  console.error('Failed to locate insertion blocks in translations.js');
}
