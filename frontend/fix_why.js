const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage/LandingPageSections/WhyPlainFuel.tsx', 'utf8');
content = content.replace(/BRAND\.gold/g, "'#854d0e'");
content = content.replace(/BRAND\.mist/g, "BRAND.cream");
content = content.replace(/BRAND\.offwhite/g, "BRAND.cream");
content = content.replace(/BRAND\.ink/g, "BRAND.espresso");
content = content.replace(/BRAND\.silver/g, "BRAND.taupe");
fs.writeFileSync('src/components/LandingPage/LandingPageSections/WhyPlainFuel.tsx', content);
