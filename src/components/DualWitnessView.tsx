import React, { useState } from 'react';
import { Send, Phone, AlertTriangle, CheckCircle, Clock, MapPin, Info, Lock, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';
import { EscrowTransaction } from '../types';

interface DualWitnessViewProps {
  transactions: EscrowTransaction[];
  onUpdateTransaction: (updated: EscrowTransaction) => void;
  onEscalateDispute: (id: string) => void;
}

export default function DualWitnessView({
  transactions,
  onUpdateTransaction,
  onEscalateDispute,
}: DualWitnessViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>('TRX-0712-018');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleSendReminder = (trx: EscrowTransaction, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...trx, remindersSent: trx.remindersSent + 1 };
    onUpdateTransaction(updated);
    showToast(`Pengingat WhatsApp ke-${updated.remindersSent} berhasil dikirim ke pengurus ${trx.receiver}!`);
  };

  const handleSimulateReceiverConfirm = (trx: EscrowTransaction, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = {
      ...trx,
      receiverConfirmed: true,
      timePending: 'Selesai',
    };
    onUpdateTransaction(updated);
    showToast(`Transaksi Selesai! Dana ${formatRupiah(trx.amount)} telah dicairkan dari Escrow ke ${trx.sender}.`);
  };

  const handleCallManager = (trx: EscrowTransaction, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`Menghubungi pengurus ${trx.receiver} via WA Call... (+62 813-5599-2192)`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-20">
      {/* Interactive Toast Feedbacks */}
      {toastMessage && (
        <div className="fixed top-20 right-4 bg-[#065366] text-white px-5 py-3.5 rounded-xl shadow-lg border border-[#60d7ff] z-50 animate-fade-in flex items-center gap-3 max-w-sm sm:max-w-md">
          <Info className="w-5 h-5 text-[#60d7ff] shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-[#bfc8cc] p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between shadow-sm bg-gradient-to-r from-white to-[#f8f9ff]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#003b49]">
            Status Dual-Witness Escrow
          </h2>
          <p className="text-xs text-[#40484c] mt-0.5">
            Pencairan dana aman terjamin hanya setelah pengirim (pengunggah bukti timbangan) dan penerima (gudang tujuan) mengonfirmasi transaksi.
          </p>
        </div>
        <div className="bg-[#eff4ff] text-[#006780] px-4 py-2 rounded-xl text-xs font-bold border border-[#bfc8cc]/30 shrink-0">
          Total Aktif: {transactions.filter(t => !t.receiverConfirmed).length} Item
        </div>
      </div>

      {/* Transaksi Cards Stack */}
      <div className="flex flex-col gap-4">
        {transactions.map((trx) => {
          const isExpanded = expandedId === trx.id;
          const isFinished = trx.receiverConfirmed;

          return (
            <article
              key={trx.id}
              onClick={() => !isFinished && setExpandedId(isExpanded ? null : trx.id)}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                isExpanded ? 'border-[#003b49] ring-2 ring-[#003b49]/10' : 'border-[#bfc8cc] hover:border-[#003b49]'
              } ${isFinished ? 'opacity-80' : 'cursor-pointer'}`}
            >
              {/* Card Title Banner */}
              <div className="p-4 sm:p-5 border-b border-[#bfc8cc]/60 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 bg-[#f8f9ff]">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-xs font-bold text-[#003b49] bg-[#eff4ff] border border-[#003b49]/20 px-2.5 py-1 rounded-lg">
                      {trx.id}
                    </span>
                    <span className="text-xs font-semibold text-[#40484c]">
                      • {trx.commodity}
                    </span>
                    {trx.isDisputed && (
                      <span className="text-[10px] bg-[#ffdad6] text-[#ba1a1a] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Sengketa Aktif
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-sm sm:text-base text-[#0b1c30] flex items-center gap-2">
                    {trx.sender}{' '}
                    <span className="text-xs text-[#70787c] font-normal">→</span>{' '}
                    {trx.receiver}
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-lg sm:text-xl font-extrabold text-[#003b49]">
                    {formatRupiah(trx.amount)}
                  </div>
                  {!isFinished ? (
                    <div className="inline-flex items-center gap-1 bg-[#fef3c7] text-[#b45309] px-2.5 py-1 rounded-full text-xs font-bold mt-1.5 border border-[#fef3c7]/60">
                      <Clock className="w-3.5 h-3.5" />
                      {trx.timePending}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#15803d] px-2.5 py-1 rounded-full text-xs font-bold mt-1.5">
                      <Check className="w-3.5 h-3.5" />
                      Tuntas Cair
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && !isFinished && (
                <div className="divide-y divide-[#bfc8cc]/60">
                  {/* Status checklist Columns */}
                  <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                    {/* SENDER STATUS */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#bfc8cc]/30">
                        <h4 className="text-xs font-bold text-[#40484c] uppercase tracking-wider">
                          Pengirim: {trx.sender}
                        </h4>
                        <div className="flex items-center text-[#15803d] gap-1 text-xs font-bold bg-[#dcfce7] px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5 fill-[#dcfce7]" />
                          Terkonfirmasi via WA
                        </div>
                      </div>
                      <p className="text-[10px] text-[#70787c] font-medium">
                        Diunggah: {trx.senderConfirmTime}
                      </p>

                      <div className="flex gap-4 items-center mt-1">
                        {trx.senderPhoto ? (
                          <div className="w-16 h-16 rounded-xl border border-[#bfc8cc]/60 overflow-hidden shrink-0 shadow-inner">
                            <img
                              src={trx.senderPhoto}
                              alt="Muatan Gabah"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-[#eff4ff] border border-[#bfc8cc]/30 flex items-center justify-center text-[#003b49] shrink-0">
                            <Info className="w-6 h-6" />
                          </div>
                        )}
                        <div className="text-xs text-[#40484c] flex flex-col gap-1">
                          <span className="font-semibold flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-[#006780]" />
                            geotag: {trx.senderGeotag || '-8.21, 114.36'}
                          </span>
                          <span className="text-[10px] text-[#70787c]">
                            Lokasi penimbangan tervalidasi satelit GPS desa.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RECEIVER STATUS */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#bfc8cc]/30">
                        <h4 className="text-xs font-bold text-[#40484c] uppercase tracking-wider">
                          Penerima: {trx.receiver}
                        </h4>
                        <div className="flex items-center text-[#d97706] gap-1 text-xs font-bold bg-[#fef3c7] px-2.5 py-0.5 rounded-full animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          Belum konfirmasi
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 justify-center h-full">
                        <div className="text-xs text-[#40484c] bg-[#eff4ff]/60 p-3 rounded-xl border border-dashed border-[#006780]/30 flex items-start gap-2.5">
                          <Info className="w-4 h-4 text-[#006780] mt-0.5 shrink-0" />
                          <div>
                            <span className="font-bold">Pengingat otomatis terkirim {trx.remindersSent}x.</span>
                            <p className="text-[10px] text-[#70787c] mt-0.5">
                              Sistem WA bot otomatis menyisir gudang Argosari setiap 12 jam.
                            </p>
                          </div>
                        </div>

                        {/* Interactive Simulation Bypass */}
                        <button
                          onClick={(e) => handleSimulateReceiverConfirm(trx, e)}
                          className="w-full bg-[#15803d] text-white font-bold text-xs px-3 py-2 rounded-lg hover:bg-[#166534] transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95 border border-[#166534]"
                        >
                          <Check className="w-4 h-4" />
                          Konfirmasi manual (Simulasi Pengurus Gudang)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="p-4 bg-[#f8f9ff] flex flex-wrap gap-3 items-center">
                    <button
                      onClick={(e) => handleSendReminder(trx, e)}
                      className="bg-[#003b49] text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#005c73] transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Kirim pengingat WA
                    </button>
                    <button
                      onClick={(e) => handleCallManager(trx, e)}
                      className="border border-[#003b49] text-[#003b49] bg-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-[#eff4ff] transition-all"
                    >
                      Hubungi pengurus {trx.receiver.replace('Kop. ', '')}
                    </button>

                    {!trx.isDisputed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEscalateDispute(trx.id);
                          showToast(`Sengketa berhasil diaktifkan untuk transaksi ${trx.id}. Dana escrow dikunci super-aman.`);
                        }}
                        className="text-[#ba1a1a] hover:bg-[#ffdad6]/40 font-bold text-xs px-3 py-2 rounded-lg transition-colors ml-auto flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Eskalasi ke sengketa
                      </button>
                    )}
                  </div>

                  {/* Block Metadata Footer */}
                  <div className="p-3 px-5 bg-white border-t border-[#bfc8cc]/40 text-[11px] text-[#40484c] flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#70787c]" />
                    <span className="font-medium">
                      Escrow ID {trx.escrowId} · dana dikunci aman di gerbang bank PJP · hash blockchain desa {trx.hashLedger}
                    </span>
                  </div>
                </div>
              )}

              {/* Collapsed state row indicator (when not expanded) */}
              {!isExpanded && !isFinished && (
                <div className="px-5 py-3 border-t border-[#bfc8cc]/30 flex justify-between items-center bg-white text-xs text-[#40484c] hover:bg-[#eff4ff]/20">
                  <span className="font-semibold flex items-center gap-1 text-[#006780]">
                    <Clock className="w-3.5 h-3.5" /> Klik untuk memperluas info pengiriman & lampiran foto
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#70787c]" />
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Bottom Info Strip Warning */}
      <div className="bg-[#d3ef69]/40 text-[#2f3a00] border border-[#d3ef69] rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm font-medium">
        <Info className="w-5 h-5 text-[#2f3a00] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Protokol Keamanan Dual-Witness:</span> Konfirmasi timbangan digital wajib menyertakan foto muatan fisik real-time serta koordinat GPS (geotag) yang tervalidasi sistem satelit guna menghindari kolusi laporan fiktif.
        </div>
      </div>
    </div>
  );
}
