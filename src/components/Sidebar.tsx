import React, { useState } from 'react';
import { LayoutDashboard, Receipt, Truck, Users, Settings, LogOut, Menu, X, Leaf, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  actionItemCount: number;
  onBrandClick?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, actionItemCount, onBrandClick }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNavItems = [
    { id: 'beranda' as ActiveTab, label: 'Beranda', icon: LayoutDashboard },
    { id: 'transaksi' as ActiveTab, label: 'Transaksi', icon: Receipt, badge: actionItemCount > 0 ? actionItemCount : undefined },
    { id: 'logistik' as ActiveTab, label: 'Logistik', icon: Truck },
    { id: 'anggota' as ActiveTab, label: 'Anggota', icon: Users },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleBrandClick = () => {
    if (onBrandClick) {
      onBrandClick();
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header (hidden on desktop) */}
      <nav className="md:hidden bg-[#f8f9ff] border-b border-[#bfc8cc] flex justify-between items-center w-full px-4 py-3 sticky top-0 z-50">
        <div 
          onClick={handleBrandClick}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all"
          title="Klik untuk membuka Dashboard Pengurus"
        >
          <Leaf className="w-6 h-6 text-[#003b49]" />
          <span className="font-bold text-[#003b49] text-lg">SinergiDesa</span>
          <span className="bg-[#60d7ff]/20 text-[#005c73] text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">Hub</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          className="p-1 hover:bg-[#eff4ff] transition-colors rounded-full"
        >
          {mobileMenuOpen ? <X className="text-[#003b49]" /> : <Menu className="text-[#003b49]" />}
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Drawer Menu */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-[#f8f9ff] border-r border-[#bfc8cc] p-4 flex flex-col gap-6 z-50 md:hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center pb-4 border-b border-[#bfc8cc]">
          <div 
            onClick={handleBrandClick}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all"
            title="Klik untuk membuka Dashboard Pengurus"
          >
            <Leaf className="w-6 h-6 text-[#003b49]" />
            <span className="font-bold text-[#003b49] text-base">SinergiDesa</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-[#eff4ff] rounded-full">
            <X className="w-5 h-5 text-[#40484c]" />
          </button>
        </div>

        {/* User Info inside Drawer */}
        <div className="flex items-center gap-3 p-2 bg-[#eff4ff] rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full object-cover border border-[#bfc8cc]"
          />
          <div>
            <h4 className="font-semibold text-sm text-[#003b49]">Admin Koperasi</h4>
            <p className="text-xs text-[#40484c]">Pengurus Inti</p>
          </div>
        </div>

        {/* Navigation items in Drawer */}
        <nav className="flex flex-col gap-1 flex-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#60d7ff]/20 text-[#005c73] border-l-4 border-[#006780]'
                    : 'text-[#40484c] hover:bg-[#eff4ff]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-[#ba1a1a] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer items in Drawer */}
        <div className="border-t border-[#bfc8cc] pt-4 flex flex-col gap-1">
          <button
            onClick={() => handleNavClick('pengaturan')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'pengaturan' ? 'bg-[#60d7ff]/20 text-[#005c73]' : 'text-[#40484c] hover:bg-[#eff4ff]'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
          </button>
          <button
            onClick={() => alert('Sesi berakhir. Mensimulasikan logout...')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar (visible on md+) */}
      <aside className="hidden md:flex flex-col h-screen sticky top-0 py-6 px-4 gap-6 bg-[#eff4ff] border-r border-[#bfc8cc] w-64 shrink-0 shadow-sm">
        {/* Brand Header */}
        <div 
          onClick={handleBrandClick}
          className="px-3 pb-3 border-b border-[#bfc8cc]/60 flex items-center gap-2.5 cursor-pointer hover:bg-white/40 rounded-xl transition-all"
          title="Klik untuk membuka Dashboard Pengurus"
        >
          <Leaf className="w-8 h-8 text-[#003b49]" />
          <div>
            <h1 className="font-black text-[#003b49] text-xl leading-tight tracking-tight flex items-center gap-1">
              SinergiDesa
            </h1>
            <p className="text-[9px] font-bold text-[#40484c]/80 uppercase tracking-widest">Dashboard & Marketplace</p>
          </div>
        </div>

        {/* Administrator Profile Card */}
        <div className="flex items-center gap-3 px-3 py-2 bg-white/60 rounded-xl border border-[#bfc8cc]/30">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full object-cover border border-[#bfc8cc]"
          />
          <div>
            <h4 className="font-bold text-xs text-[#003b49]">Admin Koperasi</h4>
            <p className="text-[10px] text-[#40484c]">Pengurus Inti</p>
          </div>
        </div>

        {/* Navigation Items list */}
        <nav className="flex-1 flex flex-col gap-1.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#003b49] text-white shadow-md shadow-[#003b49]/10'
                    : 'text-[#40484c] hover:bg-white/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#60d7ff]' : 'text-[#40484c]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#ba1a1a] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Settings & Logout */}
        <div className="mt-auto border-t border-[#bfc8cc]/60 pt-4 flex flex-col gap-1.5">
          <button
            onClick={() => handleNavClick('pengaturan')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'pengaturan'
                ? 'bg-[#003b49] text-white'
                : 'text-[#40484c] hover:bg-white/40'
            }`}
          >
            <Settings className="w-5 h-5 text-[#40484c]" />
            <span>Pengaturan</span>
          </button>
          <button
            onClick={() => alert('Sesi berakhir. Mensimulasikan logout...')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-all text-left"
          >
            <LogOut className="w-5 h-5 text-[#ba1a1a]" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Navigation (visible only on mobile) */}
      <nav className="md:hidden bg-white border-t border-[#bfc8cc] fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center py-2 pb-safe shadow-lg">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center gap-0.5 p-1 transition-all ${
                isActive ? 'text-[#003b49]' : 'text-[#40484c]/70'
              }`}
            >
              <div className={`p-1 px-3.5 rounded-full transition-all ${
                isActive ? 'bg-[#60d7ff]/30 text-[#003b49]' : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Margin Spacer for mobile bottom nav so content doesn't get covered */}
      <div className="h-16 md:hidden pointer-events-none" />
    </>
  );
}
