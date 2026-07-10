const fs = require('fs');
let content = fs.readFileSync('src/mockData.ts', 'utf8');

const types = ['initialMemberTransactions', 'initialReturnTripOpportunities', 'initialTruckFleets', 'initialMarketplaceProducts', 'initialAvailableSupplies', 'initialNeededGoods'];

types.forEach(type => {
  content = content.replace(new RegExp(`(export const ${type}: [^\\[]+\\[\\] = \\s*\\[)([\\s\\S]*?)(^\\];)`, 'gm'), (match, p1, p2, p3) => {
    // find all objects and add koperasi: 'Kop. Argosari'
    const updated = p2.replace(/(\n\s+)\}/g, ",\n    koperasi: 'Kop. Argosari'\n  }");
    
    // duplicate everything and change id and Kop. Argosari -> Kop. Tirtomulyo
    const duplicated = updated.replace(/Kop\. Argosari/g, 'Kop. Tirtomulyo').replace(/(id:\s*['"])([^'"]+)(['"])/g, "$1$2-2$3");
    
    return p1 + updated + ",\n  " + duplicated.trim() + "\n" + p3;
  });
});

fs.writeFileSync('src/mockData.ts', content);
