import React, { useState } from 'react';
import { MessageSquare, CheckCircle, AlertCircle, HelpCircle, ArrowRight, CornerDownRight, Check, X } from 'lucide-react';
import { RawSms } from '../types';

interface MessageCorrectionViewProps {
  smsList: RawSms[];
  onCorrectSms: (id: string, updatedData: Partial<RawSms>) => void;
  onSendClarification: (phone: string, name: string) => void;
}

export default function MessageCorrectionView({
  smsList,
  onCorrectSms,
  onSendClarification,
}: MessageCorrectionViewProps) {
  // Local form states to make input edits interactive
  const [formStates, setFormStates] = useState<Record<string, {
    action: 'JUAL' | 'BELI';
    commodity: string;
    quantity: string;
    price: string;
  }>>(() => {
    const initial: Record<string, any> = {};
    smsList.forEach(sms => {
      initial[sms.id] = {
        action: sms.action,
        commodity: sms.commodity,
        quantity: sms.quantity,
        price: sms.pricePerKg
      };
    });
    return initial;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleInputChange = (id: string, field: string, value: string) => {
    setFormStates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSave = (sms: RawSms) => {
    const stateValues = formStates[sms.id];
    if (!stateValues) return;

    onCorrectSms(sms.id, {
      action: stateValues.action,
      commodity: stateValues.commodity,
      quantity: stateValues.quantity,
      pricePerKg: stateValues.price,
      isCorrected: true
    });

    setToastMessage(`Sukses! Pesan SMS dari ${sms.senderName} berhasil dikoreksi dan dicatat ke pembukuan koperasi.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleWAClarification = (sms: RawSms) => {
    onSendClarification(sms.senderPhone, sms.senderName);
    setToastMessage(`WhatsApp terkirim ke ${sms.senderName} (+62 812-****-4432) untuk meminta format ulang pesan.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full pb-20">
      {/* Alert toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 bg-[#003b49] text-white px-5 py-3.5 rounded-xl shadow-lg border border-[#60d7ff] z-50 animate-bounce flex items-center gap-3">
          <Check className="w-5 h-5 text-[#60d7ff]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Info Header */}
      <div className="bg-white rounded-2xl border border-[#bfc8cc] p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#003b49]">
            Antrean Koreksi Pesan SMS Gateway ({smsList.filter(s => !s.isCorrected).length})
          </h2>
          <p className="text-xs text-[#40484c] mt-0.5">
            Sistem SMS gateway menyaring laporan jual-beli komoditas petani. Pesan yang gagal diparse otomatis karena kesalahan ketik wajib disesuaikan manual oleh pengurus inti.
          </p>
        </div>
        <div className="bg-[#ffdad6] text-[#ba1a1a] px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" /> Butuh Tindakan
        </div>
      </div>

      {/* SMS Correction Cards List */}
      {smsList.filter(s => !s.isCorrected).length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#bfc8cc] p-12 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#15803d]">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-[#003b49] text-lg">Semua SMS Berhasil Diparse!</h3>
          <p className="text-[#40484c] text-sm max-w-md">
            Tidak ada pesan gagal hari ini. SMS gateway koperasi mendeteksi semua laporan jual-beli komoditas dengan akurasi 100%.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {smsList
            .filter((sms) => !sms.isCorrected)
            .map((sms) => {
              const currentForm = formStates[sms.id] || {
                action: sms.action,
                commodity: sms.commodity,
                quantity: sms.quantity,
                price: sms.pricePerKg,
              };

              // Check if typo detected
              const hasTypo = !!sms.typoDetected;

              return (
                <article
                  key={sms.id}
                  className="bg-white border border-[#bfc8cc] rounded-2xl flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Top Section: Raw Message Block */}
                  <div className="p-4 sm:p-5 border-b border-[#bfc8cc]/60 bg-[#eff4ff]/40">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-grow">
                        {/* Raw string badge bubble */}
                        <div className="bg-slate-100 border border-[#bfc8cc]/60 rounded-xl p-3 font-mono text-xs sm:text-sm text-[#003b49] mb-3 overflow-x-auto shadow-inner bg-gradient-to-r from-gray-50 to-slate-100 flex items-center gap-2">
                          <CornerDownRight className="w-4 h-4 text-[#006780] shrink-0" />
                          <span>{sms.rawText}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 text-xs text-[#40484c] font-semibold">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[#006780]">👤</span> Pengirim: {sms.senderPhone} ({sms.senderName})
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[#006780]">📅</span> Diterima: {sms.receivedTime}
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#ffdad6] text-[#ba1a1a] px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs whitespace-nowrap self-start border border-[#ffdad6]">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Gagal Parse
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: Actionable Inputs Form */}
                  <div className="p-4 sm:p-5 flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Action Option Select */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#40484c] uppercase tracking-wider">
                          Aksi Transaksi
                        </label>
                        <select
                          value={currentForm.action}
                          onChange={(e) => handleInputChange(sms.id, 'action', e.target.value)}
                          className="w-full bg-[#f8f9ff] border border-[#bfc8cc] rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] font-semibold focus:border-[#003b49] focus:ring-2 focus:ring-[#003b49]/10 outline-none transition-all cursor-pointer"
                        >
                          <option value="JUAL">JUAL (Petani Jual ke Kop)</option>
                          <option value="BELI">BELI (Petani Beli dari Kop)</option>
                        </select>
                      </div>

                      {/* Commodity Input with warning typo indicator */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#40484c] uppercase tracking-wider">
                          Komoditas
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={currentForm.commodity}
                            onChange={(e) => handleInputChange(sms.id, 'commodity', e.target.value)}
                            className={`w-full bg-[#f8f9ff] border rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] font-semibold focus:border-[#003b49] focus:ring-2 focus:ring-[#003b49]/10 outline-none transition-all ${
                              hasTypo ? 'border-[#ba1a1a]/50 text-[#ba1a1a]' : 'border-[#bfc8cc]'
                            }`}
                          />
                          {hasTypo && (
                            <div className="text-[10px] text-[#ba1a1a] mt-1 flex items-center gap-1 font-bold">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              typo terdeteksi di SMS: "{sms.typoDetected}"
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#40484c] uppercase tracking-wider">
                          Kuantitas (Volume)
                        </label>
                        <input
                          type="text"
                          value={currentForm.quantity}
                          onChange={(e) => handleInputChange(sms.id, 'quantity', e.target.value)}
                          className="w-full bg-[#f8f9ff] border border-[#bfc8cc] rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] font-semibold focus:border-[#003b49] focus:ring-2 focus:ring-[#003b49]/10 outline-none transition-all"
                        />
                      </div>

                      {/* Price Per Unit Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#40484c] uppercase tracking-wider">
                          Harga Satuan (Per kg)
                        </label>
                        <input
                          type="text"
                          value={currentForm.price}
                          onChange={(e) => handleInputChange(sms.id, 'price', e.target.value)}
                          className="w-full bg-[#f8f9ff] border border-[#bfc8cc] rounded-xl px-3 py-2.5 text-sm text-[#0b1c30] font-semibold focus:border-[#003b49] focus:ring-2 focus:ring-[#003b49]/10 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Action buttons row */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2 border-t border-[#bfc8cc]/30 pt-4">
                      <button
                        onClick={() => handleWAClarification(sms)}
                        className="px-4 py-2.5 rounded-xl border border-[#003b49] text-[#003b49] font-bold text-xs hover:bg-[#eff4ff] transition-colors flex items-center justify-center gap-1.5 bg-white shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Balas minta ulang via WA
                      </button>
                      <button
                        onClick={() => handleSave(sms)}
                        className="px-4 py-2.5 rounded-xl bg-[#003b49] text-white font-bold text-xs hover:bg-[#005c73] transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#003b49]/10"
                      >
                        <CheckCircle className="w-4 h-4 text-[#60d7ff]" />
                        Simpan & catat ke ledger
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      )}
    </div>
  );
}
