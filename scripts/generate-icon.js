const png2icons = require('png2icons');
const fs = require('fs');
const path = require('path');

console.log('Converting PNG icon to ICO file...');

// PNG 파일 경로
const pngIconPath = path.join(__dirname, '..', 'public', 'assets', 'icon-512.png');

try {
  // PNG 파일 읽기
  const pngBuffer = fs.readFileSync(pngIconPath);
  
  // ICO 파일로 변환 (BMP 형식 사용 + 고해상도 지원)
  const icoBuffer = png2icons.createICO(pngBuffer, png2icons.BICUBIC, false, true);
  
  if (icoBuffer) {
    // 결과 저장
    const icoPath = path.join(__dirname, '..', 'public', 'assets', 'icon.ico');
    fs.writeFileSync(icoPath, icoBuffer);
    console.log(`Successfully created ICO file at: ${icoPath}`);
    
    // package.json의 build 설정에서 참조하는 경로에도 복사
    fs.copyFileSync(icoPath, path.join(__dirname, '..', 'public', 'assets', 'favicon.ico'));
    console.log(`Copied to favicon.ico for build process`);
  } else {
    console.error('Failed to convert PNG to ICO');
  }
} catch (error) {
  console.error('Error generating ICO file:', error.message);
} 