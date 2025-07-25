#!/usr/bin/env node

/**
 * Auto-update copyright years in all project files
 * Run this script annually or set up as a cron job
 */

const fs = require('fs');
const path = require('path');

const currentYear = new Date().getFullYear();
const startYear = 2025;
const yearRange = startYear === currentYear ? currentYear.toString() : `${startYear}-${currentYear}`;

const files = [
    'LICENSE',
    'index.html', 
    'style.css',
    'script.js'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update copyright year patterns
        content = content.replace(
            /Copyright \(c\) \d{4}(-\d{4})? Krishan/g,
            `Copyright (c) ${yearRange} Krishan`
        );
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated copyright in ${file}`);
    }
});

console.log(`Copyright updated to ${yearRange} in all files`);