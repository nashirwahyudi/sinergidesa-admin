export type ActiveTab = 'beranda' | 'transaksi' | 'logistik' | 'anggota' | 'laporan' | 'pengaturan' | 'marketplace' | 'inventaris';

export interface ActionItem {
  id: string;
  type: 'warning' | 'error' | 'gavel';
  title: string;
  description: string;
  buttonText: string;
  actionKey: 'dual_witness' | 'dispute';
}

export interface MetricCard {
  title: string;
  value: string;
  subValue: string;
  isPositive?: boolean;
  isWarning?: boolean;
}

export interface EscrowTransaction {
  id: string; // e.g. TRX-0712-018
  commodity: string; // e.g. Gabah 2 ton
  sender: string; // Kop. Sumberrejo
  receiver: string; // Kop. Argosari / Kop. Tirtomulyo
  amount: number; // e.g. 24000000
  timePending: string; // e.g. Menunggu 26 jam
  timePendingHours: number;
  senderConfirmed: boolean;
  senderConfirmTime?: string;
  senderGeotag?: string;
  senderPhoto?: string;
  receiverConfirmed: boolean;
  remindersSent: number;
  escrowId: string;
  hashLedger: string;
  isDisputed?: boolean;
}

export interface MemberTransaction {
  id: string;
  date: string;
  commodity: 'Gabah' | 'Jagung';
  quantityKg: number;
  pricePerKg: number;
  totalValue: number;
  status: 'SELESAI' | 'BERJALAN';
  location: string;
  handler: string;
  koperasi: string;
}

export interface ReturnTripOpportunity {
  id: string;
  route: string; // e.g. Surabaya -> Sumberrejo (Besok)
  potentialSavings: string; // e.g. Potensi hemat Rp 450rb
  deadlineBadge: string; // e.g. JAWAB < 5 JAM
  isAmber?: boolean;
  koperasi: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  quantity: string;
  category: 'Hasil Tani' | 'Pupuk & Obat' | 'Benih' | 'Peralatan';
  image: string;
  description: string;
  koperasi: string;
}

export interface AvailableSupply {
  id: string;
  name: string;
  quantity: string;
  price: number;
  destinationKoperasi: string;
  status: 'Tersedia' | 'Siap Kirim' | 'Terkirim';
  koperasi: string;
}

export interface NeededGood {
  id: string;
  name: string;
  quantityNeeded: string;
  targetPrice: number;
  requesterKoperasi: string;
  urgency: 'Tinggi' | 'Sedang' | 'Rendah';
  koperasi: string;
}

export interface TruckFleet {
  id: string;
  plateNumber: string;
  driver: string;
  capacity: string;
  status: 'perjalanan' | 'standby' | 'bongkar';
  currentRoute?: string;
  loadType?: string;
  koperasi: string;
}

export interface StockItem {
  id: string;
  komoditas: string;
  satuan: string;
  berat: number;
  hargaBeli: number;
  images: string[];
  catatan: string;
  lastSync: string;
  koperasi: string;
}

export interface NotificationOrder {
  id: string;
  name: string;
  quantity: string;
  totalPrice: number;
  partnerCooperative: string;
  status: 'Menunggu konfirmasi' | 'diproses' | 'dikirim' | 'selesai' | 'bermasalah/sengketa';
  date: string;
  koperasi: string;
}
