import fs from 'fs';

const file = 'src/utils/translations.js';
let content = fs.readFileSync(file, 'utf8');

// Insert en keys before the end of the en block
const enToInsert = `    'importantWebsites.title': 'Important Websites',
    'importantWebsites.subtitle': 'Access government-certified directories, local municipal corporations, utilities, and development boards.',
    'importantWebsites.searchPlaceholder': 'Search websites (e.g. Anna University, CM Cell)...',
    'importantWebsites.noResults': 'No websites found matching',
    'importantWebsites.all': 'All Categories',
    'importantWebsites.visit': 'Visit Website',`;

content = content.replace(/(\s*\}),\r?\n(\s*ta: \{)/, (match, p1, p2) => {
  return '\n' + enToInsert + '\n' + p1 + ',\n' + p2;
});

// Insert ta keys before the end of the ta block
const taToInsert = `    'importantWebsites.title': 'முக்கிய இணையதளங்கள்',
    'importantWebsites.subtitle': 'அரசாங்கத்தால் சான்றளிக்கப்பட்ட கோப்பகங்கள், உள்ளூர் மாநகராட்சிகள், பொதுப் பயன்பாடுகள் மற்றும் மேம்பாட்டு வாரியங்களை அணுகுங்கள்.',
    'importantWebsites.searchPlaceholder': 'இணையதளங்களைத் தேடுங்கள் (எ.கா. அண்ணா பல்கலைக்கழகம், முதல்வர் பிரிவு)...',
    'importantWebsites.noResults': 'ஒத்த இணையதளங்கள் ஏதும் இல்லை',
    'importantWebsites.all': 'அனைத்துப் பிரிவுகளும்',
    'importantWebsites.visit': 'இணையதளத்தைப் பார்வையிட',`;

content = content.replace(/(\s*\})\r?\n(\s*\};\r?\n\s*export default translations;)/, (match, p1, p2) => {
  return '\n' + taToInsert + '\n' + p1 + '\n' + p2;
});

fs.writeFileSync(file, content, 'utf8');
console.log("Successfully updated translations.js with Important Websites keys (CRLF-aware, fixed syntax)!");
