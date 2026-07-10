import React, { useState } from 'react';
import { RefreshCw, ArrowLeft, Bell, X, Package, ShoppingCart, Store, CheckCircle, AlertTriangle, HelpCircle, ArrowRight } from 'lucide-react';
import { NotificationOrder } from '../types';

interface HeaderProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  onRefresh: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  orders: NotificationOrder[];
  sells: NotificationOrder[];
  onUpdateOrderStatus: (id: string, newStatus: NotificationOrder['status']) => void;
  onUpdateSellStatus: (id: string, newStatus: NotificationOrder['status']) => void;
}

export default function Header({
  title,
  subtitle,
  lastUpdated,
  onRefresh,
  showBackButton = false,
  onBackClick,
  orders,
  sells,
  onUpdateOrderStatus,
  onUpdateSellStatus,
}: HeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotifyTab, setActiveNotifyTab] = useState<'order' | 'sell'>('order');

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // Count active / pending notifications (anything not "selesai")
  const pendingOrdersCount = orders.filter(o => o.status !== 'selesai').length;
  const pendingSellsCount = sells.filter(s => s.status !== 'selesai').length;
  const totalPendingCount = pendingOrdersCount + pendingSellsCount;

  const getStatusStyles = (status: NotificationOrder['status']) => {
    switch (status) {
      case 'Menunggu konfirmasi':
        return 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]';
      case 'diproses':
        return 'bg-[#dbeafe] text-[#1e40af] border-[#bfdbfe]';
      case 'dikirim':
        return 'bg-[#e0e7ff] text-[#3730a3] border-[#c7d2fe]';
      case 'selesai':
        return 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]';
      case 'bermasalah/sengketa':
        return 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: NotificationOrder['status']) => {
    switch (status) {
      case 'Menunggu konfirmasi':
        return <HelpCircle className="w-4 h-4 text-[#b45309]" />;
      case 'diproses':
        return <Package className="w-4 h-4 text-[#1e40af]" />;
      case 'dikirim':
        return <Package className="w-4 h-4 text-[#3730a3]" />;
      case 'selesai':
        return <CheckCircle className="w-4 h-4 text-[#15803d]" />;
      case 'bermasalah/sengketa':
        return <AlertTriangle className="w-4 h-4 text-[#991b1b]" />;
    }
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const availableStatuses: NotificationOrder['status'][] = [
    'Menunggu konfirmasi',
    'diproses',
    'dikirim',
    'selesai',
    'bermasalah/sengketa'
  ];

  return (
    <header className="bg-white border-b border-[#bfc8cc] w-full px-6 py-4 sticky top-0 z-30 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="text-[#003b49] hover:bg-[#eff4ff] p-2 rounded-full transition-colors flex items-center justify-center border border-[#bfc8cc]/40 shadow-sm"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#003b49] tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs text-[#40484c] mt-0.5 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 self-end sm:self-auto">
        {/* Sync Status Badge */}
        <div className="flex items-center gap-2.5 text-[#40484c] text-xs font-semibold bg-[#f8f9ff] px-3 py-1.5 rounded-lg border border-[#bfc8cc]/30">
          <span>Data terakhir masuk: {lastUpdated}</span>
          <button
            onClick={handleRefreshClick}
            className="hover:bg-[#eff4ff] active:scale-95 transition-all rounded-full p-1 border border-[#bfc8cc]/40 bg-white shadow-sm flex items-center justify-center"
            title="Sinkronisasi Data"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 text-[#003b49] ${isRefreshing ? 'animate-spin' : 'transition-transform hover:rotate-180 duration-500'}`}
            />
          </button>
        </div>

        {/* Notification Bell Button & Dropdown Container */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2.5 rounded-xl border border-[#bfc8cc]/50 transition-all ${
              showNotifications ? 'bg-[#003b49] text-white shadow-md' : 'bg-white text-[#003b49] hover:bg-[#eff4ff]'
            }`}
            title="Buka Panel Notifikasi Transaksi"
          >
            <Bell className="w-5 h-5" />
            {totalPendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#ba1a1a] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {totalPendingCount}
              </span>
            )}
          </button>

          {/* Notification Panel Modal Dropdown */}
          {showNotifications && (
            <>
              {/* Backscreen overlay to close */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)} 
              />
              
              <div className="absolute right-0 mt-3 w-[340px] sm:w-[420px] bg-white rounded-2xl border border-[#bfc8cc] shadow-2xl z-50 overflow-hidden animate-fade-in text-[#0b1c30]">
                {/* Header */}
                <div className="bg-[#003b49] text-white px-4 py-3.5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#60d7ff]" />
                    <h3 className="font-bold text-sm">Notifikasi Transaksi</h3>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Tabs Selector */}
                <div className="flex border-b border-[#bfc8cc]/60 bg-[#f8f9ff]">
                  <button
                    onClick={() => setActiveNotifyTab('order')}
                    className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
                      activeNotifyTab === 'order'
                        ? 'border-[#003b49] text-[#003b49] bg-white'
                        : 'border-transparent text-[#40484c] hover:text-[#003b49]'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Order (Beli)</span>
                    {pendingOrdersCount > 0 && (
                      <span className="bg-[#ba1a1a] text-white text-[9px] px-1.5 py-0.5 rounded-full font-extrabold">
                        {pendingOrdersCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveNotifyTab('sell')}
                    className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
                      activeNotifyTab === 'sell'
                        ? 'border-[#003b49] text-[#003b49] bg-white'
                        : 'border-transparent text-[#40484c] hover:text-[#003b49]'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Jual (Checkout)</span>
                    {pendingSellsCount > 0 && (
                      <span className="bg-[#ba1a1a] text-white text-[9px] px-1.5 py-0.5 rounded-full font-extrabold">
                        {pendingSellsCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Notification Items List */}
                <div className="max-h-[380px] overflow-y-auto divide-y divide-[#bfc8cc]/30">
                  {activeNotifyTab === 'order' ? (
                    orders.length === 0 ? (
                      <div className="p-8 text-center text-xs text-[#40484c] flex flex-col items-center gap-2">
                        <ShoppingCart className="w-8 h-8 text-[#bfc8cc]" />
                        <p className="font-bold">Belum ada order pembelian</p>
                        <p>Lakukan pembelian komoditas di menu Marketplace.</p>
                      </div>
                    ) : (
                      orders.map((item) => (
                        <div key={item.id} className="p-4 flex flex-col gap-2.5 hover:bg-[#f8f9ff] transition-all">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-bold text-xs text-[#003b49]">{item.partnerCooperative}</p>
                              <h4 className="font-bold text-sm text-[#0b1c30] mt-0.5">{item.name}</h4>
                            </div>
                            <span className="text-[10px] text-[#40484c] font-medium">{item.date}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-xs font-extrabold text-[#005c73]">{formatRupiah(item.totalPrice)}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusStyles(item.status)}`}>
                                {getStatusIcon(item.status)}
                                <span>{item.status}</span>
                              </span>
                            </div>
                          </div>

                          {/* Quick Interactive Status Switcher */}
                          <div className="mt-1 flex items-center justify-between gap-2 pt-2 border-t border-dashed border-gray-100">
                            <span className="text-[9px] text-[#40484c] font-bold">Ubah Status Simulasi:</span>
                            <select
                              value={item.status}
                              onChange={(e) => onUpdateOrderStatus(item.id, e.target.value as any)}
                              className="bg-white border border-[#bfc8cc] rounded-lg px-2 py-1 text-[10px] font-bold text-[#003b49] outline-none cursor-pointer focus:border-[#003b49]"
                            >
                              {availableStatuses.map((st) => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )
                  ) : (
                    sells.length === 0 ? (
                      <div className="p-8 text-center text-xs text-[#40484c] flex flex-col items-center gap-2">
                        <Store className="w-8 h-8 text-[#bfc8cc]" />
                        <p className="font-bold">Belum ada komoditas terjual</p>
                        <p>Koperasi lain belum melakukan checkout barang jualan Anda.</p>
                      </div>
                    ) : (
                      sells.map((item) => (
                        <div key={item.id} className="p-4 flex flex-col gap-2.5 hover:bg-[#f8f9ff] transition-all">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="bg-[#60d7ff]/20 text-[#005c73] text-[8px] font-bold px-1 py-0.5 rounded uppercase tracking-wider">Pembeli</span>
                              <p className="font-bold text-xs text-[#003b49] mt-1">{item.partnerCooperative}</p>
                              <h4 className="font-bold text-sm text-[#0b1c30] mt-0.5">{item.name}</h4>
                            </div>
                            <span className="text-[10px] text-[#40484c] font-medium">{item.date}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-xs font-extrabold text-[#005c73]">{formatRupiah(item.totalPrice)}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusStyles(item.status)}`}>
                                {getStatusIcon(item.status)}
                                <span>{item.status}</span>
                              </span>
                            </div>
                          </div>

                          {/* Quick Interactive Status Switcher */}
                          <div className="mt-1 flex items-center justify-between gap-2 pt-2 border-t border-dashed border-gray-100">
                            <span className="text-[9px] text-[#40484c] font-bold">Atur Status Penjualan:</span>
                            <select
                              value={item.status}
                              onChange={(e) => onUpdateSellStatus(item.id, e.target.value as any)}
                              className="bg-white border border-[#bfc8cc] rounded-lg px-2 py-1 text-[10px] font-bold text-[#003b49] outline-none cursor-pointer focus:border-[#003b49]"
                            >
                              {availableStatuses.map((st) => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>

                {/* Footer Read/Dismiss Status bar */}
                <div className="bg-[#f8f9ff] border-t border-[#bfc8cc]/50 px-4 py-2.5 flex justify-between items-center text-[11px] font-bold text-[#006780]">
                  <span>PJP Escrow Terproteksi</span>
                  <button 
                    onClick={() => {
                      if (activeNotifyTab === 'order') {
                        orders.forEach(o => onUpdateOrderStatus(o.id, 'selesai'));
                      } else {
                        sells.forEach(s => onUpdateSellStatus(s.id, 'selesai'));
                      }
                    }}
                    className="hover:underline flex items-center gap-1"
                  >
                    Tandai Semua Selesai <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
