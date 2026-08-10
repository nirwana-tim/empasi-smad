import { WHO_GROWTH_STANDARDS } from '../data/whoGrowthData';

/**
 * Menghitung Z-score tinggi/panjang badan menurut umur (PB/U atau TB/U)
 * Menggunakan rumus Box-Cox LMS WHO (2006):
 * Z = (((X/M)^L) - 1) / (L * S) jika L != 0
 * Z = ln(X/M) / S jika L == 0
 * 
 * @param {number} lengthCm - Panjang / Tinggi Badan dalam cm
 * @param {number} ageMonths - Umur anak dalam bulan (0 - 60)
 * @param {'boy' | 'girl'} gender - Jenis kelamin ('boy' atau 'girl')
 * @returns {Object} Hasil evaluasi Z-score dan status stunting
 */
export function calculateStuntingZScore(lengthCm, ageMonths, gender) {
  const genderKey = gender === 'girl' ? 'girl' : 'boy';
  const ageInt = Math.max(0, Math.min(60, Math.round(Number(ageMonths) || 0)));
  const lengthVal = Number(lengthCm);

  if (!lengthVal || lengthVal <= 0) {
    throw new Error('Panjang/tinggi badan harus berupa angka lebih dari 0.');
  }

  const standards = WHO_GROWTH_STANDARDS[genderKey];
  const ref = standards[ageInt];

  if (!ref) {
    throw new Error('Data referensi WHO tidak ditemukan untuk umur dan jenis kelamin ini.');
  }

  const { L, M, S, sd3neg, sd2neg, sd1neg, median, sd1pos, sd2pos, sd3pos } = ref;
  const X = lengthVal;

  let z = 0;
  if (L !== 0) {
    z = (Math.pow(X / M, L) - 1) / (L * S);
  } else {
    z = Math.log(X / M) / S;
  }

  const roundedZ = Math.round(z * 100) / 100;

  // Klasifikasi Status Pertumbuhan WHO
  let status = 'Normal';
  let categoryKey = 'normal';
  let isStunting = false;
  let statusColor = '#27AE60';
  let statusBg = '#E8F8F0';
  let title = 'TIDAK STUNTING';
  let description = 'Pertumbuhan tinggi badan si kecil sesuai dengan kurva standar WHO.';
  let recommendations = [
    'Pertahankan pola makan bergizi seimbang (beragam 8 kelompok makanan SMAD).',
    'Tetap berikan ASI hingga 2 tahun atau lebih dan lengkapi imunisasi dasar.',
    'Pantau tinggi dan berat badan secara rutin setiap bulan di Posyandu.',
  ];

  if (roundedZ < -3.0) {
    status = 'Sangat Pendek (Severely Stunted)';
    categoryKey = 'severely_stunted';
    isStunting = true;
    statusColor = '#E74C3C';
    statusBg = '#FDEEEB';
    title = 'STUNTING (Kategori Berat)';
    description = 'Panjang/tinggi badan si kecil berada jauh di bawah kurva standar WHO (Z-score < -3 SD).';
    recommendations = [
      'Segera konsultasikan ke Dokter Spesialis Anak atau Puskesmas untuk evaluasi medis dan tata laksana gizi intensif.',
      'Prioritaskan asupan protein hewani harian (telur, ikan, daging, hati) serta suplementasi gizi bila dianjurkan dokter.',
      'Pastikan kebersihan lingkungan dan air minum untuk mencegah infeksi berulang.',
    ];
  } else if (roundedZ >= -3.0 && roundedZ < -2.0) {
    status = 'Pendek (Stunted)';
    categoryKey = 'stunted';
    isStunting = true;
    statusColor = '#F39C12';
    statusBg = '#FEF6E9';
    title = 'STUNTING (Perlu Perhatian)';
    description = 'Panjang/tinggi badan si kecil berada di bawah kurva standar WHO (Z-score antara -3 SD sampai < -2 SD).';
    recommendations = [
      'Konsultasikan hasil ini kepada petugas gizi di Posyandu atau Puskesmas terdekat.',
      'Tingkatkan porsi dan frekuensi protein hewani (minimal 1 butir telur + ikan/ayam setiap hari).',
      'Cek kembali kecukupan keragaman makanan harian si kecil di menu Cek SMAD.',
    ];
  } else if (roundedZ >= -2.0 && roundedZ <= 3.0) {
    status = 'Normal';
    categoryKey = 'normal';
    isStunting = false;
    statusColor = '#27AE60';
    statusBg = '#E8F8F0';
    title = 'TIDAK STUNTING (NORMAL)';
    description = 'Pertumbuhan si kecil ideal dan berada di rentang normal standar WHO.';
    recommendations = [
      'Pertahankan pola makan bergizi seimbang dengan menu bervariasi.',
      'Pastikan kebutuhan tidur dan aktivitas fisik si kecil tercukupi dengan baik.',
      'Lakukan penimbangan dan pengukuran panjang badan rutin di Posyandu setiap bulan.',
    ];
  } else {
    status = 'Tinggi';
    categoryKey = 'tall';
    isStunting = false;
    statusColor = '#2980B9';
    statusBg = '#EAF2F8';
    title = 'TIDAK STUNTING (TINGGI)';
    description = 'Tinggi badan si kecil di atas rata-rata usia sebayanya (> +3 SD).';
    recommendations = [
      'Pertumbuhan fisik si kecil sangat baik. Tetap berikan nutrisi seimbang untuk mendukung aktivitasnya.',
      'Lanjutkan pola asuh responsif dan pantau tumbuh kembang di Posyandu.',
    ];
  }

  const measurementType = ageInt < 24 
    ? 'Panjang Badan (PB - posisi tidur/terlentang)' 
    : 'Tinggi Badan (TB - posisi berdiri tegak)';

  return {
    zScore: roundedZ,
    status,
    categoryKey,
    isStunting,
    title,
    description,
    statusColor,
    statusBg,
    recommendations,
    measurementType,
    ageMonths: ageInt,
    gender: genderKey,
    actualLength: lengthVal,
    whoMedian: median,
    whoCutoffs: { sd3neg, sd2neg, sd1neg, median, sd1pos, sd2pos, sd3pos },
  };
}
