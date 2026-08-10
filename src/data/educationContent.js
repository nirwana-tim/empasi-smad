export const EDUCATION_CHAPTERS = [
  {
    id: 'intro_smad',
    title: 'Pengertian MP-ASI & Standar SMAD',
    shortTitle: 'Pengertian & SMAD',
    icon: 'book-open',
    color: '#38A3D8',
    summary: 'Standar indikator WHO/UNICEF untuk menilai kualitas dan kuantitas makanan pendamping ASI.',
    sections: [
      {
        heading: 'Apa itu MP-ASI?',
        content: 'Makanan Pendamping Air Susu Ibu (MP-ASI) adalah makanan dan cairan bergizi yang diberikan kepada bayi ketika ASI saja sudah tidak mencukupi kebutuhan gizinya. MP-ASI mulai diberikan tepat saat bayi berusia 6 bulan (180 hari). Pemberian ASI tetap dilanjutkan hingga usia 2 tahun atau lebih.',
      },
      {
        heading: 'Apa itu SMAD & MAD?',
        content: 'Standart Minimum Acceptable Diet (SMAD) adalah standar resmi dari WHO dan UNICEF untuk mengukur kecukupan kualitas dan frekuensi makanan pendamping ASI anak usia 6–23 bulan.',
      },
      {
        heading: 'Formula Kunci MAD:',
        highlight: 'MAD = Keragaman Makanan (MDD) + Frekuensi Makan (MMF)',
        content: '1. MDD (Minimum Dietary Diversity): Makan beragam minimal 5 dari 8 kelompok makanan dalam 24 jam terakhir.\n2. MMF (Minimum Meal Frequency): Frekuensi makan utama dan camilan yang mencukupi sesuai usia anak.',
      },
    ],
  },
  {
    id: 'principles',
    title: 'Dasar & 6 Prinsip MP-ASI',
    shortTitle: '6 Prinsip Emas',
    icon: 'award',
    color: '#F39C12',
    summary: '6 prinsip emas pemberian MP-ASI untuk mencegah stunting sejak dini.',
    sections: [
      {
        heading: '6 Prinsip Emas MP-ASI Pencegahan Stunting:',
        list: [
          { number: '1', title: 'Tepat Waktu', desc: 'Mulai diberikan saat bayi genap berusia 6 bulan karena ASI saja sudah tidak mencukupi.' },
          { number: '2', title: 'Adekuat & Beragam', desc: 'Menu harus beragam, terutama sumber Protein Hewani, sayur, buah, dan sumber energi.' },
          { number: '3', title: 'Porsi Bertahap', desc: 'Porsi dinaikkan bertahap sesuai kemampuan dan tahapan usia anak.' },
          { number: '4', title: 'Tekstur Bertahap', desc: 'Tekstur dibuat bertahap dari lumat/halus ke lebih kasar sesuai kesiapan oromotor bayi.' },
          { number: '5', title: 'Frekuensi Sesuai', desc: 'Frekuensi disesuaikan usia dan kebutuhan anak setiap harinya.' },
          { number: '6', title: 'Aman, Bersih & Responsif', desc: 'Pemberian makan dilakukan secara responsif, sabar, penuh kasih, dan higienis.' },
        ],
      },
      {
        heading: 'Tahapan Tekstur & Porsi Berdasarkan Usia:',
        table: [
          { age: '6–8 Bulan', texture: 'Bubur lumat kental (puree/saring halus)', freq: '2–3x makan + 1–2x selingan', portion: 'Mulai 2–3 sdm hingga 1/2 mangkuk (125 ml)' },
          { age: '9–11 Bulan', texture: 'Makanan lembik/cincang (minced/mashed) & finger food', freq: '3–4x makan + 1–2x selingan', portion: '1/2 sampai 3/4 mangkuk (125–200 ml)' },
          { age: '12–23 Bulan', texture: 'Makanan keluarga (diiris/dipotong kecil)', freq: '3–4x makan + 1–2x selingan', portion: '3/4 sampai 1 mangkuk penuh (250 ml)' },
        ],
      },
    ],
  },
  {
    id: 'food_diversity',
    title: '8 Kelompok Makanan & MDD',
    shortTitle: '8 Kelompok Pangan',
    icon: 'pie-chart',
    color: '#27AE60',
    summary: 'Konsumsi minimal 5 dari 8 kelompok makanan setiap hari (Semakin bervariasi, semakin baik!).',
    sections: [
      {
        heading: 'Kenapa Harus 8 Kelompok Makanan?',
        content: 'Anak membutuhkan zat gizi makro (karbohidrat, protein, lemak) dan zat gizi mikro (vitamin dan mineral). Makanan yang itu-itu saja meningkatkan risiko defisiensi gizi mikro dan stunting. Target MDD WHO terpenuhi jika anak mengonsumsi minimal 5 dari 8 kelompok makanan dalam 24 jam.',
      },
      {
        heading: 'Daftar 8 Kelompok Makanan WHO:',
        list: [
          { number: '1', title: 'ASI (Air Susu Ibu)', desc: 'Sumber imunitas alami dan gizi berkualitas tinggi.' },
          { number: '2', title: 'Serealia & Umbi-umbian', desc: 'Beras, jagung, kentang, singkong, ubi, gandum, mie, roti.' },
          { number: '3', title: 'Kacang-kacangan & Biji-bijian', desc: 'Tahu, tempe, kacang hijau, kacang merah, kedelai.' },
          { number: '4', title: 'Susu & Olahannya', desc: 'Susu formula, susu UHT (>1 tahun), keju, yogurt.' },
          { number: '5', title: 'Daging, Unggas, Ikan & Hati', desc: 'Ikan lokal, ayam, daging sapi, hati ayam (kaya zat besi anti-anemia).' },
          { number: '6', title: 'Telur', desc: 'Telur ayam, bebek, puyuh. Mengandung kolin untuk kecerdasan otak.' },
          { number: '7', title: 'Buah & Sayur Kaya Vitamin A', desc: 'Wortel, labu kuning, bayam, daun kelor, pepaya, mangga.' },
          { number: '8', title: 'Buah & Sayur Lainnya', desc: 'Pisang, alpukat, apel, jeruk, buncis, brokoli, labu siam.' },
        ],
      },
    ],
  },
  {
    id: 'meal_frequency',
    title: 'Frekuensi Makan Minimum (MMF)',
    shortTitle: 'Frekuensi Makan',
    icon: 'clock',
    color: '#4E9E9C',
    summary: 'Aturan frekuensi makan utama dan camilan harian anak sesuai usia.',
    sections: [
      {
        heading: 'Kebutuhan Frekuensi Makan Harian:',
        list: [
          { number: '1', title: 'Bayi 6–8 Bulan (Masih ASI)', desc: 'Makan utama 2–3 kali sehari + 1–2 kali camilan bergizi.' },
          { number: '2', title: 'Anak 9–23 Bulan (Masih ASI)', desc: 'Makan utama 3–4 kali sehari + 1–2 kali camilan bergizi.' },
          { number: '3', title: 'Anak 6–23 Bulan (Tidak ASI)', desc: 'Minimal 4 kali makan utama + minimal 2 kali konsumsi susu/olahan susu per hari.' },
        ],
      },
      {
        heading: 'Contoh Camilan Bergizi:',
        content: 'Camilan sehat diberikan di antara waktu makan utama. Contohnya: potongan buah manis (pepaya/pisang), puree alpukat, telur rebus, puding susu, atau biskuit bergizi.',
      },
    ],
  },
  {
    id: 'hygiene',
    title: '5 Kunci Keamanan & Higienitas Pangan',
    shortTitle: 'Higienitas & Sanitasi',
    icon: 'shield',
    color: '#2980B9',
    summary: '5 langkah sederhana WHO menjaga kebersihan makanan dan mencegah infeksi diare.',
    sections: [
      {
        heading: '5 Kunci Keamanan Pangan WHO:',
        list: [
          { number: '1', title: 'Cuci Tangan dengan Sabun', desc: 'Cuci tangan dengan sabun dan air mengalir sebelum menyiapkan makanan, sebelum menyuapi anak, dan setelah buang air / ganti popok.' },
          { number: '2', title: 'Gunakan Peralatan Makan Bersih', desc: 'Gunakan piring, mangkuk, cangkir, dan sendok bersih. Hindari penggunaan botol atau dot karena rawan kuman.' },
          { number: '3', title: 'Pisahkan Mentah dan Matang', desc: 'Jauhkan daging/ikan mentah dari makanan matang untuk mencegah kontaminasi silang.' },
          { number: '4', title: 'Masak Hingga Matang Sempurna', desc: 'Masak makanan hingga benar-benar panas dan beruap, terutama daging, unggas, telur, dan ikan.' },
          { number: '5', title: 'Gunakan Air Bersih & Bahan Segar', desc: 'Gunakan air bersih yang aman untuk memasak dan minum. Pilih bahan makanan segar dan cuci sayur/buah dengan baik.' },
        ],
      },
    ],
  },
  {
    id: 'responsive_feeding',
    title: 'Pemberian Makan Responsif & Kasih Sayang',
    shortTitle: 'Responsive Feeding',
    icon: 'smile',
    color: '#E74C3C',
    summary: 'Membangun kebiasaan makan menyenangkan tanpa paksaan untuk si kecil.',
    sections: [
      {
        heading: 'Prinsip Responsive Feeding:',
        content: '• Beri makan dengan penuh kasih sayang dan kesabaran.\n• Perhatikan tanda-tanda lapar dan kenyang pada anak Anda.\n• Biarkan anak Anda yang menentukan seberapa banyak porsi yang ingin dimakannya.\n• Jangan memaksa anak makan saat menolak. Coba tawarkan lagi secara bertahap.\n• Ciptakan suasana makan yang tenang tanpa gawai (gadget/TV).',
      },
      {
        heading: '7 Daftar Periksa Cepat MAD di Rumah:',
        list: [
          { number: '1', title: 'Pola Makan Sesuai Usia', desc: 'Makanan dan porsinya disesuaikan dengan tahapan usia anak.' },
          { number: '2', title: 'Beragam Makanan (MDD)', desc: 'Minimal 5 dari 8 kelompok makanan ditawarkan setiap hari.' },
          { number: '3', title: 'Protein Hewani Setiap Hari', desc: 'Wajib ada ikan, telur, ayam, daging, atau hati setiap hari.' },
          { number: '4', title: 'Tekstur Bertahap', desc: 'Tekstur dinaikkan bertahap dari lumat, lembik, hingga makanan keluarga.' },
          { number: '5', title: 'Makanan Aman & Bersih', desc: 'Dimasak dengan baik, disajikan segar, dan higienis.' },
          { number: '6', title: 'Lanjutkan Pemberian ASI', desc: 'Pemberian ASI tetap dilanjutkan hingga usia 2 tahun atau lebih.' },
          { number: '7', title: 'Pantau Rutin di Posyandu', desc: 'Pantau pertumbuhan anak secara teratur setiap bulan di Posyandu.' },
        ],
      },
    ],
  },
];
