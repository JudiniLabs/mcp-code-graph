#!/usr/bin/env node

// Wrapper script to ensure ES modules work correctly with npx
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.error('MCP Code Graph wrapper starting...');

const child = spawn('node', ['--input-type=module', join(__dirname, 'dist', 'index.js')], {
  stdio: 'inherit',
  env: process.env
});

child.on('exit', (code) => {
  console.error('MCP Code Graph wrapper exiting with code:', code);
  process.exit(code);
});

child.on('error', (error) => {
  console.error('MCP Code Graph wrapper error:', error);
  process.exit(1);
});