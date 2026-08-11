import { FOOD_GROUPS } from '../data/foodGroups';

/**
 * Mengevaluasi kecukupan gizi berdasarkan standar MAD (Minimum Acceptable Diet) WHO/UNICEF
 * 
 * @param {Object} params
 * @param {'6-8' | '9-23'} params.ageGroup - Kelompok usia anak
 * @param {boolean} params.isBreastfeeding - Apakah anak masih menyusu ASI
 * @param {string[]} params.selectedFoodIds - Array ID makanan yang dicentang
 * @param {number} params.mealFrequency - Frekuensi makan makanan padat/semi-padat
 * @param {number} params.milkFrequency - Frekuensi konsumsi susu jika non-ASI
 * @returns {Object} Hasil evaluasi lengkap
 */
export function evaluateSMAD({
  ageGroup = '6-8',
  isBreastfeeding = true,
  selectedFoodIds = [],
  mealFrequency = 0,
  milkFrequency = 0,
}) {
  // 1. Kumpulkan kelompok makanan yang dikonsumsi
  const activeFoodIds = new Set(selectedFoodIds);
  if (isBreastfeeding) {
    activeFoodIds.add('breastmilk');
  }

  // 2. Evaluasi MDD (Minimum Dietary Diversity) - Target: Minimal 5 dari 8 kelompok
  const mddScore = activeFoodIds.size;
  const mddTarget = 5;
  const isMddPass = mddScore >= mddTarget;

  // 3. Evaluasi MMF (Minimum Meal Frequency)
  let mmfTarget = 2;
  if (isBreastfeeding) {
    mmfTarget = ageGroup === '6-8' ? 2 : 3;
  } else {
    mmfTarget = 4; // Anak non-ASI usia 6-23 bulan butuh min 4 kali makan
  }
  const isMmfPass = Number(mealFrequency) >= mmfTarget;

  // 4. Evaluasi MMFF (Minimum Milk Feeding Frequency - untuk anak non-ASI)
  let mmffTarget = 2;
  let isMmffPass = true;
  if (!isBreastfeeding) {
    isMmffPass = Number(milkFrequency) >= mmffTarget;
  }

  // 5. Evaluasi Akhir MAD (Standart Minimum Acceptable Diet)
  const isMadPass = isBreastfeeding
    ? (isMddPass && isMmfPass)
    : (isMddPass && isMmfPass && isMmffPass);

  // 6. Buat Rekomendasi Gizi Personal
  const recommendations = [];

  if (!isMddPass) {
    const missing = mddTarget - mddScore;
    recommendations.push({
      type: 'mdd',
      text: `Tambahkan minimal ${missing} kelompok makanan lagi dalam menu harian si kecil agar mencapai target minimal 5 kelompok makanan.`,
      highlight: 'Prioritaskan sumber Protein Hewani (telur, ikan, ayam, atau hati sapi) dan sayuran beraneka warna.',
    });
  }

  if (!isMmfPass) {
    recommendations.push({
      type: 'mmf',
      text: `Tingkatkan frekuensi makan makanan padat/lunak menjadi minimal ${mmfTarget} kali sehari sesuai tahapan usianya (${ageGroup} bulan).`,
      highlight: 'Bunda juga dapat memberikan 1–2 kali camilan bergizi sehat di antara waktu makan utama.',
    });
  }

  if (!isBreastfeeding && !isMmffPass) {
    recommendations.push({
      type: 'mmff',
      text: 'Untuk anak non-ASI (sudah tidak mendapat ASI), pastikan memberikan susu formula atau produk olahan susu (keju/yogurt) minimal 2 kali sehari.',
      highlight: 'Susu membantu memenuhi kebutuhan kalsium, lemak, dan energi harian si kecil.',
    });
  }

  if (isMadPass) {
    recommendations.push({
      type: 'success',
      text: 'Hebat Bunda! Pola pemberian makan si kecil sudah memenuhi standar Minimum Acceptable Diet (MAD) WHO/UNICEF.',
      highlight: 'Pertahankan variasi menu kaya protein hewani dan kebersihan alat makan setiap hari.',
    });
  }

  // Rincian kelompok makanan yang sudah dan belum dipilih
  const consumedGroups = FOOD_GROUPS.filter(g => activeFoodIds.has(g.id));
  const missingGroups = FOOD_GROUPS.filter(g => !activeFoodIds.has(g.id));

  return {
    isMadPass,
    ageGroup,
    isBreastfeeding,
    mdd: {
      score: mddScore,
      target: mddTarget,
      total: 8,
      isPass: isMddPass,
      consumedGroups,
      missingGroups,
    },
    mmf: {
      count: Number(mealFrequency),
      target: mmfTarget,
      isPass: isMmfPass,
    },
    mmff: {
      count: Number(milkFrequency),
      target: mmffTarget,
      isPass: isMmffPass,
      isApplicable: !isBreastfeeding,
    },
    recommendations,
    statusTitle: isMadPass ? 'MAD TERPENUHI' : 'MAD BELUM TERPENUHI',
    statusColor: isMadPass ? '#27AE60' : '#E74C3C',
    statusBg: isMadPass ? '#E8F8F0' : '#FDEEEB',
  };
}
