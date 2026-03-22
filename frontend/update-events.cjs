const fs = require('fs');

let c = fs.readFileSync('src/data/events.js', 'utf8');

// Global updates for prizes
c = c.replace(/    firstPrize:\s*'[^']*',\r?\n/g, "");
c = c.replace(/    secondPrize:\s*'[^']*',\r?\n/g, "");
c = c.replace(/    thirdPrize:\s*'[^']*',\r?\n/g, "");
c = c.replace(/prize:\s*'[^']*'/g, "prize: '₹3,000'");
c = c.replace(/prizeValue:\s*\d+/g, "prizeValue: 3000");

// Kabaddi updates
c = c.replace(/(id:\s*'kabaddi'[\s\S]*?)prize:\s*'₹3,000'/g, "$1prize: '₹5,000'");
c = c.replace(/(id:\s*'kabaddi'[\s\S]*?)prizeValue:\s*3000/g, "$1prizeValue: 5000");
c = c.replace(/(id:\s*'kabaddi'[\s\S]*?)duration:\s*'[^']*'/g, "$1duration: '8:30 AM to 3:00 PM'");
c = c.replace(/(id:\s*'kabaddi'[\s\S]*?)date:\s*`\$\{SYMPOSIUM_INFO\.dateDisplay\} — [^`]+`/g, "$1date: `${SYMPOSIUM_INFO.dateDisplay} — 8:30 AM to 3:00 PM`");

// Cipher Vista rename
c = c.replace(/(id:\s*'cipher-vista'[\s\S]*?)title:\s*'[^']*'/g, "$1title: 'Poster Presentation'");

fs.writeFileSync('src/data/events.js', c);
console.log("Updated events.js successfully.");
