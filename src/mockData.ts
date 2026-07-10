import { ActionItem, EscrowTransaction, MemberTransaction, ReturnTripOpportunity, TruckFleet, MarketplaceProduct, AvailableSupply, NeededGood } from './types';

export const initialActionItems: ActionItem[] = [
  {
    id: 'act-1',
    type: 'warning',
    title: '3 transaksi menunggu konfirmasi dual-witness',
    description: 'Terlama: kiriman gabah 2 ton ke Kop. Argosari, menunggu 26 jam',
    buttonText: 'Lihat',
    actionKey: 'dual_witness'
  },
  {
    id: 'act-3',
    type: 'gavel',
    title: '1 sengketa escrow tertahan 2 hari',
    description: 'Penerima menolak konfirmasi muatan belerang 5 ton · dana Rp 18,5 jt tertahan',
    buttonText: 'Tangani',
    actionKey: 'dispute'
  }
];

export const initialEscrowTransactions: EscrowTransaction[] = [
  {
    id: 'TRX-0712-018',
    commodity: 'Gabah 2 ton',
    sender: 'Kop. Sumberrejo',
    receiver: 'Kop. Argosari',
    amount: 24000000,
    timePending: 'Menunggu 26 jam',
    timePendingHours: 26,
    senderConfirmed: true,
    senderConfirmTime: '09 Jul 14.20',
    senderGeotag: '-8.21, 114.36',
    senderPhoto: 'https://images.unsplash.com/photo-1574325131876-a7999dc65f3f?auto=format&fit=crop&q=80&w=600', // Sacks of grains
    receiverConfirmed: false,
    remindersSent: 2,
    escrowId: 'ESC-2291',
    hashLedger: '#a3f9…7c21'
  },
  {
    id: 'TRX-0712-019',
    commodity: 'Belerang 5 ton',
    sender: 'Kop. Sumberrejo',
    receiver: 'Kop. Argosari',
    amount: 18500000,
    timePending: 'Menunggu 11 jam',
    timePendingHours: 11,
    senderConfirmed: true,
    senderConfirmTime: '09 Jul 19.30',
    senderGeotag: '-8.22, 114.35',
    receiverConfirmed: false,
    remindersSent: 1,
    escrowId: 'ESC-2292',
    hashLedger: '#f8d2…4a90'
  },
  {
    id: 'TRX-0712-020',
    commodity: 'Pupuk organik 800 kg',
    sender: 'Kop. Sumberrejo',
    receiver: 'Kop. Tirtomulyo',
    amount: 6400000,
    timePending: 'Menunggu 3 jam',
    timePendingHours: 3,
    senderConfirmed: true,
    senderConfirmTime: '10 Jul 06.15',
    senderGeotag: '-8.23, 114.37',
    receiverConfirmed: false,
    remindersSent: 0,
    escrowId: 'ESC-2293',
    hashLedger: '#b4a1…8e22'
  }
];

export const initialMemberTransactions: MemberTransaction[] = [
  {
    id: 'TRX-0712-018',
    date: '24 Mei 2024',
    commodity: 'Gabah',
    quantityKg: 1250,
    pricePerKg: 7200,
    totalValue: 9000000,
    status: 'SELESAI',
    location: 'Gudang Pusat Sumberrejo (Lat: -8.21, Long: 114.36)',
    handler: 'Budi Santoso (Staf Logistik)'
  },
  {
    id: 'TRX-0712-019',
    date: '22 Mei 2024',
    commodity: 'Jagung',
    quantityKg: 800,
    pricePerKg: 5500,
    totalValue: 4400000,
    status: 'SELESAI',
    location: 'Gudang B Tirtomulyo (Lat: -8.23, Long: 114.37)',
    handler: 'Slamet Riyadi (Staf Logistik)'
  },
  {
    id: 'TRX-0712-020',
    date: '20 Mei 2024',
    commodity: 'Gabah',
    quantityKg: 2000,
    pricePerKg: 7150,
    totalValue: 14300000,
    status: 'BERJALAN',
    location: 'Gudang Pusat Sumberrejo (Lat: -8.21, Long: 114.36)',
    handler: 'Budi Santoso (Staf Logistik)'
  },
  {
    id: 'TRX-0712-021',
    date: '18 Mei 2024',
    commodity: 'Gabah',
    quantityKg: 1100,
    pricePerKg: 7200,
    totalValue: 7920000,
    status: 'SELESAI',
    location: 'Gudang C Argosari (Lat: -8.19, Long: 114.32)',
    handler: 'Siti Rahma (Administrasi)'
  }
];

export const initialReturnTripOpportunities: ReturnTripOpportunity[] = [
  {
    id: 'opp-1',
    route: 'Surabaya → Sumberrejo (Besok)',
    potentialSavings: 'Potensi hemat Rp 450rb',
    deadlineBadge: 'jawab < 5 jam',
    isAmber: true
  },
  {
    id: 'opp-2',
    route: 'Malang → Sumberrejo (Senin)',
    potentialSavings: 'Potensi hemat Rp 320rb',
    deadlineBadge: 'jawab < 2 hari',
    isAmber: false
  }
];

