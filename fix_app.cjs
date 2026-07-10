const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add selectedRoleIndex
content = content.replace(
  "const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);",
  "const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);\n  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);\n  const currentKoperasi = DEMO_ROLES[selectedRoleIndex].koperasi;"
);

// Add koperasi to stocks
content = content.replace(
  /catatan: 'Pupuk alokasi bulan berjalan, kualitas baik.',\s*lastSync: 'Hari ini, 08:30'\s*\},/g,
  "catatan: 'Pupuk alokasi bulan berjalan, kualitas baik.',\n      lastSync: 'Hari ini, 08:30',\n      koperasi: 'Kop. Argosari'\n    },"
);
content = content.replace(
  /catatan: 'Sertifikat masih berlaku hingga tahun depan.',\s*lastSync: 'Kemarin, 14:15'\s*\}\s*\]\);/g,
  "catatan: 'Sertifikat masih berlaku hingga tahun depan.',\n      lastSync: 'Kemarin, 14:15',\n      koperasi: 'Kop. Tirtomulyo'\n    }\n  ]);"
);

// Add koperasi to orders and sells
content = content.replace(
  /(date: '[^']+')(\s*\})/g,
  "$1,\n      koperasi: Math.random() > 0.5 ? 'Kop. Argosari' : 'Kop. Tirtomulyo'$2"
);

// Handle handleAddStock
content = content.replace(
  /lastSync: 'Baru saja'\s*\};\s*setStocks/g,
  "lastSync: 'Baru saja',\n      koperasi: currentKoperasi\n    };\n    setStocks"
);

// Update Sidebar usage
content = content.replace(
  /onBrandClick=\{\(\) => \{\s*setActiveTab\('beranda'\);\s*\}\}\s*\/>/g,
  "onBrandClick={() => {\n          setActiveTab('beranda');\n        }}\n        selectedRoleIndex={selectedRoleIndex}\n        onRoleChange={setSelectedRoleIndex}\n      />"
);

// Filtering
content = content.replace(
  "// REACTIVE CALCULATION: Action Items banner list",
  `const filteredEscrow = useMemo(() => escrowTransactions.filter(t => t.receiver === currentKoperasi || t.sender === currentKoperasi), [escrowTransactions, currentKoperasi]);
  const filteredMarketplace = useMemo(() => marketplaceProducts, [marketplaceProducts]);
  const filteredSupplies = useMemo(() => availableSupplies.filter(s => s.koperasi === currentKoperasi || s.destinationKoperasi === currentKoperasi), [availableSupplies, currentKoperasi]);
  const filteredNeeded = useMemo(() => neededGoods.filter(n => n.koperasi === currentKoperasi || n.requesterKoperasi === currentKoperasi), [neededGoods, currentKoperasi]);
  const filteredStocks = useMemo(() => stocks.filter(s => s.koperasi === currentKoperasi), [stocks, currentKoperasi]);
  const filteredTrucks = useMemo(() => truckFleets.filter(t => t.koperasi === currentKoperasi), [truckFleets, currentKoperasi]);
  const filteredMemberTrx = useMemo(() => memberTransactions.filter(m => m.koperasi === currentKoperasi), [memberTransactions, currentKoperasi]);
  const filteredOrders = useMemo(() => orders.filter(o => o.koperasi === currentKoperasi), [orders, currentKoperasi]);
  const filteredSells = useMemo(() => sells.filter(s => s.koperasi === currentKoperasi), [sells, currentKoperasi]);
  const filteredOpps = useMemo(() => opportunities.filter(o => o.koperasi === currentKoperasi), [opportunities, currentKoperasi]);

  // REACTIVE CALCULATION: Action Items banner list`
);

// We need to replace usages
content = content.replace(/activeActionItems\.length/g, "filteredEscrow.filter(t => t.receiverConfirmed === false).length");
content = content.replace(/escrowTransactions/g, "filteredEscrow");
content = content.replace(/marketplaceProducts/g, "filteredMarketplace");
content = content.replace(/availableSupplies/g, "filteredSupplies");
content = content.replace(/neededGoods/g, "filteredNeeded");
content = content.replace(/stocks/g, "filteredStocks");
// but stocks is also used in setStocks, so we shouldn't replace all!

fs.writeFileSync('src/App.tsx', content);
