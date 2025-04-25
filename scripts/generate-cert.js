const selfsigned = require('selfsigned');
const fs = require('fs');
const path = require('path');

console.log('인증서 생성 중...');

// 인증서 설정
const attrs = [
  { name: 'commonName', value: 'localhost' },
  { name: 'countryName', value: 'KR' },
  { name: 'organizationName', value: 'Email AI Assistant' }
];

// 3년짜리 인증서 생성
const pems = selfsigned.generate(attrs, { days: 1095 });

// 인증서 디렉토리 생성
const certDir = path.join(__dirname, '..', 'cert');
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

// 인증서 및 키 저장
fs.writeFileSync(path.join(certDir, 'cert.pem'), pems.cert);
fs.writeFileSync(path.join(certDir, 'key.pem'), pems.private);

console.log('인증서가 성공적으로 생성되었습니다.');
console.log('위치: ' + certDir); 