const fs = require('fs');
const path = require('path');

const replacements = [
  {
    pattern: /@Roles\(Role\.ADMIN, Role\.SUPPORT_N1, Role\.SUPPORT_N2, Role\.SPECIALIST_N3\)/g,
    replacement: "@Roles('ADMIN', 'SUPPORT_N1', 'SUPPORT_N2', 'SPECIALIST_N3')"
  },
  {
    pattern: /@Roles\(Role\.ADMIN, Role\.SUPPORT_N1\)/g,
    replacement: "@Roles('ADMIN', 'SUPPORT_N1')"
  },
  {
    pattern: /@Roles\(Role\.ADMIN, Role\.SUPPORT_N2, Role\.SPECIALIST_N3\)/g,
    replacement: "@Roles('ADMIN', 'SUPPORT_N2', 'SPECIALIST_N3')"
  },
  {
    pattern: /@Roles\(Role\.ADMIN\)/g,
    replacement: "@Roles('ADMIN')"
  },
  {
    pattern: /import \{ Role \} from '@mvp\/types';/g,
    replacement: "import type { Role } from '@mvp/types';"
  }
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const { pattern, replacement } of replacements) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Fixed: ${filePath}`);
    return true;
  }
  
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixedCount += walkDir(filePath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      if (fixFile(filePath)) {
        fixedCount++;
      }
    }
  }
  
  return fixedCount;
}

console.log('Substituindo enum values por strings...\n');
const fixedCount = walkDir(path.join(__dirname, 'src'));
console.log(`\n✓ ${fixedCount} arquivos corrigidos!`);
