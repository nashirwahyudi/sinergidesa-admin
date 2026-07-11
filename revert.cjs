const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("const [filteredMarketplace, setMarketplaceProducts]", "const [marketplaceProducts, setMarketplaceProducts]");
content = content.replace("const [filteredSupplies, setAvailableSupplies]", "const [availableSupplies, setAvailableSupplies]");
content = content.replace("const [filteredNeeded, setNeededGoods]", "const [neededGoods, setNeededGoods]");
content = content.replace("const [filteredEscrow, setEscrowTransactions]", "const [escrowTransactions, setEscrowTransactions]");
content = content.replace("const [filteredStocks, setStocks]", "const [stocks, setStocks]");

content = content.replace("const filteredEscrow = useMemo(() => filteredEscrow.filter(t => t.receiver === currentKoperasi || t.sender === currentKoperasi), [filteredEscrow, currentKoperasi]);", "const computedEscrow = useMemo(() => escrowTransactions.filter(t => t.receiver === currentKoperasi || t.sender === currentKoperasi), [escrowTransactions, currentKoperasi]);");
content = content.replace("const filteredMarketplace = useMemo(() => filteredMarketplace, [filteredMarketplace]);", "const computedMarketplace = useMemo(() => marketplaceProducts, [marketplaceProducts]);");
content = content.replace("const filteredSupplies = useMemo(() => filteredSupplies.filter(s => s.koperasi === currentKoperasi || s.destinationKoperasi === currentKoperasi), [filteredSupplies, currentKoperasi]);", "const computedSupplies = useMemo(() => availableSupplies.filter(s => s.koperasi === currentKoperasi || s.destinationKoperasi === currentKoperasi), [availableSupplies, currentKoperasi]);");
content = content.replace("const filteredNeeded = useMemo(() => filteredNeeded.filter(n => n.koperasi === currentKoperasi || n.requesterKoperasi === currentKoperasi), [filteredNeeded, currentKoperasi]);", "const computedNeeded = useMemo(() => neededGoods.filter(n => n.koperasi === currentKoperasi || n.requesterKoperasi === currentKoperasi), [neededGoods, currentKoperasi]);");
content = content.replace("const filteredStocks = useMemo(() => filteredStocks.filter(s => s.koperasi === currentKoperasi), [filteredStocks, currentKoperasi]);", "const computedStocks = useMemo(() => stocks.filter(s => s.koperasi === currentKoperasi), [stocks, currentKoperasi]);");

content = content.replace(/filteredEscrow/g, "computedEscrow");
content = content.replace(/filteredMarketplace/g, "computedMarketplace");
content = content.replace(/filteredSupplies/g, "computedSupplies");
content = content.replace(/filteredNeeded/g, "computedNeeded");
content = content.replace(/filteredStocks/g, "computedStocks");
content = content.replace(/setcomputedStocks/g, "setStocks");

fs.writeFileSync('src/App.tsx', content);
