import React, { useState } from 'react';
import { PackagePlus, RefreshCw, Plus, ArrowLeft, Upload, Save, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { StockItem } from '../types';

interface InventoryViewProps {
  stocks: StockItem[];
  onAddStock: (stock: Omit<StockItem, 'id' | 'lastSync' | 'koperasi'>) => void;
  viewMode: 'list' | 'form';
  setViewMode: (mode: 'list' | 'form') => void;
}

export default function InventoryView({ stocks, onAddStock, viewMode, setViewMode }: InventoryViewProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Form states
  const [komoditas, setKomoditas] = useState('');
  const [satuan, setSatuan] = useState('Kilogram');
  const [berat, setBerat] = useState<number | ''>('');
  const [hargaBeli, setHargaBeli] = useState<number | ''>('');
  const [catatan, setCatatan] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncMessage('');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage('Stok berhasil disinkronisasi dengan sistem pusat.');
      setTimeout(() => setSyncMessage(''), 3000);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      // Simulate image upload processing
      setTimeout(() => {
        const newImages = Array.from(e.target.files!).map(() => `https://images.unsplash.com/photo-1595113316349-944122bc158b?auto=format&fit=crop&q=80&w=200&random=${Math.random()}`);
        setImages(prev => [...prev, ...newImages]);
        setUploading(false);
      }, 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!komoditas || !berat || !hargaBeli) return;
    
    onAddStock({
      komoditas,
      satuan,
      berat: Number(berat),
      hargaBeli: Number(hargaBeli),
      images,
      catatan
    });
    
    setViewMode('list');
    // Reset form
    setKomoditas('');
    setSatuan('Kilogram');
    setBerat('');
    setHargaBeli('');
    setCatatan('');
    setImages([]);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (viewMode === 'form') {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setViewMode('list')}
            className="p-2 hover:bg-[#eff4ff] rounded-full transition-colors text-[#003b49]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-[#003b49]">Input Barang (Stok Masuk)</h2>
            <p className="text-sm text-[#40484c]">Tambahkan inventaris komoditas baru ke gudang koperasi</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#bfc8cc]/60 shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#003b49]">1. Komoditas <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Gabah Kering Giling"
                  value={komoditas}
                  onChange={(e) => setKomoditas(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#bfc8cc] focus:ring-2 focus:ring-[#003b49]/20 focus:border-[#003b49] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#003b49]">2. Satuan <span className="text-red-500">*</span></label>
                  <select 
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#bfc8cc] focus:ring-2 focus:ring-[#003b49]/20 focus:border-[#003b49] outline-none transition-all cursor-pointer"
                  >
                    <option value="Ton">Ton</option>
                    <option value="Kwintal">Kwintal</option>
                    <option value="Kilogram">Kilogram</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#003b49]">3. Nilai Berat <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={berat}
                    onChange={(e) => setBerat(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#bfc8cc] focus:ring-2 focus:ring-[#003b49]/20 focus:border-[#003b49] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#003b49]">4. Harga Beli (Per {satuan}) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#40484c]">Rp</span>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="0"
                    value={hargaBeli}
                    onChange={(e) => setHargaBeli(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-[#bfc8cc] focus:ring-2 focus:ring-[#003b49]/20 focus:border-[#003b49] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#003b49]">5. Gambar Barang (Bisa &gt; 1)</label>
              <div className="border-2 border-dashed border-[#bfc8cc] rounded-xl p-6 hover:bg-[#f8f9ff] transition-colors relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center text-center gap-2">
                  <Upload className={`w-8 h-8 ${uploading ? 'text-[#003b49] animate-bounce' : 'text-[#40484c]'}`} />
                  <p className="text-sm font-bold text-[#003b49]">
                    {uploading ? 'Mengunggah gambar...' : 'Klik atau drag gambar ke sini'}
                  </p>
                  <p className="text-xs text-[#40484c]">Format JPG, PNG maksimal 5MB per file</p>
                </div>
              </div>
              
              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-[#bfc8cc]/50 shadow-sm">
                      <img src={img} alt={`Preview ${idx+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#003b49]">6. Catatan Tambahan</label>
              <textarea 
                rows={3}
                placeholder="Tuliskan kondisi barang, nama penyuplai, atau catatan lainnya..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#bfc8cc] focus:ring-2 focus:ring-[#003b49]/20 focus:border-[#003b49] outline-none transition-all resize-none"
              />
            </div>
          </div>
          
          <div className="bg-[#f8f9ff] px-6 py-4 border-t border-[#bfc8cc]/60 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => setViewMode('list')}
              className="px-6 py-2.5 rounded-xl font-bold text-[#003b49] bg-white border border-[#bfc8cc] hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#003b49] hover:bg-[#005c73] transition-colors flex items-center gap-2 shadow-md active:scale-95"
            >
              <Save className="w-4 h-4" /> Simpan Stok
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#bfc8cc]/60 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#003b49] flex items-center gap-2">
            <PackagePlus className="w-6 h-6 text-[#60d7ff]" /> Stok Barang & Inventaris
          </h2>
          <p className="text-sm text-[#40484c] mt-1">Daftar stok komoditas yang tersedia di gudang saat ini</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[#003b49] bg-[#eff4ff] hover:bg-[#e0eafb] transition-colors border border-[#003b49]/10"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
            Sync Stok
          </button>
          
          <button 
            onClick={() => setViewMode('form')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white bg-[#003b49] hover:bg-[#005c73] transition-colors shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" /> Input Barang
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold animate-fade-in">
          <CheckCircle className="w-5 h-5" /> {syncMessage}
        </div>
      )}

      {/* Stock List Grid */}
      {stocks.length === 0 ? (
        <div className="bg-white border border-[#bfc8cc]/60 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-16 h-16 bg-[#eff4ff] rounded-full flex items-center justify-center mb-4">
            <PackagePlus className="w-8 h-8 text-[#003b49]" />
          </div>
          <h3 className="text-lg font-bold text-[#003b49] mb-2">Belum ada stok barang</h3>
          <p className="text-[#40484c] text-sm max-w-md mb-6">Klik tombol "Input Barang" untuk menambahkan komoditas hasil tani atau sarana produksi ke dalam sistem.</p>
          <button 
            onClick={() => setViewMode('form')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#003b49] hover:bg-[#005c73] transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" /> Mulai Input Barang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map(stock => (
            <div key={stock.id} className="bg-white rounded-2xl border border-[#bfc8cc]/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {stock.images && stock.images.length > 0 ? (
                  <img src={stock.images[0]} alt={stock.komoditas} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-12 h-12 opacity-20" />
                  </div>
                )}
                {stock.images && stock.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                    +{stock.images.length - 1} foto
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-extrabold text-[#003b49] shadow-sm">
                  {stock.berat.toLocaleString('id-ID')} {stock.satuan}
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-lg font-bold text-[#0b1c30] mb-1 leading-tight">{stock.komoditas}</h3>
                <p className="text-sm font-extrabold text-[#005c73] mb-4">
                  {formatRupiah(stock.hargaBeli)} <span className="text-xs font-medium text-[#40484c]">/ {stock.satuan}</span>
                </p>
                
                {stock.catatan && (
                  <p className="text-xs text-[#40484c] mb-4 flex-grow line-clamp-2 italic border-l-2 border-[#bfc8cc]/50 pl-2">
                    "{stock.catatan}"
                  </p>
                )}
                
                <div className="mt-auto pt-4 border-t border-[#bfc8cc]/30 flex justify-between items-center">
                  <span className="text-[10px] text-[#40484c] font-medium flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Sync: {stock.lastSync}
                  </span>
                  <span className="text-[10px] bg-[#dcfce7] text-[#15803d] font-bold px-2 py-1 rounded-md">
                    Tersedia
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
