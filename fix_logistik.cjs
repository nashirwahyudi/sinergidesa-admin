const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/truckFleets\.filter/g, 'filteredTrucks.filter');
content = content.replace(/truckFleets\.length/g, 'filteredTrucks.length');
content = content.replace(/truckFleets\.map/g, 'filteredTrucks.map');

content = content.replace(/opportunities\.map/g, 'filteredOpps.map');

fs.writeFileSync('src/App.tsx', content);
