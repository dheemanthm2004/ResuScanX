#!/usr/bin/env node

/**
 * ResuScanX Setup Verification Script
 * Checks if all required components are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ResuScanX Setup Verification\n');

// Check backend structure
const backendChecks = [
  'backend/package.json',
  'backend/server.js',
  'backend/.env.example',
  'backend/routes/auth.js',
  'backend/routes/analysis.js',
  'backend/routes/chat.js',
  'backend/routes/ats.js',
  'backend/services/aiService.js',
  'backend/services/atsService.js',
  'backend/models/User.js',
  'backend/models/Analysis.js',
  'backend/middleware/auth.js'
];

// Check frontend structure
const frontendChecks = [
  'frontend/package.json',
  'frontend/app/page.tsx',
  'frontend/app/layout.tsx',
  'frontend/app/dashboard/page.tsx',
  'frontend/app/analysis/[id]/page.tsx',
  'frontend/app/ats-checker/page.tsx',
  'frontend/components/ChatBot.tsx',
  'frontend/components/ComprehensiveChart.tsx',
  'frontend/components/SkillsChart.tsx',
  'frontend/components/ExportButton.tsx',
  'frontend/lib/api.ts',
  'frontend/types/index.ts'
];

let allGood = true;

console.log('📁 Backend Structure:');
backendChecks.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allGood = false;
});

console.log('\n📁 Frontend Structure:');
frontendChecks.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allGood = false;
});

// Check if .env exists
console.log('\n🔐 Environment Configuration:');
const envExists = fs.existsSync(path.join(__dirname, 'backend/.env'));
console.log(`  ${envExists ? '✅' : '❌'} backend/.env ${envExists ? '' : '(copy from .env.example)'}`);

// Check package.json dependencies
console.log('\n📦 Dependencies Check:');
try {
  const backendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend/package.json')));
  const frontendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'frontend/package.json')));
  
  const requiredBackend = ['express', 'mongoose', 'jsonwebtoken', 'bcryptjs', 'multer', 'pdf-parse', 'axios'];
  const requiredFrontend = ['next', 'react', 'typescript', 'tailwindcss', 'chart.js', 'react-chartjs-2'];
  
  requiredBackend.forEach(dep => {
    const exists = backendPkg.dependencies[dep];
    console.log(`  ${exists ? '✅' : '❌'} Backend: ${dep}`);
    if (!exists) allGood = false;
  });
  
  requiredFrontend.forEach(dep => {
    const exists = frontendPkg.dependencies[dep];
    console.log(`  ${exists ? '✅' : '❌'} Frontend: ${dep}`);
    if (!exists) allGood = false;
  });
} catch (error) {
  console.log('  ❌ Error reading package.json files');
  allGood = false;
}

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 All checks passed! ResuScanX is ready for production.');
  console.log('\n📋 Next steps:');
  console.log('1. Configure your .env file with API keys');
  console.log('2. Run: cd backend && npm install && npm run dev');
  console.log('3. Run: cd frontend && npm install && npm run dev');
  console.log('4. Visit: http://localhost:3000');
} else {
  console.log('⚠️  Some issues found. Please fix the missing files/dependencies.');
}
console.log('='.repeat(50));