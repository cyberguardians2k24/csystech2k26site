import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('d:/new cystech/csystech2k26site/frontend/src', function(filePath) {
  if (!filePath.match(/\.(js|jsx|ts|tsx|css)$/)) return;
  let text = fs.readFileSync(filePath, 'utf8');
  let orig = text;
  
  // rgba replacements
  text = text.replace(/rgba\(157,\s*0,\s*255/g, 'rgba(196, 30, 58'); 
  text = text.replace(/rgba\(191,\s*0,\s*255/g, 'rgba(196, 30, 58');
  text = text.replace(/rgba\(0,\s*240,\s*255/g, 'rgba(255, 215, 0');
  text = text.replace(/rgba\(76,\s*29,\s*149/g, 'rgba(196, 30, 58');
  text = text.replace(/rgba\(100,\s*0,\s*150/g, 'rgba(139, 0, 0');
  
  // hex red replacements
  text = text.replace(/#9D00FF/gi, '#C41E3A');
  text = text.replace(/#bf00ff/gi, '#C41E3A');
  text = text.replace(/#da00ff/gi, '#C41E3A');
  text = text.replace(/#e040fb/gi, '#C41E3A');
  text = text.replace(/#B44FFF/gi, '#C41E3A');
  text = text.replace(/#5b21b6/gi, '#991b1b');
  text = text.replace(/#7b2cff/gi, '#C41E3A');
  text = text.replace(/#4a0080/gi, '#8B0000');
  
  // hex gold replacements
  text = text.replace(/#00f0ff/gi, '#FFD700');
  text = text.replace(/#67e8f9/gi, '#FFD700');
  
  // holo-cyan variables to vibranium-gold
  text = text.replace(/holo-cyan/g, 'vibranium-gold');
  text = text.replace(/holo_cyan/g, 'vibranium_gold');
  text = text.replace(/--holo-cyan/g, '--vibranium-gold');
  
  // gradient replacements for cyan to gold
  text = text.replace(/#ecfeff/gi, '#fffbeb');
  text = text.replace(/#a5f3fc/gi, '#fde68a');
  text = text.replace(/#0891b2/gi, '#b45309');
  
  // gradient replacements for purple to red
  text = text.replace(/#f5f3ff/gi, '#fef2f2');
  text = text.replace(/#c4b5fd/gi, '#fca5a5');
  
  // words (be careful with these, only do it for variables/text meaning colors if needed, but the hex replacements cover 99% of UI)
  text = text.replace(/'cyan'/g, "'gold'");
  
  if (orig !== text) {
    fs.writeFileSync(filePath, text, 'utf8');
    console.log('Updated: ' + filePath);
  }
});
