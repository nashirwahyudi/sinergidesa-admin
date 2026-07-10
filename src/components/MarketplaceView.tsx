import React, { useState } from 'react';
import { Search, ShoppingCart, Filter, ArrowRight, ShieldCheck, CheckCircle, Info, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import { MarketplaceProduct } from '../types';

interface MarketplaceViewProps {
  products: MarketplaceProduct[];
  onNavigateToDashboard: () => void;
  onPurchase: (product: MarketplaceProduct, qty: number) => void;
}

export default function MarketplaceView({
  products,
  onNavigateToDashboard,
  onPurchase,
}: MarketplaceViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [buyQty, setBuyQty] = useState<number>(100);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const categories = ['Semua', 'Hasil Tani', 'Pupuk & Obat', 'Benih'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBuyClick = (p: MarketplaceProduct) => {
    setSelectedProduct(p);
    // Parse quantity default
    const numericalQty = parseInt(p.quantity.replace(/[^0-9]/g, ''), 10) || 100;
    setBuyQty(Math.min(100, numericalQty));
  };

  const handleConfirmPurchase = () => {
    if (!selectedProduct) return;
    onPurchase(selectedProduct, buyQty);
    setSuccessMessage(`Berhasil membeli ${buyQty.toLocaleString('id-ID')} unit ${selectedProduct.name}! Menunggu konfirmasi pengiriman.`);
    setSelectedProduct(null);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-20">
      
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-20 right-4 bg-[#003b49] text-white px-5 py-3.5 rounded-xl shadow-xl border border-[#60d7ff] z-50 animate-fade-in flex items-center gap-3 max-w-md">
          <CheckCircle className="w-5 h-5 text-[#60d7ff] shrink-0" />
          <span className="text-sm font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Hero Welcome & Name Switcher Banner */}
      <section className="bg-gradient-to-r from-[#003b49] via-[#005c73] to-[#0a4d5c] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-[#60d7ff]/10">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-300 via-teal-500 to-transparent rounded-full" />
        
        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-[#60d7ff]/20 text-[#60d7ff] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-[#60d7ff]/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Hub Koperasi Desa Digital
          </span>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2">
            Selamat Datang di <span onClick={onNavigateToDashboard} className="underline decoration-wavy decoration-[#60d7ff] cursor-pointer hover:text-[#60d7ff] transition-all" title="Klik untuk membuka Dashboard Pengurus">SinergiDesa</span>
          </h2>
          
          <p className="text-xs sm:text-sm text-gray-200 mb-6 leading-relaxed">
            Marketplace digital terpercaya yang menyatukan seluruh komoditas tani unggul, pupuk subsidi tervalidasi, dan benih bersertifikat antar desa.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onNavigateToDashboard}
              className="bg-white text-[#003b49] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
            >
              Masuk ke Dashboard Pengurus <ArrowRight className="w-4 h-4 text-[#006780]" />
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-300 bg-black/20 px-4 py-2.5 rounded-xl border border-white/5 justify-center sm:justify-start">
              <ShieldCheck className="w-4 h-4 text-[#60d7ff]" /> Verified Escrow Protection
            </div>
          </div>
        </div>

        {/* Small hint label */}
        <div className="absolute bottom-3 right-4 text-[10px] text-gray-300/80 hidden lg:block">
          💡 Klik judul <span onClick={onNavigateToDashboard} className="underline font-bold text-white hover:text-[#60d7ff] cursor-pointer transition-colors">SinergiDesa</span> untuk berpindah ke Panel Pengurus Koperasi
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="bg-white p-4 rounded-2xl border border-[#bfc8cc] shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Category Buttons */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#003b49] text-white shadow-sm'
                  : 'text-[#40484c] hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <input
            type="text"
            placeholder="Cari komoditas, pupuk, atau benih..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8f9ff] border border-[#bfc8cc] rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm font-semibold focus:border-[#003b49] focus:ring-2 focus:ring-[#003b49]/10 outline-none transition-all"
          />
          <Search className="w-4 h-4 text-[#70787c] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </section>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-[#bfc8cc] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-[#003b49] text-lg">Komoditas Tidak Ditemukan</h3>
          <p className="text-[#40484c] text-sm max-w-md">
            Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <article
              key={p.id}
              className="bg-white border border-[#bfc8cc] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              {/* Product Image */}
              <div className="h-48 w-full relative bg-gray-100 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#003b49] text-[#60d7ff] text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
                  {p.category}
                </span>
              </div>

              {/* Product Body */}
              <div className="p-5 flex-grow flex flex-col gap-3">
                <div>
                  <h3 className="font-bold text-[#0b1c30] text-sm sm:text-base line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-[#70787c] line-clamp-2 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Price and Stock info */}
                <div className="bg-[#f8f9ff] p-3 rounded-xl border border-gray-100 flex justify-between items-center mt-auto">
                  <div>
                    <span className="text-[10px] text-[#70787c] font-semibold block uppercase">Harga Satuan</span>
                    <span className="text-base font-extrabold text-[#003b49]">{formatRupiah(p.price)} <span className="text-xs font-normal text-gray-500">/ kg</span></span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#70787c] font-semibold block uppercase">Tersedia</span>
                    <span className="text-sm font-bold text-[#006780]">{p.quantity}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleBuyClick(p)}
                  className="w-full bg-[#003b49] text-white font-bold text-xs py-3 rounded-xl hover:bg-[#005c73] transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4 text-[#60d7ff]" /> Beli Sekarang
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Information footer warning banner */}
      <div className="bg-[#eff4ff] border border-[#bfc8cc]/40 rounded-2xl p-4 flex items-start gap-3.5 text-xs text-[#003b49] font-medium">
        <Info className="w-5 h-5 text-[#006780] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Metode Pembayaran Escrow Koperasi Aman</span>
          SinergiDesa melindungi transaksi jual beli dengan dana yang disimpan di rekening penampung (escrow) digital desa. Dana hanya dicairkan ke penjual setelah pihak pembeli mengonfirmasi fisik muatan setoran timbangan di lokasi gudang tujuan.
        </div>
      </div>

      {/* BUY CONFIRMATION INTERACTIVE MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedProduct(null)} />
          
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#bfc8cc] shadow-2xl relative z-10 animate-fade-in overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#bfc8cc]/40 bg-[#f8f9ff]">
              <h3 className="font-bold text-[#003b49] text-base sm:text-lg">Konfirmasi Pembelian</h3>
              <p className="text-[10px] text-[#70787c] mt-0.5 font-semibold uppercase">ID Produk: {selectedProduct.id}</p>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex gap-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#0b1c30]">{selectedProduct.name}</h4>
                  <p className="text-xs text-[#70787c]">{selectedProduct.category} · {formatRupiah(selectedProduct.price)} / kg</p>
                </div>
              </div>

              {/* Quantity selector input field */}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs font-bold text-[#40484c] uppercase tracking-wider">
                  Kuantitas Pembelian (kg)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={buyQty}
                    onChange={(e) => setBuyQty(Number(e.target.value))}
                    className="flex-1 accent-[#003b49] cursor-pointer"
                  />
                  <span className="text-sm font-extrabold text-[#003b49] bg-[#f8f9ff] px-3 py-1.5 rounded-lg border min-w-[72px] text-center">
                    {buyQty} kg
                  </span>
                </div>
              </div>

              {/* Calculation Summary Row */}
              <div className="bg-[#eff4ff]/60 border border-dashed border-[#006780]/30 p-3 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-[#70787c] font-semibold block uppercase">Total Nilai Transaksi</span>
                  <span className="text-sm text-gray-500 font-semibold">{buyQty} kg x {formatRupiah(selectedProduct.price)}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-[#003b49]">{formatRupiah(buyQty * selectedProduct.price)}</span>
                </div>
              </div>

              {/* Payment notification */}
              <p className="text-[10px] text-[#70787c] leading-relaxed">
                * Pembayaran akan otomatis mengunci dana di escrow PJP. Dana aman terlindungi sampai barang dikirim dan terverifikasi digital.
              </p>
            </div>

            <div className="p-4 bg-[#f8f9ff] border-t border-[#bfc8cc]/40 flex justify-end gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#40484c] bg-white border border-[#bfc8cc] hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#003b49] text-white hover:bg-[#005c73] transition-colors flex items-center gap-1 shadow-md"
              >
                Kunci Transaksi <ShoppingCart className="w-3.5 h-3.5 text-[#60d7ff]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
