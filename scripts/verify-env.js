#!/usr/bin/env node
/**
 * Environment Setup Verification Script
 * Run this script to verify your environment is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vidyos Environment Setup Verification\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found');
  console.log('📝 Please copy .env.template to .env.local and configure your settings');
  process.exit(1);
}

// Load environment variables
require('dotenv').config({ path: envPath });

// Check required environment variables
const checks = [
  {
    name: 'DIFY_API_KEY',
    required: false, // Not required if demo mode is enabled
    description: 'Your Dify API key from https://dify.ai'
  },
  {
    name: 'DIFY_BASE_URL',
    required: false,
    description: 'Dify API base URL',
    default: 'https://api.dify.ai/v1'
  },
  {
    name: 'DEMO_MODE',
    required: false,
    description: 'Enable demo mode for testing',
    default: 'false'
  },
  {
    name: 'ENABLE_FALLBACK',
    required: false,
    description: 'Enable fallback responses',
    default: 'true'
  }
];

let allPassed = true;

checks.forEach(check => {
  const value = process.env[check.name];
  const hasValue = value && value.trim() !== '';
  
  if (check.required && !hasValue) {
    console.error(`❌ ${check.name} is required but not set`);
    console.log(`   ${check.description}`);
    allPassed = false;
  } else if (hasValue) {
    console.log(`✅ ${check.name}: ${value === process.env.DIFY_API_KEY ? '***' : value}`);
  } else {
    console.log(`⚠️  ${check.name}: using default (${check.default || 'none'})`);
  }
});

// Check demo mode configuration
const demoMode = process.env.DEMO_MODE === 'true';
const hasApiKey = process.env.DIFY_API_KEY && process.env.DIFY_API_KEY.trim() !== '';

console.log('\n📋 Configuration Summary:');
console.log(`   Mode: ${demoMode ? 'Demo Mode' : 'Production Mode'}`);
console.log(`   API Key: ${hasApiKey ? 'Configured' : 'Not configured'}`);
console.log(`   Fallback: ${process.env.ENABLE_FALLBACK !== 'false' ? 'Enabled' : 'Disabled'}`);

if (!hasApiKey && !demoMode) {
  console.log('\n⚠️  Warning: No API key configured and demo mode is disabled');
  console.log('   Either set DIFY_API_KEY or enable DEMO_MODE=true');
  allPassed = false;
}

if (allPassed) {
  console.log('\n🎉 Environment configuration looks good!');
  console.log('   Run "npm run dev" to start the development server');
} else {
  console.log('\n❌ Please fix the configuration issues above');
  process.exit(1);
}
