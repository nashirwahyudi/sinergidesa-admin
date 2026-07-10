import React, { useState } from 'react';
import { Calendar, Download, CheckCircle, Clock, Search, X, Printer, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { MemberTransaction } from '../types';

interface MemberHistoryViewProps {
  memberTransactions: MemberTransaction[];
  onBackClick: () => void;
}

export default function MemberHistoryView({
  memberTransactions,
  onBackClick,
}: MemberHistoryViewProps) {
  const [selectedRange, setSelectedRange] = useState<'minggu' | 'bulan' | 'custom'>('minggu');
  const [unitMode, setUnitMode] = useState<'berat' | 'nilai'>('berat');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrx, setSelectedTrx] = useState<MemberTransaction | null>(null);
  const [showPrintToast, setShowPrintToast] = useState(false);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Filtered transactions based on search query
  const filteredTrx = memberTransactions.filter((trx) => {
    const query = searchQuery.toLowerCase();
    return (
      trx.id.toLowerCase().includes(query) ||
      trx.commodity.toLowerCase().includes(query) ||
      trx.date.toLowerCase().includes(query) ||
      trx.status.toLowerCase().includes(query)
    );
  });

  // Dynamic Chart Points based on unit mode
  // Days: Sen, Sel, Rab, Kam, Jum, Sab, Min
  // Line 1: Gabah
  // Line 2: Jagung
  const chartData = {
    berat: {
      gabah: [400, 600, 300, 1250, 900, 2000, 1100],
      jagung: [700, 650, 800, 500, 650, 450, 750],
      yMax: 2200,
      unit: 'kg',
    },
    nilai: {
      gabah: [2.8, 4.3, 2.1, 9.0, 6.4, 14.3, 7.9], // millions Rp
      jagung: [3.8, 3.5, 4.4, 2.7, 3.5, 2.4, 4.1],
      yMax: 16,
      unit: 'Juta Rp',
    },
  };

  const activePoints = chartData[unitMode];

  // Helper to convert chart values to SVG Y coordinates (SVG height is 200, padding top 20, bottom 20)
  const getSvgY = (val: number, max: number) => {
    const padding = 20;
    const height = 160; // usable area
    return 180 - (val / max) * height;
  };

  // Coordinate strings for SVG Paths
  const xCoords = [50, 160, 270, 380, 490, 600, 710]; // horizontal distribution
  
  const gabahPoints = activePoints.gabah.map((val, i) => `${xCoords[i]},${getSvgY(val, activePoints.yMax)}`).join(' ');
  const jagungPoints = activePoints.jagung.map((val, i) => `${xCoords[i]},${getSvgY(val, activePoints.yMax)}`).join(' ');

  const handlePrintReceipt = (trx: MemberTransaction) => {
    setShowPrintToast(true);
    setTimeout(() => {
      setShowPrintToast(false);
    }, 4000);
  };

  const handleDownloadReport = () => {
    alert('Mengunduh laporan PDF riwayat transaksi Bapak Suroto (Januari 2024 - Sekarang)...');
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-20">
      {/* Simulation Print Toast */}
      {showPrintToast && (
        <div className="fixed top-20 right-4 bg-[#065366] text-white px-5 py-3 rounded-xl shadow-lg border border-[#60d7ff] z-50 animate-bounce flex items-center gap-2">
          <Printer className="w-5 h-5 text-[#60d7ff]" />
          <span className="text-sm font-semibold">
            Mencetak struk thermal... (Simulasi cetak thermal printer sukses!)
          </span>
        </div>
      )}

      {/* Header back row */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackClick}
          className="text-[#003b49] hover:bg-[#eff4ff] p-2 rounded-full transition-colors flex items-center justify-center border border-[#bfc8cc]/40 bg-white shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#003b49] tracking-tight">
            Riwayat Transaksi: Bapak Suroto
          </h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="bg-[#60d7ff]/20 text-[#005c73] border border-[#006780]/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              ID: SKD-0412
            </span>
            <p className="text-xs text-[#40484c] font-semibold">
              Bergabung sejak Januari 2024 · Kelompok Tani Suka Makmur
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-3 rounded-2xl border border-[#bfc8cc] shadow-sm">
        {/* Date Filters tabs */}
        <div className="flex bg-[#f8f9ff] border border-[#bfc8cc]/40 p-1 rounded-xl shadow-inner w-full md:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setSelectedRange('minggu')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              selectedRange === 'minggu'
                ? 'bg-white text-[#003b49] shadow-sm'
                : 'text-[#40484c] hover:bg-white/40'
            }`}
          >
            Minggu ini
          </button>
          <button
            onClick={() => setSelectedRange('bulan')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              selectedRange === 'bulan'
                ? 'bg-white text-[#003b49] shadow-sm'
                : 'text-[#40484c] hover:bg-white/40'
            }`}
          >
            Bulan ini
          </button>
          <button
            onClick={() => alert('Fitur kalender kustom: memilih rentang tanggal.')}
            className="px-4 py-2 text-xs sm:text-sm font-bold rounded-lg text-[#40484c] hover:bg-white/40 flex items-center gap-1 transition-all"
          >
            Custom <Calendar className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Unit toggle (Berat vs Nilai) */}
        <div className="flex items-center gap-3 bg-[#f8f9ff] border border-[#bfc8cc]/40 px-3 py-1.5 rounded-xl shadow-inner w-full md:w-auto justify-between">
          <span className="text-xs font-bold text-[#40484c]">Satuan Tampilan:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setUnitMode('berat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unitMode === 'berat'
                  ? 'bg-[#006780] text-white shadow-sm'
                  : 'text-[#40484c] hover:bg-white'
              }`}
            >
              Berat (kg/ton)
            </button>
            <button
              onClick={() => setUnitMode('nilai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unitMode === 'nilai'
                  ? 'bg-[#006780] text-white shadow-sm'
                  : 'text-[#40484c] hover:bg-white'
              }`}
            >
              Nilai (Rp)
            </button>
          </div>
        </div>
      </section>

      {/* SVG Line Chart: Tren Produksi */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl border border-[#bfc8cc] shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#065366]">
              Tren Hasil Tani
            </h3>
            <p className="text-xs text-[#40484c] mt-0.5">
              Volume komoditas utama yang disetorkan ke koperasi ({selectedRange === 'minggu' ? 'Minggu ini' : 'Bulan ini'})
            </p>
          </div>
          <div className="flex gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#065366]" />
              <span className="text-[#40484c]">Gabah</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#0ca6cc]" />
              <span className="text-[#40484c]">Jagung</span>
            </div>
          </div>
        </div>

        {/* Custom SVG Responsive Line Chart */}
        <div className="w-full overflow-x-auto pt-2 pb-4">
          <div className="min-w-[650px] h-[220px] relative pr-4">
            <svg className="w-full h-full" viewBox="0 0 760 200">
              {/* Grid Lines */}
              <line stroke="#E2E8F0" strokeWidth="1" x1="40" x2="740" y1="20" y2="20" strokeDasharray="4" />
              <line stroke="#E2E8F0" strokeWidth="1" x1="40" x2="740" y1="60" y2="60" strokeDasharray="4" />
              <line stroke="#E2E8F0" strokeWidth="1" x1="40" x2="740" y1="100" y2="100" strokeDasharray="4" />
              <line stroke="#E2E8F0" strokeWidth="1" x1="40" x2="740" y1="140" y2="140" strokeDasharray="4" />
              <line stroke="#bfc8cc" strokeWidth="1" x1="40" x2="740" y1="180" y2="180" />

              {/* Y Axis Legend labels */}
              <text x="35" y="24" fill="#70787c" fontSize="10" fontWeight="bold" textAnchor="end">
                {unitMode === 'berat' ? '2.000' : '15jt'}
              </text>
              <text x="35" y="64" fill="#70787c" fontSize="10" fontWeight="bold" textAnchor="end">
                {unitMode === 'berat' ? '1.500' : '10jt'}
              </text>
              <text x="35" y="104" fill="#70787c" fontSize="10" fontWeight="bold" textAnchor="end">
                {unitMode === 'berat' ? '1.000' : '6jt'}
              </text>
              <text x="35" y="144" fill="#70787c" fontSize="10" fontWeight="bold" textAnchor="end">
                {unitMode === 'berat' ? '500' : '3jt'}
              </text>
              <text x="35" y="184" fill="#70787c" fontSize="10" fontWeight="bold" textAnchor="end">
                0
              </text>

              {/* Paths for Gabah (Deep Teal) */}
              <polyline
                fill="none"
                stroke="#065366"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={gabahPoints}
              />

              {/* Paths for Jagung (Electric Cyan) */}
              <polyline
                fill="none"
                stroke="#0ca6cc"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={jagungPoints}
                opacity="0.75"
              />

              {/* Dots and Tooltips */}
              {xCoords.map((x, i) => {
                const yGabah = getSvgY(activePoints.gabah[i], activePoints.yMax);
                const yJagung = getSvgY(activePoints.jagung[i], activePoints.yMax);

                return (
                  <g key={i}>
                    {/* Vertices indicator circles */}
                    <circle cx={x} cy={yGabah} r="4.5" fill="#065366" stroke="#fff" strokeWidth="2" className="cursor-pointer" />
                    <circle cx={x} cy={yJagung} r="4.5" fill="#0ca6cc" stroke="#fff" strokeWidth="2" className="cursor-pointer" />

                    {/* Miniature interactive floating value label above high points */}
                    {i === 5 && ( // Saturday Gabah Peak
                      <g>
                        <rect x={x - 24} y={yGabah - 25} width="48" height="16" rx="4" fill="#065366" />
                        <text x={x} y={yGabah - 14} fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">
                          {activePoints.gabah[i]}
                          {activePoints.unit}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* X Axis Legend labels */}
              <text x="50" y="196" fill="#70787c" fontSize="10" fontWeight="bold" textAnchor="middle">Sen</text>
              <text x="160" y="196" fill="#70787c" fontSize="10" fontWeight="bold" textAnchor="middle">Sel</text>
              <text x="270" y="196" fill="#70787c" fontSize="10" fontWeight="bold" textAnchor="middle">Rab</text>
              <text x="380" y="196" fill="#70787c" fontSize="10" fontWeight="bold" textAnchor="middle">Kam</text>
              <text x="490" y="196" fill="#70787c" fontSize="10" fontWeight="bold" textAnchor="middle">Jum</text>
              <text x="600" y="196" fill="#70787c" fontSize="10" fontWeight="bold" textAnchor="middle">Sab</text>
              <text x="710" y="196" fill="#70787c" fontSize="10" fontWeight="bold" textAnchor="middle">Min</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Detail Transaksi Table Card */}
      <section className="bg-white rounded-2xl border border-[#bfc8cc] shadow-sm overflow-hidden">
        {/* Table Header Row with Search and PDF button */}
        <div className="p-4 sm:p-5 border-b border-[#bfc8cc]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f8f9ff]">
          <h3 className="text-base sm:text-lg font-bold text-[#065366]">
            Rincian Detail Transaksi
          </h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 bg-white border border-[#bfc8cc] rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold focus:border-[#003b49] focus:ring-1 focus:ring-[#003b49]/10 outline-none transition-all"
              />
              <Search className="w-4 h-4 text-[#70787c] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadReport}
              className="px-4 py-2 text-xs font-bold text-[#006780] hover:bg-[#eff4ff] border border-[#bfc8cc] rounded-xl flex items-center justify-center gap-1.5 bg-white shadow-sm transition-all active:scale-95 shrink-0"
            >
              Unduh Laporan <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table element */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#eff4ff]/60 border-b border-[#bfc8cc]/40 text-xs font-bold text-[#065366]">
                <th className="px-5 py-3.5">ID & Tanggal</th>
                <th className="px-5 py-3.5">Komoditas</th>
                <th className="px-5 py-3.5">Kuantitas</th>
                <th className="px-5 py-3.5">Harga/Satuan</th>
                <th className="px-5 py-3.5">Total Nilai</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bfc8cc]/40 text-sm">
              {filteredTrx.map((trx) => (
                <tr
                  key={trx.id}
                  onClick={() => setSelectedTrx(trx)}
                  className="hover:bg-[#eff4ff]/25 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-[#003b49] group-hover:underline">{trx.id}</div>
                    <div className="text-[11px] text-[#70787c] mt-0.5 font-semibold">{trx.date}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 font-bold text-[#0b1c30]">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          trx.commodity === 'Gabah' ? 'bg-[#065366]' : 'bg-[#0ca6cc]'
                        }`}
                      />
                      {trx.commodity}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#0b1c30]">
                    {trx.quantityKg.toLocaleString('id-ID')} kg
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-[#40484c]">
                    {formatRupiah(trx.pricePerKg)}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-[#003b49]">
                    {formatRupiah(trx.totalValue)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        trx.status === 'SELESAI'
                          ? 'bg-[#dcfce7] text-[#15803d]'
                          : 'bg-[#eff4ff] text-[#006780] animate-pulse'
                      }`}
                    >
                      {trx.status === 'SELESAI' ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Selesai
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> Berjalan
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* See All static footer */}
        <div className="p-3 bg-[#eff4ff]/20 flex justify-center border-t border-[#bfc8cc]/40">
          <button
            onClick={() => alert('Menampilkan semua transaksi histori...')}
            className="text-xs font-bold text-[#003b49] hover:text-[#005c73] transition-colors"
          >
            Lihat Semua Riwayat Anggota
          </button>
        </div>
      </section>

      {/* HIGH-FIDELITY TRANSACTION DETAILS MODAL OVERLAY */}
      {selectedTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur clickoff */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTrx(null)}
          />

          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#bfc8cc]/80 z-10 animate-fade-in flex flex-col max-h-[90vh]">
            {/* Modal Title bar */}
            <div className="p-5 border-b border-[#bfc8cc]/60 flex justify-between items-center bg-[#f8f9ff]">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-[#003b49]">
                  Nota Timbangan: {selectedTrx.id}
                </h3>
                <p className="text-[10px] font-semibold text-[#70787c] mt-0.5">
                  Tervalidasi Digital Gateway - Koperasi Desa Sumberrejo
                </p>
              </div>
              <button
                onClick={() => setSelectedTrx(null)}
                className="p-1 hover:bg-[#ffdad6] rounded-full transition-colors group"
                aria-label="Tutup"
              >
                <X className="w-5 h-5 text-[#40484c] group-hover:text-[#ba1a1a]" />
              </button>
            </div>

            {/* Modal Scrollable Contents */}
            <div className="p-5 flex flex-col gap-5 overflow-y-auto">
              {/* Shipping Information Section */}
              <section>
                <h4 className="text-xs font-bold text-[#40484c] mb-3 uppercase tracking-wider border-b border-[#bfc8cc]/30 pb-1">
                  Informasi Serah-Terima
                </h4>
                <div className="flex flex-col gap-2.5 text-xs font-semibold text-[#0b1c30]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">📅</span>
                    <div>
                      <p className="text-[10px] text-[#70787c] uppercase">Tanggal Setor</p>
                      <p>{selectedTrx.date} · 09:42 WIB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">📍</span>
                    <div>
                      <p className="text-[10px] text-[#70787c] uppercase">Geotag Lokasi</p>
                      <p>{selectedTrx.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">👤</span>
                    <div>
                      <p className="text-[10px] text-[#70787c] uppercase">Staf Penerima Lapangan</p>
                      <p>{selectedTrx.handler}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Product Details Section */}
              <section>
                <h4 className="text-xs font-bold text-[#40484c] mb-3 uppercase tracking-wider border-b border-[#bfc8cc]/30 pb-1">
                  Rincian Pembukuan Hasil Bumi
                </h4>
                <div className="bg-[#eff4ff]/60 p-4 rounded-xl border border-[#bfc8cc]/40 flex justify-between items-center shadow-inner">
                  <div>
                    <p className="font-bold text-sm text-[#003b49]">
                      Komoditas {selectedTrx.commodity}
                    </p>
                    <p className="text-xs text-[#40484c] mt-0.5 font-semibold">
                      Harga Beli: {formatRupiah(selectedTrx.pricePerKg)} / kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-[#003b49] text-base">
                      {selectedTrx.quantityKg.toLocaleString('id-ID')} kg
                    </p>
                    <p className="text-sm font-extrabold text-[#006780] mt-0.5">
                      {formatRupiah(selectedTrx.totalValue)}
                    </p>
                  </div>
                </div>
              </section>

              {/* Status Banner */}
              <div className="bg-[#f8f9ff] border border-[#bfc8cc]/40 p-3.5 rounded-xl flex items-start gap-2 text-xs text-[#40484c]">
                <Info className="w-4 h-4 text-[#006780] shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">
                  Transaksi ini telah disahkan oleh timbangan digital tim desa dan dana ditransfer ke tabungan anggota {selectedTrx.id} secara penuh.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[#f8f9ff] border-t border-[#bfc8cc]/60 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedTrx(null)}
                className="px-4 py-2 font-bold text-xs text-[#40484c] hover:bg-gray-200 rounded-xl transition-colors bg-white border border-[#bfc8cc]/60"
              >
                Tutup
              </button>
              <button
                onClick={() => handlePrintReceipt(selectedTrx)}
                className="px-4 py-2 font-bold text-xs bg-[#003b49] text-white rounded-xl hover:bg-[#005c73] transition-colors flex items-center gap-1.5 shadow-md shadow-[#003b49]/10"
              >
                <Printer className="w-4 h-4 text-[#60d7ff]" />
                Cetak Bukti Struk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
