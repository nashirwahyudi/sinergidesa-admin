import React, { useState } from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  onRefresh: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export default function Header({
  title,
  subtitle,
  lastUpdated,
  onRefresh,
  showBackButton = false,
  onBackClick,
}: HeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <header className="bg-white border-b border-[#bfc8cc] w-full px-6 py-4 sticky top-0 z-10 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

      <div className="flex items-center gap-3 text-[#40484c] text-xs font-semibold self-end sm:self-auto bg-[#f8f9ff] px-3 py-1.5 rounded-lg border border-[#bfc8cc]/30">
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
    </header>
  );
}
