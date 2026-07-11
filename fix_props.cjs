const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("computedSupplies={computedSupplies}", "availableSupplies={computedSupplies}");
content = content.replace("computedNeeded={computedNeeded}", "neededGoods={computedNeeded}");
content = content.replace("computedStocks={computedStocks}", "stocks={computedStocks}");

fs.writeFileSync('src/App.tsx', content);

let invContent = fs.readFileSync('src/components/InventoryView.tsx', 'utf8');
invContent = invContent.replace("onAddStock: (stock: Omit<StockItem, 'id' | 'lastSync'>)", "onAddStock: (stock: Omit<StockItem, 'id' | 'lastSync' | 'koperasi'>)");
fs.writeFileSync('src/components/InventoryView.tsx', invContent);

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace("const handleAddStock = (newStock: Omit<StockItem, 'id' | 'lastSync'>) => {", "const handleAddStock = (newStock: Omit<StockItem, 'id' | 'lastSync' | 'koperasi'>) => {");

appContent = appContent.replace(/const newSupply: AvailableSupply = \{\s*id: `SUP-\$\{Date\.now\(\)\}`,\s*name: `Stok \$\{name\}`,\s*quantity: '100 kg',\s*price: 0,\s*destinationKoperasi: `Koperasi User`,\s*status: 'Tersedia'\s*\};/g, 
  "const newSupply: AvailableSupply = {\n      id: `SUP-${Date.now()}`,\n      name: `Stok ${name}`,\n      quantity: '100 kg',\n      price: 0,\n      destinationKoperasi: `Koperasi User`,\n      status: 'Tersedia',\n      koperasi: currentKoperasi\n    };");

fs.writeFileSync('src/App.tsx', appContent);
