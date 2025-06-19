#!/usr/bin/env node

console.error('Simple debug starting...');

// Mantén el proceso vivo por unos segundos para ver si llega hasta aquí
setTimeout(() => {
  console.error('Timeout reached, process should exit now');
  process.exit(0);
}, 5000);

console.error('Process should stay alive for 5 seconds...');
