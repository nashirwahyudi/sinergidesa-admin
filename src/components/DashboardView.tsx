import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Gavel, ArrowRight, Truck, Lock, ArrowUpRight, CheckCircle2, ChevronRight, Check, Package, ArrowRightLeft, Building2, Eye } from 'lucide-react';
import { ActionItem, MetricCard, AvailableSupply, NeededGood } from '../types';

interface DashboardViewProps {
  actionItems: ActionItem[];
  metrics: MetricCard[];
  availableSupplies: AvailableSupply[];
  neededGoods: NeededGood[];
  onActionClick: (actionKey: 'dual_witness' | 'dispute') => void;
  onSendSupply: (supplyId: string, name: string) => void;
  onFulfillNeed: (needId: string, name: string) => void;
  pipelineData: {
    incoming: number;
    pending: number;
    ready: number;
  };
}

export default function DashboardView({
  actionItems,
  metrics,
  availableSupplies,
  neededGoods,
  onActionClick,
  onSendSupply,
  onFulfillNeed,
  pipelineData,
}: DashboardViewProps) {
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleSendSupplyClick = (sup: AvailableSupply) => {
    onSendSupply(sup.id, sup.name);
    setSuccessToast(`Logistik keberangkatan "${sup.name}" sedang disiapkan menuju ${sup.destinationKoperasi}!`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleFulfillNeedClick = (need: NeededGood) => {
    onFulfillNeed(need.id, need.name);
    setSuccessToast(`Penawaran pemenuhan komoditas "${need.name}" berhasil dikirimkan ke pihak ${need.requesterKoperasi}!`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-20">
      {/* Dynamic Success Toast */}
      {successToast && (
        <div className="fixed top-20 right-4 bg-[#003b49] text-white px-5 py-3.5 rounded-xl shadow-lg border border-[#60d7ff] z-50 animate-bounce flex items-center gap-2 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-[#60d7ff] shrink-0" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* "Perlu tindakan hari ini" Card */}
      <section className="bg-white rounded-2xl border border-[#bfc8cc] overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#bfc8cc]/60 flex items-center justify-between bg-[#f8f9ff]">
          <h2 className="text-base sm:text-lg font-bold text-[#003b49] flex items-center gap-2">
            Perlu tindakan hari ini
          </h2>
          <span className="bg-[#ba1a1a] text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            {actionItems.length} ITEM
          </span>
        </div>

        {actionItems.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#15803d]">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-[#003b49] text-lg">Semua Tugas Selesai!</h3>
            <p className="text-[#40484c] text-sm max-w-md">
              Koperasi SinergiDesa berjalan lancar hari ini. Tidak ada tindakan darurat yang diperlukan.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#bfc8cc]/60">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-[#eff4ff]/30 transition-colors gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`rounded-full p-2.5 flex items-center justify-center shrink-0 shadow-sm ${
                      item.type === 'warning'
                        ? 'bg-[#fef3c7] text-[#d97706]'
                        : item.type === 'error'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : 'bg-[#dce9ff] text-[#006780]'
                    }`}
                  >
                    {item.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                    {item.type === 'error' && <AlertCircle className="w-5 h-5" />}
                    {item.type === 'gavel' && <Gavel className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#0b1c30]">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#40484c] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onActionClick(item.actionKey)}
                  className="shrink-0 font-bold text-xs sm:text-sm text-[#003b49] border-2 border-[#003b49] px-4 py-2 rounded-xl hover:bg-[#003b49] hover:text-white transition-all shadow-sm active:scale-95"
                >
                  {item.buttonText}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Metric Row Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 flex flex-col border border-[#bfc8cc] shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <p className="text-xs sm:text-sm font-semibold text-[#40484c]">
              {metric.title}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#003b49] mt-2 tracking-tight">
              {metric.value}
            </p>
            <p
              className={`text-xs font-bold mt-auto pt-4 flex items-center gap-1 ${
                metric.isPositive
                  ? 'text-[#006780]'
                  : metric.isWarning
                    ? 'text-[#d97706]'
                    : 'text-[#40484c]'
              }`}
            >
              {metric.isPositive && <ArrowUpRight className="w-3.5 h-3.5" />}
              {metric.subValue}
            </p>
          </div>
        ))}
      </section>

      {/* Pipeline Escrow Row Section */}
      <section className="bg-white rounded-2xl border border-[#bfc8cc] p-5 flex flex-col shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-[#003b49] mb-4 flex items-center gap-2">
          Pipeline Escrow Transaksi SinergiDesa
        </h2>
        <p className="text-xs text-[#40484c] -mt-2 mb-6 font-medium">
          Status dana yang saat ini ditampung secara aman pada ledger digital sebelum dicairkan ke kelompok tani / koperasi penyuplai
        </p>

        <div className="flex flex-col lg:flex-row items-center justify-between mb-4 gap-4">
          {/* Step 1: Dana Masuk */}
          <div className="bg-[#eff4ff] text-[#006780] p-4 rounded-xl flex flex-col items-center w-full lg:flex-1 text-center border border-[#bfc8cc]/30 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider">1. Dana Masuk Escrow</span>
            <span className="text-2xl sm:text-3xl font-extrabold mt-2 text-[#003b49]">
              {pipelineData.incoming} Transaksi
            </span>
            <span className="text-[10px] text-gray-500 mt-1">Pembeli telah menyetorkan dana</span>
          </div>

          <ChevronRight className="text-[#bfc8cc] w-6 h-6 shrink-0 rotate-90 lg:rotate-0" />

          {/* Step 2: Tunggu Konfirmasi */}
          <div className="bg-[#fef3c7] text-[#d97706] p-4 rounded-xl flex flex-col items-center w-full lg:flex-1 text-center border border-[#bfc8cc]/30 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider">2. Menunggu Verifikasi</span>
            <span className="text-2xl sm:text-3xl font-extrabold mt-2 text-[#b45309]">
              {pipelineData.pending} Transaksi
            </span>
            <span className="text-[10px] text-amber-700 mt-1">Barang dikirim & ditimbang</span>
          </div>

          <ChevronRight className="text-[#bfc8cc] w-6 h-6 shrink-0 rotate-90 lg:rotate-0" />

          {/* Step 3: Siap Cair */}
          <div className="bg-[#dcfce7] text-[#15803d] p-4 rounded-xl flex flex-col items-center w-full lg:flex-1 text-center border border-[#bfc8cc]/30 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider">3. Siap Pencairan</span>
            <span className="text-2xl sm:text-3xl font-extrabold mt-2 text-[#16a34a]">
              {pipelineData.ready} Transaksi
            </span>
            <span className="text-[10px] text-green-700 mt-1">Selesai verifikasi timbangan</span>
          </div>
        </div>

        <div className="border-t border-[#bfc8cc]/60 pt-4 mt-2">
          <p className="text-xs text-[#40484c] text-center font-semibold">
            🛡️ Proteksi Kontrak Pintar Koperasi: Rata-rata pencairan selesai dalam 1,4 hari setelah validasi dual-witness.
          </p>
        </div>
      </section>

      {/* New Row Grid: Barang Tersedia / Ditawarkan (Supply) & Barang Dibutuhkan (Demand) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Barang Tersedia / Ditawarkan */}
        <div className="bg-white rounded-2xl border border-[#bfc8cc] flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#bfc8cc]/60 bg-[#f8f9ff] flex justify-between items-center">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#003b49] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#006780]" /> Barang Tersedia / Ditawarkan
              </h2>
              <p className="text-xs text-[#40484c] mt-0.5 font-medium">
                Daftar pasokan koperasi siap jual atau dikirim ke pembeli koperasi mitra
              </p>
            </div>
            <span className="bg-[#eff4ff] text-[#003b49] text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
              {availableSupplies.length} Unit Supply
            </span>
          </div>

          {availableSupplies.length === 0 ? (
            <div className="p-8 text-center text-[#40484c] flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-[#eff4ff] rounded-full flex items-center justify-center text-[#003b49]">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#003b49]">Semua supply telah diproses</p>
              <p className="text-xs">
                Koperasi belum memasukkan daftar supply komoditas ditawarkan saat ini.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#bfc8cc]/60 flex-grow">
              {availableSupplies.map((sup) => (
                <div
                  key={sup.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-[#eff4ff]/30 transition-all gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-[#eff4ff] p-2.5 rounded-xl border border-[#bfc8cc]/30 text-[#003b49] mt-0.5">
                      <ArrowRightLeft className="w-5 h-5 text-[#006780]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[#0b1c30]">
                        {sup.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap text-xs font-semibold text-[#40484c]">
                        <span className="text-[#006780] font-extrabold">{sup.quantity}</span>
                        <span className="text-gray-300">|</span>
                        <span>{formatRupiah(sup.price)} / kg</span>
                        <span className="text-gray-300">|</span>
                        <span className="inline-flex items-center gap-1 text-gray-500">
                          <Building2 className="w-3.5 h-3.5" /> {sup.destinationKoperasi}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        sup.status === 'Siap Kirim'
                          ? 'bg-[#fef3c7] text-[#b45309]'
                          : sup.status === 'Terkirim'
                            ? 'bg-[#dcfce7] text-[#16a34a]'
                            : 'bg-[#dce9ff] text-[#006780]'
                      }`}
                    >
                      {sup.status}
                    </span>
                    {sup.status !== 'Terkirim' && (
                      <button
                        onClick={() => handleSendSupplyClick(sup)}
                        className="bg-[#003b49] text-white hover:bg-[#005c73] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors active:scale-95 shadow-sm"
                      >
                        Kirim Muatan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Barang Dibutuhkan */}
        <div className="bg-white rounded-2xl border border-[#bfc8cc] flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#bfc8cc]/60 bg-[#f8f9ff] flex justify-between items-center">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#003b49] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#b45309]" /> Barang Dibutuhkan
              </h2>
              <p className="text-xs text-[#40484c] mt-0.5 font-medium">
                Daftar kebutuhan komoditas koperasi lain yang siap kita penuhi
              </p>
            </div>
            <span className="bg-[#fef3c7] text-[#b45309] text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
              {neededGoods.length} Permintaan
            </span>
          </div>

          {neededGoods.length === 0 ? (
            <div className="p-8 text-center text-[#40484c] flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#b45309]">Tidak ada permintaan saat ini</p>
              <p className="text-xs">
                Semua kebutuhan koperasi mitra desa telah terpenuhi dengan baik.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#bfc8cc]/60 flex-grow">
              {neededGoods.map((need) => (
                <div
                  key={need.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-[#eff4ff]/30 transition-all gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-700 mt-0.5">
                      <Package className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[#0b1c30]">
                        {need.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap text-xs font-semibold text-[#40484c]">
                        <span className="text-[#b45309] font-extrabold">Kebutuhan: {need.quantityNeeded}</span>
                        <span className="text-gray-300">|</span>
                        <span>Target: {formatRupiah(need.targetPrice)}</span>
                        <span className="text-gray-300">|</span>
                        <span className="inline-flex items-center gap-1 text-gray-500">
                          <Building2 className="w-3.5 h-3.5" /> Peminta: {need.requesterKoperasi}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        need.urgency === 'Tinggi'
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : need.urgency === 'Sedang'
                            ? 'bg-[#fef3c7] text-[#b45309]'
                            : 'bg-gray-100 text-[#40484c]'
                      }`}
                    >
                      Urgensi: {need.urgency}
                    </span>
                    <button
                      onClick={() => handleFulfillNeedClick(need)}
                      className="bg-[#003b49] text-white hover:bg-[#005c73] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors active:scale-95 shadow-sm border border-[#003b49]"
                    >
                      Penuhi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
