const png2icons = require('png2icons');
const fs = require('fs');
const path = require('path');

console.log('Converting PNG icon to ICO file...');

// PNG 파일 경로
const pngIconPath = path.join(__dirname, '..', 'assets', 'icon.png');

try {
  // PNG 파일 읽기
  const pngBuffer = fs.readFileSync(pngIconPath);
  
  // ICO 파일로 변환
  const icoBuffer = png2icons.createICO(pngBuffer, png2icons.BILINEAR, false, false);
  
  if (icoBuffer) {
    // 결과 저장
    const icoPath = path.join(__dirname, '..', 'assets', 'icon.ico');
    fs.writeFileSync(icoPath, icoBuffer);
    console.log(`Successfully created ICO file at: ${icoPath}`);
  } else {
    console.error('Failed to convert PNG to ICO');
  }
} catch (error) {
  console.error('Error generating ICO file:', error.message);
} 