export const initialTruckFleets: TruckFleet[] = [
  {
    id: 'fleet-1',
    plateNumber: 'N 8412 UT',
    driver: 'Supardi',
    capacity: '5 Ton',
    status: 'perjalanan',
    currentRoute: 'Sumberrejo → Argosari',
    loadType: 'Gabah'
  },
  {
    id: 'fleet-2',
    plateNumber: 'N 9031 UA',
    driver: 'Edi Santoso',
    capacity: '3 Ton',
    status: 'bongkar',
    currentRoute: 'Gudang Tirtomulyo',
    loadType: 'Pupuk'
  },
  {
    id: 'fleet-3',
    plateNumber: 'N 1152 UB',
    driver: 'Kusnan',
    capacity: '5 Ton',
    status: 'standby',
    currentRoute: 'Garasi Utama',
    loadType: 'Kosong'
  }
];

export const initialMarketplaceProducts: MarketplaceProduct[] = [
  {
    id: 'prod-1',
    name: 'Gabah Kering Giling (GKG) Premium',
    price: 7200,
    quantity: '15.000 kg',
    category: 'Hasil Tani',
    image: 'https://images.unsplash.com/photo-1574325131876-a7999dc65f3f?auto=format&fit=crop&q=80&w=400',
    description: 'Gabah kering giling berkualitas super dengan kadar air < 14%. Hasil panen kelompok tani Suka Makmur Sumberrejo.'
  },
  {
    id: 'prod-2',
    name: 'Jagung Pipil Kering Grade A',
    price: 5500,
    quantity: '8.500 kg',
    category: 'Hasil Tani',
    image: 'https://images.unsplash.com/photo-1551754626-787a241688ed?auto=format&fit=crop&q=80&w=400',
    description: 'Jagung pipil kering dengan kadar air rendah, sangat cocok untuk kebutuhan pakan ternak maupun pengolahan industri.'
  },
  {
    id: 'prod-3',
    name: 'Beras Pandan Wangi Premium',
    price: 15000,
    quantity: '4.200 kg',
    category: 'Hasil Tani',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
    description: 'Beras aromatik khas Pandan Wangi, pulen alami tanpa bahan pemutih atau pengawet kimiawi.'
  },
  {
    id: 'prod-4',
    name: 'Pupuk Urea Subsidi TSP',
    price: 2250,
    quantity: '12.000 kg',
    category: 'Pupuk & Obat',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400',
    description: 'Pupuk urea subsidi jatah kelompok tani Sumberrejo untuk penyuburan tanaman padi dan hortikultura.'
  },
  {
    id: 'prod-5',
    name: 'Benih Unggul Padi Ciherang',
    price: 45000,
    quantity: '350 kg',
    category: 'Benih',
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=400',
    description: 'Benih padi ciherang bersertifikat, tahan hama wereng coklat dengan potensi hasil tinggi per hektar.'
  },
  {
    id: 'prod-6',
    name: 'Kedelai Lokal Bola Kuning',
    price: 11000,
    quantity: '2.800 kg',
    category: 'Hasil Tani',
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80&w=400',
    description: 'Kedelai lokal kualitas premium dengan ukuran biji seragam, ideal untuk bahan baku tempe dan tahu berkualitas.'
  }
];

export const initialAvailableSupplies: AvailableSupply[] = [
  {
    id: 'sup-1',
    name: 'Gabah GKG Premium',
    quantity: '15 Ton',
    price: 7200,
    destinationKoperasi: 'Kop. Argosari',
    status: 'Tersedia'
  },
  {
    id: 'sup-2',
    name: 'Jagung Pipil Kering',
    quantity: '8 Ton',
    price: 5500,
    destinationKoperasi: 'Kop. Tirtomulyo',
    status: 'Siap Kirim'
  },
  {
    id: 'sup-3',
    name: 'Beras Pandan Wangi',
    quantity: '5 Ton',
    price: 15000,
    destinationKoperasi: 'Kop. Karya Tani',
    status: 'Terkirim'
  }
];

export const initialNeededGoods: NeededGood[] = [
  {
    id: 'need-1',
    name: 'Pupuk Urea Subsidi',
    quantityNeeded: '12 Ton',
    targetPrice: 2250,
    requesterKoperasi: 'Kop. Argo Makmur',
    urgency: 'Tinggi'
  },
  {
    id: 'need-2',
    name: 'Benih Padi IR64',
    quantityNeeded: '500 kg',
    targetPrice: 12000,
    requesterKoperasi: 'Kop. Subur Tani',
    urgency: 'Sedang'
  },
  {
    id: 'need-3',
    name: 'BBM Solar Subsidi',
    quantityNeeded: '2.000 Liter',
    targetPrice: 6800,
    requesterKoperasi: 'Kop. Argosari',
    urgency: 'Tinggi'
  },
  {
    id: 'need-4',
    name: 'Alat Perontok Padi',
    quantityNeeded: '3 Unit',
    targetPrice: 8500000,
    requesterKoperasi: 'Kop. Tani Makmur',
    urgency: 'Rendah'
  }
];
