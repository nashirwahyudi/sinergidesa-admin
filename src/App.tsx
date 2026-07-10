import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import DualWitnessView from './components/DualWitnessView';
import MessageCorrectionView from './components/MessageCorrectionView';
import MemberHistoryView from './components/MemberHistoryView';
import MarketplaceView from './components/MarketplaceView';
import { ActiveTab, ActionItem, EscrowTransaction, RawSms, MemberTransaction, ReturnTripOpportunity, TruckFleet, MetricCard, MarketplaceProduct, AvailableSupply, NeededGood } from './types';
import {
  initialActionItems,
  initialEscrowTransactions,
  initialRawSms,
  initialMemberTransactions,
  initialReturnTripOpportunities,
  initialTruckFleets,
  initialMarketplaceProducts,
  initialAvailableSupplies,
  initialNeededGoods
} from './mockData';
import { Info, Truck, Check, ShieldCheck, MapPin, Users, HelpCircle, FileText, Settings, Bell, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation States
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');
  const [activeSubTab, setActiveSubTab] = useState<'dual_witness' | 'sms_correction'>('dual_witness');
  const [viewMode, setViewMode] = useState<'marketplace' | 'dashboard'>('marketplace');
  
  // Simulation Database States
  const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>(initialMarketplaceProducts);
  const [availableSupplies, setAvailableSupplies] = useState<AvailableSupply[]>(initialAvailableSupplies);
  const [neededGoods, setNeededGoods] = useState<NeededGood[]>(initialNeededGoods);
  const [escrowTransactions, setEscrowTransactions] = useState<EscrowTransaction[]>(initialEscrowTransactions);
  const [smsList, setSmsList] = useState<RawSms[]>(initialRawSms);
  const [opportunities, setOpportunities] = useState<ReturnTripOpportunity[]>(initialReturnTripOpportunities);
  const [truckFleets, setTruckFleets] = useState<TruckFleet[]>(initialTruckFleets);
  const [memberTransactions, setMemberTransactions] = useState<MemberTransaction[]>(initialMemberTransactions);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  // Settings states
  const [gpsTolerance, setGpsTolerance] = useState('50 meter');
  const [autoSmsRetry, setAutoSmsRetry] = useState(true);
  const [waBotInterval, setWaBotInterval] = useState('12 jam');

  // Last Updated Simulation Timestamp
  const [lastUpdated, setLastUpdated] = useState('09.42 WIB');

  // Trigger simulated sync
  const handleRefresh = () => {
    const hours = new Date().getHours().toString().padStart(2, '0');
    const mins = new Date().getMinutes().toString().padStart(2, '0');
    setLastUpdated(`${hours}.${mins} WIB`);
  };

  // Helper to format currency
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Escalate a transaction to dispute
  const handleEscalateDispute = (trxId: string) => {
    setEscrowTransactions(prev =>
      prev.map(t => (t.id === trxId ? { ...t, isDisputed: true, timePending: 'Disengketakan' } : t))
    );
  };

  // Accept backhaul matching engine opportunity (used in Logistics tab view)
  const handleAcceptOpportunity = (oppId: string, route: string, savings: string) => {
    // 1. Remove opportunity from list
    setOpportunities(prev => prev.filter(o => o.id !== oppId));

    // 2. Dispatch the standby truck to perform this route
    setTruckFleets(prev => {
      let dispatched = false;
      return prev.map(truck => {
        if (!dispatched && truck.status === 'standby') {
          dispatched = true;
          return {
            ...truck,
            status: 'perjalanan',
            currentRoute: route,
            loadType: 'Muatan Balik (Kombinasi)'
          };
        }
        return truck;
      });
    });
  };

  const handleDeclineOpportunity = (oppId: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== oppId));
  };

  // Interactive Purchase Handler from Marketplace
  const handlePurchaseProduct = (product: MarketplaceProduct, qty: number) => {
    // 1. Update quantities in the marketplace catalog
    setMarketplaceProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        const currentQty = parseInt(p.quantity.replace(/[^0-9]/g, ''), 10) || 1000;
        const remaining = Math.max(0, currentQty - qty);
        return { ...p, quantity: `${remaining.toLocaleString('id-ID')} kg` };
      }
      return p;
    }));

    // 2. Insert into the live escrow pipeline
    const newTrxId = `TRX-${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    const newTrx: EscrowTransaction = {
      id: newTrxId,
      commodity: `${product.name} ${qty} kg`,
      sender: 'Koperasi Pembeli',
      receiver: 'Koperasi SinergiDesa',
      amount: product.price * qty,
      timePending: 'Baru masuk',
      timePendingHours: 0,
      senderConfirmed: true,
      senderConfirmTime: 'Hari ini',
      senderGeotag: '-8.21, 114.36',
      receiverConfirmed: false,
      remindersSent: 0,
      escrowId: `ESC-${Math.floor(1000 + Math.random() * 9000)}`,
      hashLedger: `#${Math.random().toString(16).substr(2, 4)}…${Math.random().toString(16).substr(2, 4)}`
    };
    setEscrowTransactions(prev => [newTrx, ...prev]);

    // 3. Inject into supply list as available supply
    const newSupply: AvailableSupply = {
      id: `sup-${Date.now()}`,
      name: product.name,
      quantity: `${qty.toLocaleString('id-ID')} kg`,
      price: product.price,
      destinationKoperasi: 'Koperasi Pembeli',
      status: 'Tersedia'
    };
    setAvailableSupplies(prev => [newSupply, ...prev]);
  };

  // Send supply to buyer
  const handleSendSupply = (supplyId: string, name: string) => {
    setAvailableSupplies(prev => prev.map(s => s.id === supplyId ? { ...s, status: 'Siap Kirim' as const } : s));
  };

  // Fulfill need of other cooperative
  const handleFulfillNeed = (needId: string, name: string) => {
    setNeededGoods(prev => prev.filter(n => n.id !== needId));
  };

  // Update a single escrow transaction status
  const handleUpdateTransaction = (updated: EscrowTransaction) => {
    setEscrowTransactions(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    
    // If receiver confirmed, let's append it to Suroto's transactions as finished for consistency
    if (updated.receiverConfirmed && updated.id === 'TRX-0712-018') {
      setMemberTransactions(prev =>
        prev.map(t => (t.id === 'TRX-0712-018' ? { ...t, status: 'SELESAI' } : t))
      );
    }
  };

  // Correct a failed SMS format
  const handleCorrectSms = (smsId: string, updatedData: Partial<RawSms>) => {
    setSmsList(prev => prev.map(s => (s.id === smsId ? { ...s, ...updatedData } : s)));

    // Extract numerical kg from string like "2.000 kg"
    const parsedKg = parseInt((updatedData.quantity || '0').replace(/[^0-9]/g, ''), 10) || 1000;
    const parsedPrice = parseInt((updatedData.pricePerKg || '0').replace(/[^0-9]/g, ''), 10) || 7200;

    // Simulate appending this newly recovered record into the Suroto's transaction log!
    if (smsId === 'sms-1') {
      const newLedgerRow: MemberTransaction = {
        id: `TRX-0712-022`,
        date: '10 Juli 2026',
        commodity: 'Gabah',
        quantityKg: parsedKg,
        pricePerKg: parsedPrice,
        totalValue: parsedKg * parsedPrice,
        status: 'SELESAI',
        location: 'Gudang SinergiDesa (Lat: -8.21, Long: 114.36)',
        handler: 'Admin Utama (Sistem Koreksi)'
      };
      setMemberTransactions(prev => [newLedgerRow, ...prev]);
    }
  };

  const handleSendWAClarification = (phone: string, name: string) => {
    console.log(`Clarification request sent to ${name} (${phone})`);
  };

  // REACTIVE CALCULATION: Action Items banner list
  const activeActionItems = useMemo(() => {
    const items: ActionItem[] = [];

    // Count pending dual-witness items
    const pendingDualWitnessCount = escrowTransactions.filter(t => !t.receiverConfirmed).length;
    if (pendingDualWitnessCount > 0) {
      items.push({
        id: 'act-1',
        type: 'warning',
        title: `${pendingDualWitnessCount} transaksi menunggu konfirmasi dual-witness`,
        description: `Terlama: kiriman gabah 2 ton ke Kop. Argosari, menunggu 26 jam`,
        buttonText: 'Lihat',
        actionKey: 'dual_witness'
      });
    }

    // Count uncorrected SMS logs
    const uncorrectedSmsCount = smsList.filter(s => !s.isCorrected).length;
    if (uncorrectedSmsCount > 0) {
      items.push({
        id: 'act-2',
        type: 'error',
        title: `${uncorrectedSmsCount} pesan gagal diparse, butuh koreksi manual`,
        description: `Format SMS tidak sesuai standar gateway: komoditas typo atau nilai hilang.`,
        buttonText: 'Koreksi',
        actionKey: 'sms_correction'
      });
    }

    // Check if there are disputes active
    const activeDisputesCount = escrowTransactions.filter(t => t.isDisputed).length;
    if (activeDisputesCount > 0) {
      items.push({
        id: 'act-3',
        type: 'gavel',
        title: `${activeDisputesCount} sengketa escrow aktif`,
        description: `Penerima menolak konfirmasi muatan karena berat tidak cocok · Dana ditahan di gerbang PJP`,
        buttonText: 'Tangani',
        actionKey: 'dispute'
      });
    }

    return items;
  }, [escrowTransactions, smsList]);

  // REACTIVE CALCULATION: Metrics data cards
  const reactiveMetrics = useMemo(() => {
    // Escrow value calculation (sum of unconfirmed items)
    const activeEscrowAmount = escrowTransactions
      .filter(t => !t.receiverConfirmed)
      .reduce((sum, t) => sum + t.amount, 0);

    const activeEscrowFormatted = activeEscrowAmount >= 1000000
      ? `Rp ${(activeEscrowAmount / 1000000).toFixed(1)} jt`
      : formatRupiah(activeEscrowAmount);

    const activeEscrowCount = escrowTransactions.filter(t => !t.receiverConfirmed).length;

    // Active fleet calculation
    const activeTrucks = truckFleets.filter(f => f.status === 'perjalanan').length;
    const totalTrucks = truckFleets.length;

    const cards: MetricCard[] = [
      {
        title: 'Transaksi SinergiDesa',
        value: `${47 + (initialEscrowTransactions.length - escrowTransactions.length)}`,
        subValue: '↑ 18% vs minggu lalu',
        isPositive: true
      },
      {
        title: 'Dana di escrow',
        value: activeEscrowFormatted,
        subValue: `${activeEscrowCount} transaksi berjalan`,
        isWarning: activeEscrowCount > 0
      },
      {
        title: 'Parse sukses (7 hari)',
        value: smsList.filter(s => s.isCorrected).length > 0 ? '95%' : '91%',
        subValue: smsList.filter(s => s.isCorrected).length > 0 ? 'naik dari 91%' : 'turun dari 96%',
        isPositive: smsList.filter(s => s.isCorrected).length > 0,
        isWarning: smsList.filter(s => s.isCorrected).length === 0
      },
      {
        title: 'Armada aktif',
        value: `${activeTrucks} / ${totalTrucks}`,
        subValue: `${truckFleets.filter(f => f.status === 'perjalanan').length} truk dalam perjalanan`,
        isPositive: activeTrucks === totalTrucks
      }
    ];

    return cards;
  }, [escrowTransactions, smsList, truckFleets]);

  // Handle CTA button click from the main action banner
  const handleActionClick = (actionKey: 'dual_witness' | 'sms_correction' | 'dispute') => {
    setActiveTab('transaksi');
    if (actionKey === 'sms_correction') {
      setActiveSubTab('sms_correction');
    } else {
      setActiveSubTab('dual_witness');
    }
  };

  // Header dynamic labels
  const headerContent = useMemo(() => {
    switch (activeTab) {
      case 'beranda':
        return viewMode === 'marketplace'
          ? {
              title: 'Marketplace SinergiDesa',
              subtitle: 'Jumat, 10 Juli 2026 · Katalog komoditas tani unggul, pupuk, dan benih antar koperasi desa'
            }
          : {
              title: 'Dashboard Pengurus SinergiDesa',
              subtitle: 'Jumat, 10 Juli 2026 · panel pengurus koperasi tani dan manajemen timbangan digital'
            };
      case 'transaksi':
        return {
          title: activeSubTab === 'dual_witness' ? 'Menunggu konfirmasi dual-witness' : 'Koreksi Pesan SMS Gateway',
          subtitle: 'Validasi otomatisasi data timbangan dan SMS petani'
        };
      case 'logistik':
        return {
          title: 'Manajemen Logistik & Armada',
          subtitle: 'Pemantauan real-time rute pengiriman dan optimalisasi muatan balik'
        };
      case 'anggota':
        return {
          title: selectedMemberId ? 'Kartu Kendali Hasil Tani' : 'Direktori Anggota Koperasi',
          subtitle: 'Laporan produksi hasil bumi dan tabungan per petak sawah petani'
        };
      case 'pengaturan':
        return {
          title: 'Pengaturan Sistem SinergiDesa',
          subtitle: 'Kalibrasi toleransi GPS satelit, integrasi SMS, dan WA bot gateway'
        };
      default:
        return {
          title: 'SinergiDesa',
          subtitle: 'Dashboard Pengurus Inti'
        };
    }
  }, [activeTab, activeSubTab, selectedMemberId, viewMode]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col md:flex-row antialiased">
      {/* Sidebar navigation context */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'beranda') {
            setViewMode('marketplace');
          }
        }}
        actionItemCount={activeActionItems.length}
        onBrandClick={() => {
          setActiveTab('beranda');
          setViewMode('dashboard');
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={headerContent.title}
          subtitle={headerContent.subtitle}
          lastUpdated={lastUpdated}
          onRefresh={handleRefresh}
          showBackButton={activeTab === 'anggota' && !!selectedMemberId}
          onBackClick={() => setSelectedMemberId(null)}
        />

        <main className="flex-grow">
          {/* Active Tab Router */}
          {activeTab === 'beranda' && (
            viewMode === 'marketplace' ? (
              <MarketplaceView
                products={marketplaceProducts}
                onNavigateToDashboard={() => setViewMode('dashboard')}
                onPurchase={handlePurchaseProduct}
              />
            ) : (
              <DashboardView
                actionItems={activeActionItems}
                metrics={reactiveMetrics}
                availableSupplies={availableSupplies}
                neededGoods={neededGoods}
                onActionClick={handleActionClick}
                onSendSupply={handleSendSupply}
                onFulfillNeed={handleFulfillNeed}
                pipelineData={{
                  incoming: escrowTransactions.filter(t => !t.receiverConfirmed).length + 1,
                  pending: escrowTransactions.filter(t => !t.receiverConfirmed).length,
                  ready: escrowTransactions.filter(t => t.receiverConfirmed).length + 2
                }}
              />
            )
          )}

          {activeTab === 'transaksi' && (
            <div className="flex flex-col">
              {/* Internal Sub-Tabs Navigation */}
              <div className="px-6 pt-4 border-b border-[#bfc8cc]/60 flex gap-4 bg-white shadow-sm">
                <button
                  onClick={() => setActiveSubTab('dual_witness')}
                  className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                    activeSubTab === 'dual_witness'
                      ? 'border-[#003b49] text-[#003b49]'
                      : 'border-transparent text-[#40484c] hover:text-[#003b49]'
                  }`}
                >
                  Menunggu Dual-Witness ({escrowTransactions.filter(t => !t.receiverConfirmed).length})
                </button>
                <button
                  onClick={() => setActiveSubTab('sms_correction')}
                  className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                    activeSubTab === 'sms_correction'
                      ? 'border-[#003b49] text-[#003b49]'
                      : 'border-transparent text-[#40484c] hover:text-[#003b49]'
                  }`}
                >
                  Koreksi Pesan SMS Gateway ({smsList.filter(s => !s.isCorrected).length})
                </button>
              </div>

              {activeSubTab === 'dual_witness' ? (
                <DualWitnessView
                  transactions={escrowTransactions}
                  onUpdateTransaction={handleUpdateTransaction}
                  onEscalateDispute={handleEscalateDispute}
                />
              ) : (
                <MessageCorrectionView
                  smsList={smsList}
                  onCorrectSms={handleCorrectSms}
                  onSendClarification={handleSendWAClarification}
                />
              )}
            </div>
          )}

          {activeTab === 'logistik' && (
            <div className="p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col gap-6 pb-20">
              {/* Logistics Overview Header */}
              <div className="bg-white p-5 rounded-2xl border border-[#bfc8cc] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-[#003b49] text-base sm:text-lg flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#006780]" /> Pemantauan Armada Desa SinergiDesa
                  </h3>
                  <p className="text-xs text-[#40484c] mt-0.5 font-medium">
                    Koperasi mengelola 3 armada truk pengangkut hasil bumi berkapasitas besar terhubung GPS logistik.
                  </p>
                </div>
                <span className="bg-[#eff4ff] text-[#006780] border border-[#bfc8cc]/40 px-3.5 py-1.5 rounded-xl text-xs font-bold">
                  Armada Beroperasi: {truckFleets.filter(f => f.status === 'perjalanan').length} / {truckFleets.length}
                </span>
              </div>

              {/* Fleet List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {truckFleets.map((fleet) => (
                  <div
                    key={fleet.id}
                    className="bg-white rounded-2xl border border-[#bfc8cc] p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <div>
                        <span className="text-xs font-bold text-[#003b49] bg-[#eff4ff] px-2.5 py-0.5 rounded-full">
                          {fleet.plateNumber}
                        </span>
                        <h4 className="font-bold text-sm text-[#0b1c30] mt-1.5">{fleet.driver}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          fleet.status === 'perjalanan'
                            ? 'bg-[#dcfce7] text-[#15803d]'
                            : fleet.status === 'bongkar'
                              ? 'bg-[#fef3c7] text-[#b45309] animate-pulse'
                              : 'bg-gray-100 text-[#40484c]'
                        }`}
                      >
                        {fleet.status}
                      </span>
                    </div>

                    <div className="text-xs text-[#40484c] font-semibold flex flex-col gap-1.5">
                      <p>🚛 Kapasitas: {fleet.capacity}</p>
                      <p>📍 Lokasi: {fleet.currentRoute || 'Garasi Utama'}</p>
                      <p>🌾 Muatan: {fleet.loadType || 'Kosong'}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Matching Engine Panel */}
              <div className="bg-white rounded-2xl border border-[#bfc8cc] shadow-sm overflow-hidden mt-2">
                <div className="p-4 border-b border-[#bfc8cc]/60 bg-[#f8f9ff]">
                  <h4 className="font-bold text-sm text-[#003b49] uppercase tracking-wider">
                    Peluang Muatan Balik Yang Tersedia
                  </h4>
                  <p className="text-[11px] text-[#40484c] mt-0.5">
                    Sistem mencocokkan rute perjalanan truk yang kosong setelah bongkar muatan di kota dengan kebutuhan pengiriman mitra terdekat.
                  </p>
                </div>
                {opportunities.length === 0 ? (
                  <div className="p-10 text-center text-[#40484c] flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-8 h-8 text-[#15803d]" />
                    <p className="text-sm font-bold text-[#003b49]">Semua peluang muatan balik terproses!</p>
                    <p className="text-xs">Armada terdistribusi optimal untuk efisiensi BBM.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#bfc8cc]/40">
                    {opportunities.map((opp) => (
                      <div key={opp.id} className="p-4 flex justify-between items-center hover:bg-[#eff4ff]/20 transition-all">
                        <div>
                          <p className="font-bold text-[#0b1c30] text-sm">{opp.route}</p>
                          <p className="text-xs text-[#006780] font-bold mt-0.5">{opp.potentialSavings}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-extrabold bg-[#fef3c7] text-[#b45309] px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {opp.deadlineBadge}
                          </span>
                          <button
                            onClick={() => handleAcceptOpportunity(opp.id, opp.route, opp.potentialSavings)}
                            className="bg-[#003b49] text-white hover:bg-[#005c73] font-bold text-xs px-3 py-1.5 rounded-lg transition-colors active:scale-95"
                          >
                            Ambil Peluang
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'anggota' && (
            <div className="p-0">
              {selectedMemberId ? (
                <MemberHistoryView
                  memberTransactions={memberTransactions}
                  onBackClick={() => setSelectedMemberId(null)}
                />
              ) : (
                <div className="p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col gap-6 pb-20">
                  {/* Members directory header */}
                  <div className="bg-white p-5 rounded-2xl border border-[#bfc8cc] shadow-sm">
                    <h3 className="font-bold text-[#003b49] text-base sm:text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#006780]" /> Direktori Keanggotaan Petani SinergiDesa
                    </h3>
                    <p className="text-xs text-[#40484c] mt-0.5 font-medium">
                      Pilih anggota di bawah untuk meninjau riwayat setoran hasil bumi, kartu kendali timbangan digital, dan grafik tren produksi mereka.
                    </p>
                  </div>

                  {/* Members card grid directory list */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Bapak Suroto */}
                    <div
                      onClick={() => setSelectedMemberId('SKD-0412')}
                      className="bg-white p-5 rounded-2xl border-2 border-transparent hover:border-[#003b49] transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#003b49] text-white font-extrabold rounded-full flex items-center justify-center text-sm shadow-md">
                          BS
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0b1c30] text-sm sm:text-base group-hover:text-[#006780] transition-colors">
                            Bapak Suroto
                          </h4>
                          <span className="text-[10px] bg-[#60d7ff]/20 text-[#005c73] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            ID: SKD-0412
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-[#40484c] font-semibold flex flex-col gap-1 mt-1">
                        <p>🌾 Kelompok Tani: Suka Makmur</p>
                        <p>🚜 Lahan Garapan: 2.5 Hektar</p>
                        <p>📦 Setoran Terakhir: Gabah (24 Mei 2024)</p>
                      </div>
                      <div className="text-xs font-bold text-[#003b49] border-t border-gray-100 pt-3 flex items-center justify-between group-hover:underline mt-auto">
                        <span>Lihat Riwayat Transaksi</span>
                        <span>→</span>
                      </div>
                    </div>

                    {/* Ibu Warsi */}
                    <div
                      onClick={() => alert('Mensimulasikan profil Ibu Warsi. ID: SKD-0551. Menunggu integrasi.')}
                      className="bg-white p-5 rounded-2xl border border-[#bfc8cc] opacity-75 hover:opacity-100 transition-all cursor-pointer shadow-sm flex flex-col gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-500 text-white font-extrabold rounded-full flex items-center justify-center text-sm">
                          IW
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0b1c30] text-sm">Ibu Warsi</h4>
                          <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            ID: SKD-0551
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-[#40484c] font-semibold flex flex-col gap-1 mt-1">
                        <p>🌾 Kelompok Tani: Tunas Harapan</p>
                        <p>🚜 Lahan Garapan: 1.2 Hektar</p>
                        <p>📦 Setoran Terakhir: Pupuk (10 Juli 2026)</p>
                      </div>
                      <p className="text-[10px] text-gray-500 italic mt-auto">Profil dalam antrean migrasi data.</p>
                    </div>

                    {/* Bapak Slamet */}
                    <div
                      onClick={() => alert('Mensimulasikan profil Bapak Slamet. ID: SKD-0310. Menunggu integrasi.')}
                      className="bg-white p-5 rounded-2xl border border-[#bfc8cc] opacity-75 hover:opacity-100 transition-all cursor-pointer shadow-sm flex flex-col gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-500 text-white font-extrabold rounded-full flex items-center justify-center text-sm">
                          BS
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0b1c30] text-sm">Bapak Slamet</h4>
                          <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            ID: SKD-0310
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-[#40484c] font-semibold flex flex-col gap-1 mt-1">
                        <p>🌾 Kelompok Tani: Subur Makmur</p>
                        <p>🚜 Lahan Garapan: 3.0 Hektar</p>
                        <p>📦 Setoran Terakhir: Jagung (15 Juni 2024)</p>
                      </div>
                      <p className="text-[10px] text-gray-500 italic mt-auto">Profil dalam antrean migrasi data.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pengaturan' && (
            <div className="p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col gap-6 pb-20">
              <div className="bg-white p-6 rounded-2xl border border-[#bfc8cc] shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="font-bold text-[#003b49] text-base sm:text-lg flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#006780]" /> Konfigurasi Gateway & Keamanan SinergiDesa
                  </h3>
                  <p className="text-xs text-[#40484c] mt-0.5 font-medium">
                    Sesuaikan parameter fungsional dan kebijakan otomatisasi robot timbangan digital desa.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Option 1: GPS satelite tolerance */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[#003b49] uppercase tracking-wider">
                      Toleransi Geotag Satelit GPS Desa
                    </label>
                    <p className="text-[11px] text-[#40484c] mb-1 leading-relaxed">
                      Jarak maksimum aman yang diijinkan antara lokasi timbangan fisik dengan titik GPS pengunggah foto guna menghindari pemalsuan.
                    </p>
                    <select
                      value={gpsTolerance}
                      onChange={(e) => setGpsTolerance(e.target.value)}
                      className="bg-[#f8f9ff] border border-[#bfc8cc] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#0b1c30] outline-none focus:border-[#003b49] cursor-pointer"
                    >
                      <option value="10 meter">Maksimum 10 meter (Sangat Ketat)</option>
                      <option value="50 meter">Maksimum 50 meter (Rekomendasi Standar)</option>
                      <option value="100 meter">Maksimum 100 meter (Gudang Terpencil)</option>
                      <option value="Bebas">Nonaktifkan Geotag Timbangan</option>
                    </select>
                  </div>

                  {/* Option 2: WA Automatic check retry interval */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[#003b49] uppercase tracking-wider">
                      Interval WA Reminder Bot Otomatis
                    </label>
                    <p className="text-[11px] text-[#40484c] mb-1 leading-relaxed">
                      Seberapa sering bot otomatis akan mendesak admin gudang penerima yang belum menekan tombol konfirmasi muatan di WhatsApp.
                    </p>
                    <select
                      value={waBotInterval}
                      onChange={(e) => setWaBotInterval(e.target.value)}
                      className="bg-[#f8f9ff] border border-[#bfc8cc] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#0b1c30] outline-none focus:border-[#003b49] cursor-pointer"
                    >
                      <option value="6 jam">Setiap 6 jam (Sangat Mendesak)</option>
                      <option value="12 jam">Setiap 12 jam (Saran Standar)</option>
                      <option value="24 jam">Setiap 24 jam sekali (Santai)</option>
                      <option value="Manual">Hanya Kirim Manual (Nonaktifkan Bot)</option>
                    </select>
                  </div>

                  {/* Option 3: SMS Gateway auto parsing retry */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[#003b49] uppercase tracking-wider">
                      Ototranslasi & Auto-Koreksi SMS Petani
                    </label>
                    <p className="text-[11px] text-[#40484c] mb-1 leading-relaxed">
                      Gunakan kecerdasan buatan parser untuk otomatis memperbaiki kesalahan ketik kecil (misal: "GABH" menjadi "GABAH") tanpa persetujuan manual.
                    </p>
                    <div className="flex items-center gap-3 bg-[#f8f9ff] p-3.5 rounded-xl border border-[#bfc8cc]/40">
                      <input
                        type="checkbox"
                        id="auto-sms-checkbox"
                        checked={autoSmsRetry}
                        onChange={(e) => setAutoSmsRetry(e.target.checked)}
                        className="w-4.5 h-4.5 text-[#003b49] border-[#bfc8cc] rounded focus:ring-[#003b49] cursor-pointer"
                      />
                      <label htmlFor="auto-sms-checkbox" className="text-xs font-bold text-[#0b1c30] cursor-pointer">
                        Aktifkan Auto-Koreksi Cerdas (AI Parser Matcher)
                      </label>
                    </div>
                  </div>

                  {/* Option 4: Simulated Security Badge */}
                  <div className="flex flex-col gap-2 justify-center">
                    <div className="bg-[#eff4ff] border border-[#bfc8cc]/40 p-4 rounded-xl flex items-center gap-3.5 text-xs text-[#003b49]">
                      <ShieldCheck className="w-8 h-8 text-[#006780] shrink-0" />
                      <div>
                        <span className="font-extrabold block">Enkripsi Dual-witness Aktif</span>
                        <p className="text-[10px] text-[#40484c] mt-0.5 font-medium leading-relaxed">
                          Seluruh dana escrow dilindungi oleh hash algoritma kriptografi SHA-256 dan terhubung langsung ke gerbang Bank Indonesia PJP Desa.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    onClick={() => alert('Berhasil menyimpan semua konfigurasi sistem SinergiDesa!')}
                    className="bg-[#003b49] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl hover:bg-[#005c73] transition-colors shadow-md shadow-[#003b49]/10"
                  >
                    Simpan Konfigurasi
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
