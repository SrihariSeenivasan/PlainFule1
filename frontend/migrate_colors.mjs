import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  path.join(__dirname, 'src/components/Policies'),
  path.join(__dirname, 'src/components/LandingPage/LandingPageSections'),
  path.join(__dirname, 'src/components/LandingPage/ProductPageSections')
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Add BRAND import if not present but we are about to use it
  const needsImport = !content.includes('BRAND') && 
                      (content.includes('bg-green') || content.includes('text-green') || 
                       content.includes('#0a3d1f') || content.includes('#16a34a') || 
                       content.includes('#14532d') || content.includes('const C =') ||
                       content.includes('COLORS.') || content.includes('C.'));

  // 1. Replace Tailwind text-green-* with explicit BRAND inline styles or mapped utility if possible
  content = content.replace(/text-green-[45678]00/g, `text-[#322D29]`); // map to espresso hex directly for simple tailwind
  content = content.replace(/bg-green-[567]00/g, `bg-[#72383D]`); // map to burgundy
  content = content.replace(/bg-green-50/g, `bg-[#EFE9E1]`); // map to cream
  content = content.replace(/text-green-900/g, `text-[#322D29]`); 
  
  // 2. Replace hardcoded hex colors
  content = content.replace(/#0a3d1f/gi, '#322D29'); // forest -> espresso
  content = content.replace(/#14532d/gi, '#322D29'); // mid -> espresso
  content = content.replace(/#16a34a/gi, '#72383D'); // leaf -> burgundy
  content = content.replace(/#071a0d/gi, '#322D29'); // deep -> espresso

  // 3. Replace local `COLORS` strings and `C.` if they exist in the file
  if (content.includes('BRAND')) {
    // If we've already imported BRAND, we can replace C.forest with BRAND.espresso etc
    content = content.replace(/C\.forest/g, 'BRAND.espresso');
    content = content.replace(/C\.leaf/g, 'BRAND.burgundy');
    content = content.replace(/C\.deep/g, 'BRAND.espresso');
    content = content.replace(/C\.mid/g, 'BRAND.espresso');
    content = content.replace(/C\.offwhite/g, 'BRAND.cream');
    content = content.replace(/COLORS\.forest/g, 'BRAND.espresso');
    content = content.replace(/COLORS\.leaf/g, 'BRAND.burgundy');
    content = content.replace(/COLORS\.deep/g, 'BRAND.espresso');
  } else {
    // if BRAND is not imported but we replace C. we should import it
    content = content.replace(/C\.forest/g, 'BRAND.espresso');
    content = content.replace(/C\.leaf/g, 'BRAND.burgundy');
    content = content.replace(/C\.deep/g, 'BRAND.espresso');
    content = content.replace(/C\.mid/g, 'BRAND.espresso');
    content = content.replace(/C\.offwhite/g, 'BRAND.cream');
    content = content.replace(/COLORS\.forest/g, 'BRAND.espresso');
    content = content.replace(/COLORS\.leaf/g, 'BRAND.burgundy');
    content = content.replace(/COLORS\.deep/g, 'BRAND.espresso');
    
    // Check if we did replace a C. or COLORS.
    if (content !== original && !content.includes('BRAND') && content.includes('BRAND.')) {
      if(content.includes('import { F_SIZE } from "@/lib/typography"')) {
         content = content.replace('import { F_SIZE } from "@/lib/typography"', 'import { F_SIZE, BRAND } from "@/lib/typography"');
      } else if (content.includes("import { F_SIZE } from '@/lib/typography'")) {
         content = content.replace("import { F_SIZE } from '@/lib/typography'", "import { F_SIZE, BRAND } from '@/lib/typography'");
      } else if (content.includes("import { F_SIZE, FONTS }")) {
         content = content.replace("import { F_SIZE, FONTS }", "import { F_SIZE, FONTS, BRAND }");
      } else if (content.includes("import { FONTS }")) {
         content = content.replace("import { FONTS }", "import { FONTS, BRAND }");
      } else if (!content.includes("@/lib/typography")) {
         content = `import { BRAND } from '@/lib/typography';\n` + content;
      }
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

dirs.forEach(traverse);
console.log('Migration complete.');
