// Script to remove all console statements
const fs = require('fs');
const path = require('path');

function removeConsoleStatements(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove console.log statements (including multiline)
    content = content.replace(/console\.log\([^;]*\);?/gs, '');
    
    // Remove console.error statements
    content = content.replace(/console\.error\([^;]*\);?/gs, '');
    
    // Remove console.warn statements
    content = content.replace(/console\.warn\([^;]*\);?/gs, '');
    
    // Remove console.info statements
    content = content.replace(/console\.info\([^;]*\);?/gs, '');
    
    // Remove console.debug statements
    content = content.replace(/console\.debug\([^;]*\);?/gs, '');
    
    // Clean up extra empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Cleaned: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      processDirectory(fullPath);
    } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(file)) {
      removeConsoleStatements(fullPath);
    }
  }
}

// Start processing from src directory
const srcPath = path.join(__dirname, 'src');
if (fs.existsSync(srcPath)) {
  processDirectory(srcPath);
  console.log('🎉 Console cleanup completed!');
} else {
  console.error('❌ src directory not found');
}