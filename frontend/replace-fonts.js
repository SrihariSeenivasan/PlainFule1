const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walk(filePath, fileList);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const files = walk(srcDir);

let modifiedCount = 0;

for (const filePath of files) {
    if (filePath.includes('typography.ts')) continue;

    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Pattern to match fontSize: <value> where value can be a string literal or a number.
    const fontSizeRegex = /fontSize\s*:\s*(['"`][^'"`]*['"`]|[0-9.]+)/g;

    content = content.replace(fontSizeRegex, (match, value) => {
        value = value.trim();

        // Convert the value to a generalized type
        if (value.includes('clamp')) {
            if (value.includes('6vw') || value.includes('36px') || value.includes('4vw') && value.includes('3.8rem') || value.includes('40px') || value.includes('4rem') || value.includes('3.5vw')) {
                return `fontSize: F_SIZE.h1`;
            } else if (value.includes('3vw') || value.includes('28px') || value.includes('1.8rem') || value.includes('2.2rem')) {
                return `fontSize: F_SIZE.h2`;
            } else {
                return `fontSize: F_SIZE.h3`;
            }
        }
        
        let numValue = value.replace(/['"pxremem%]/g, '');
        numValue = parseFloat(numValue);

        if (!isNaN(numValue)) {
            // Numbers are treated as pixels generally, or if < 5 probably rem
            if (numValue < 10 && numValue > 0) numValue = numValue * 16;
            
            if (numValue >= 32) return `fontSize: F_SIZE.h1`;
            if (numValue >= 24) return `fontSize: F_SIZE.h3`;
            if (numValue >= 18) return `fontSize: F_SIZE.body_lg`;
            if (numValue >= 15) return `fontSize: F_SIZE.body`;
            return `fontSize: F_SIZE.small`;
        }

        // Leave alone if it's already F_SIZE or something dynamic
        if (value.includes('F_SIZE')) return match;

        return match;
    });

    if (content !== originalContent) {
        // Add import F_SIZE
        if (!content.includes('F_SIZE')) {
            const relPath = path.relative(path.dirname(filePath), path.join(srcDir, 'lib', 'typography'));
            let importPath = relPath.replace(/\\/g, '/');
            if (!importPath.startsWith('.')) {
                importPath = './' + importPath;
            }
            // Insert after the last import statement or 'use client'; if present.
            function insertImport(c) {
                const useClientRegex = /(['"]use client['"]\s*;?)/;
                if (useClientRegex.test(c)) {
                    return c.replace(useClientRegex, `$1\nimport { F_SIZE } from '${importPath}';`);
                }
                return `import { F_SIZE } from '${importPath}';\n` + c;
            }
            content = insertImport(content);
        }
        
        fs.writeFileSync(filePath, content, 'utf-8');
        modifiedCount++;
    }
}

console.log(`Modified ${modifiedCount} files.`);
