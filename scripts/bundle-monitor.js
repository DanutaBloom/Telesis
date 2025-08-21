#!/usr/bin/env node

/**
 * Bundle Size Monitor
 * Tracks bundle sizes and alerts if they exceed thresholds
 */

const fs = require('node:fs');
const path = require('node:path');

const BUNDLE_THRESHOLDS = {
  total: 5 * 1024 * 1024, // 5MB total limit
  chunk: 1 * 1024 * 1024, // 1MB per chunk limit
};

function getFileSizes(directory) {
  if (!fs.existsSync(directory)) {
    console.log('❌ Build directory not found. Run `npm run build` first.');
    return [];
  }

  const files = [];

  function traverse(dir) {
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (entry.endsWith('.js')) {
        files.push({
          name: path.relative(directory, fullPath),
          size: stat.size,
          path: fullPath,
        });
      }
    }
  }

  traverse(directory);
  return files;
}

function formatBytes(bytes) {
  if (bytes === 0) {
 return '0 B';
}
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

function analyzeBundles() {
  console.log('📊 Analyzing bundle sizes...\n');

  const staticDir = path.join(__dirname, '../.next/static');
  const files = getFileSizes(staticDir);

  if (files.length === 0) {
    console.log('❌ No JavaScript files found in build output.');
    return;
  }

  // Sort by size descending
  files.sort((a, b) => b.size - a.size);

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  console.log('🎯 Bundle Analysis Results:');
  console.log('─'.repeat(60));

  // Show top 10 largest chunks
  console.log('\n📦 Largest JavaScript Chunks:');
  files.slice(0, 10).forEach((file, index) => {
    const size = formatBytes(file.size);
    const percentage = ((file.size / totalSize) * 100).toFixed(1);
    const status = file.size > BUNDLE_THRESHOLDS.chunk ? '⚠️ ' : '✅ ';

    console.log(`${status}${index + 1}. ${file.name} - ${size} (${percentage}%)`);
  });

  // Total size analysis
  console.log('\n📊 Bundle Size Summary:');
  console.log('─'.repeat(60));
  console.log(`Total Size: ${formatBytes(totalSize)}`);
  console.log(`Threshold: ${formatBytes(BUNDLE_THRESHOLDS.total)}`);

  if (totalSize > BUNDLE_THRESHOLDS.total) {
    console.log('❌ ALERT: Bundle size exceeds 5MB limit!');
    console.log('💡 Consider further code splitting or removing unused dependencies.');
  } else {
    const percentage = ((totalSize / BUNDLE_THRESHOLDS.total) * 100).toFixed(1);
    console.log(`✅ Bundle size is within limits (${percentage}% of threshold)`);
  }

  // Chunk size warnings
  const oversizedChunks = files.filter(file => file.size > BUNDLE_THRESHOLDS.chunk);
  if (oversizedChunks.length > 0) {
    console.log(`\n⚠️  ${oversizedChunks.length} chunk(s) exceed 1MB limit:`);
    oversizedChunks.forEach((chunk) => {
      console.log(`   • ${chunk.name} (${formatBytes(chunk.size)})`);
    });
  }

  console.log('\n💡 Tips for optimization:');
  console.log('   • Run `npm run build-stats` for detailed analysis');
  console.log('   • Use dynamic imports for heavy components');
  console.log('   • Check for duplicate dependencies');
  console.log('   • Consider lazy loading non-critical features');
}

// Run the analysis
analyzeBundles();
