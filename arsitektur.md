# SYSTEM ARCHITECTURE & TECHNICAL SPECIFICATION
# E-MP ASI SMAD (React Native / Expo SDK 54)

---

## 1. Ringkasan Arsitektur Sistem

Aplikasi dibangun menggunakan ekosistem **React Native** dengan framework **Expo SDK 54** (Architecture: New Architecture enabled / Hermes engine), berfokus pada pendekatan **Offline-First**, performa tinggi, dan struktur modular.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────────────┐  │
│  │ Screens (Views) │  │ Reusable UI     │  │ Navigation             │  │
│  │ • Splash        │  │ • StickyCard    │  │ (React Navigation      │  │
│  │ • Beranda       │  │ • RibbonHeader  │  │  Native Stack)         │  │
│  │ • Informasi     │  │ • StepperCounter│  │                        │  │
│  │ • Cek SMAD      │  │ • ZScoreGauge   │  │                        │  │
│  │ • Kalkulator    │  │ • CheckboxGrid  │  │                        │  │
│  │ • Kuisioner     │  │                 │  │                        │  │
│  └────────┬────────┘  └────────┬────────┘  └───────────┬────────────┘  │
└───────────┼────────────────────┼───────────────────────┼───────────────┘
            ▼                    ▼                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                            BUSINESS LOGIC LAYER                        │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐ │
│  │        SMAD Engine            │   │      WHO Z-Score Engine       │ │
│  │ • MDD Calculator (>=5 of 8)   │   │ • LMS Calculation Formula     │ │
│  │ • MMF Calculator by Age & BF  │   │ • PB/U (<24m) & TB/U (>=24m)  │ │
│  │ • MMFF Evaluation for Non-BF  │   │ • Growth Curve Lookup Table   │ │
│  │ • Custom Feedback Generator   │   │ • Stunting Category Evaluator │ │
│  └───────────────────────────────┘   └───────────────────────────────┘ │
└────────────────────────────────┬───────────────────────────────────────┘
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA & PERSISTENCE LAYER                        │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐ │
│  │ Local Storage (AsyncStorage)  │   │ Static Knowledge Base (JSON)  │ │
│  │ • Saved Assessment History    │   │ • WHO LMS Reference Tables    │ │
│  │ • User Profile & Preferences  │   │ • MP-ASI Educational Chapters │ │
│  └───────────────────────────────┘   └───────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Struktur Direktori Proyek (Project Structure)

Berikut adalah struktur folder yang direkomendasikan untuk pengembangan proyek:

```text
empasi-smad/
├── Asset/                     # Asset asli referensi (Gambar, Mockup, PDF, DOCX)
├── assets/                    # Asset bundling aplikasi Expo (icons, splash, fonts)
│   ├── images/
│   │   ├── bg/               # Background default, beranda, smad, kalkulator
│   │   ├── icons/            # Ikon menu sticky card, ribbon
│   │   └── illustrations/    # Maskot bayi, piring gizi, timbangan
│   └── fonts/                # Custom font (Fredoka, Poppins, PlusJakartaSans)
├── src/
│   ├── components/           # Komponen UI Reusable
│   │   ├── common/           # Button, Card, Header, Modal, Tag, Container
│   │   ├── custom/           # StickyCard, WashiTape, RibbonBanner, StepperCounter
│   │   └── charts/           # ZScoreGauge, ProgressMeter
│   ├── constants/            # Konstanta global
│   │   ├── colors.js         # Color tokens & theme
│   │   ├── typography.js     # Font families & sizes
│   │   └── links.js          # Google Form URLs & referensi
│   ├── data/                 # Master data statis
│   │   ├── whoGrowthData.js  # Tabel LMS WHO Panjang/Tinggi Badan 0-60 Bulan
│   │   ├── foodGroups.js     # Data 8 Kelompok Pangan MP-ASI
│   │   └── educationContent.js # Konten lengkap materi edukasi PDF
│   ├── navigation/           # Konfigurasi navigasi aplikasi
│   │   └── AppNavigator.js   # Native Stack Navigator
│   ├── screens/              # Layar Tampilan Utama
│   │   ├── SplashScreen.js   # Layar pembuka / loading
│   │   ├── HomeScreen.js     # Beranda 4 menu
│   │   ├── InformationScreen.js # Edukasi & Prinsip MPASI
│   │   ├── SmadCheckScreen.js   # Form & Hasil Cek SMAD
│   │   ├── StuntingCalculatorScreen.js # Kalkulator Antropometri WHO
│   │   └── QuestionnaireScreen.js # Menu Pretest & Posttest
│   ├── services/             # Logika & Algoritma Kalkulasi
│   │   ├── smadService.js    # Perhitungan MDD, MMF, MMFF, MAD
│   │   ├── stuntingService.js# Formula Box-Cox LMS & klasifikasi Z-Score
│   │   └── storageService.js # Penyimpanan riwayat lokal (AsyncStorage)
│   └── utils/                # Helper utilities
│       ├── formatting.js     # Format tanggal, angka desimal
│       └── validation.js     # Validasi input form
├── App.js                    # Entry point aplikasi
├── app.json                  # Konfigurasi Expo SDK 54
├── package.json              # Dependensi npm
└── prd.md / desain.md / arsitektur.md / data_model.md / materi_edukasi.md
```

---

## 3. Spesifikasi Modul Logika Inti (Core Services)

### 3.1 SMAD Engine (`src/services/smadService.js`)

Modul ini bertanggung jawab memproses input makanan dan frekuensi untuk menghasilkan status kepatuhan **MAD (Minimum Acceptable Diet)**.

```javascript
/**
 * @typedef {Object} SmadInput
 * @property {'6-8' | '9-23'} ageGroup - Kelompok usia anak
 * @property {boolean} isBreastfeeding - Apakah anak masih menyusu ASI
 * @property {string[]} selectedFoodGroups - Array id kelompok makanan (dari 8 kelompok)
 * @property {number} mealFrequency - Frekuensi makan makanan padat/semi-padat
 * @property {number} milkFrequency - Frekuensi konsumsi susu (khusus non-ASI)
 */

export function evaluateMAD(input) {
  const { ageGroup, isBreastfeeding, selectedFoodGroups, mealFrequency, milkFrequency } = input;

  // 1. Hitung MDD (Minimum Dietary Diversity) - Target: >= 5 dari 8 kelompok
  // Pastikan ASI otomatis terhitung jika isBreastfeeding = true
  const foodGroups = new Set(selectedFoodGroups);
  if (isBreastfeeding) {
    foodGroups.add('breastmilk');
  }
  const mddScore = foodGroups.size;
  const isMddPass = mddScore >= 5;

  // 2. Hitung MMF (Minimum Meal Frequency)
  let mmfTarget = 2;
  if (isBreastfeeding) {
    mmfTarget = ageGroup === '6-8' ? 2 : 3;
  } else {
    mmfTarget = 4; // Anak non-ASI usia 6-23 bulan butuh min 4 kali makan
  }
  const isMmfPass = mealFrequency >= mmfTarget;

  // 3. Hitung MMFF (Minimum Milk Feeding Frequency untuk non-ASI)
  let isMmffPass = true;
  if (!isBreastfeeding) {
    isMmffPass = milkFrequency >= 2; // Min 2x pemberian susu/produk susu
  }

  // 4. Kesimpulan Akhir MAD
  const isMadPass = isBreastfeeding 
    ? (isMddPass && isMmfPass)
    : (isMddPass && isMmfPass && isMmffPass);

  // 5. Rekomendasi Perbaikan
  const recommendations = [];
  if (!isMddPass) {
    const missingCount = 5 - mddScore;
    recommendations.push(
      `Tambahkan minimal ${missingCount} kelompok makanan lagi (terutama sumber protein hewani seperti telur, ikan, atau daging) agar mencapai minimal 5 kelompok makanan.`
    );
  }
  if (!isMmfPass) {
    recommendations.push(
      `Tingkatkan frekuensi makan utama menjadi minimal ${mmfTarget} kali sehari sesuai usia si kecil.`
    );
  }
  if (!isBreastfeeding && !isMmffPass) {
    recommendations.push(
      `Untuk anak yang tidak menyusu ASI, berikan susu atau olahan susu minimal 2 kali sehari.`
    );
  }

  return {
    isMadPass,
    mdd: { score: mddScore, target: 5, isPass: isMddPass },
    mmf: { count: mealFrequency, target: mmfTarget, isPass: isMmfPass },
    mmff: { count: milkFrequency, target: 2, isPass: isMmffPass, isApplicable: !isBreastfeeding },
    recommendations
  };
}
```

---

### 3.2 WHO Stunting Z-Score Engine (`src/services/stuntingService.js`)

Modul ini mengimplementasikan rumus transformasi Box-Cox LMS standar **WHO Child Growth Standards (2006)**.

```javascript
/**
 * Menghitung Z-score PB/U atau TB/U berdasarkan parameter LMS WHO
 * @param {number} actualLengthCm - Panjang/Tinggi badan anak aktual (cm)
 * @param {number} ageMonths - Umur anak dalam bulan (0-60)
 * @param {'boy' | 'girl'} gender - Jenis kelamin
 * @param {Object} lmsTable - Tabel LMS WHO
 */
export function calculateZScore(actualLengthCm, ageMonths, gender, lmsTable) {
  const params = lmsTable[gender][ageMonths];
  if (!params) {
    throw new Error('Data LMS WHO tidak ditemukan untuk umur dan jenis kelamin tersebut.');
  }

  const { L, M, S } = params;
  const X = actualLengthCm;

  let zScore = 0;
  if (L !== 0) {
    zScore = (Math.pow(X / M, L) - 1) / (L * S);
  } else {
    zScore = Math.log(X / M) / S;
  }

  // Pembulatan 2 desimal
  const roundedZ = Math.round(zScore * 100) / 100;

  // Klasifikasi Status
  let status = 'Normal';
  let isStunting = false;
  let severity = 'normal';
  let advice = 'Pertumbuhan si kecil normal. Lanjutkan pemberian gizi seimbang!';

  if (roundedZ < -3.0) {
    status = 'Sangat Pendek (Severely Stunted)';
    isStunting = true;
    severity = 'severely_stunted';
    advice = 'Perlu perhatian khusus! Segera konsultasikan ke dokter spesialis anak atau Puskesmas.';
  } else if (roundedZ >= -3.0 && roundedZ < -2.0) {
    status = 'Pendek (Stunted)';
    isStunting = true;
    severity = 'stunted';
    advice = 'Tinggi badan di bawah kurva standar. Evaluasi asupan protein hewani MP-ASI dan konsultasikan ke Posyandu.';
  } else if (roundedZ >= -2.0 && roundedZ <= 3.0) {
    status = 'Normal (Tidak Stunting)';
    isStunting = false;
    severity = 'normal';
    advice = 'Pertumbuhan si kecil ideal sesuai standar WHO. Pertahankan pola makan bergizi!';
  } else {
    status = 'Tinggi';
    isStunting = false;
    severity = 'tall';
    advice = 'Tinggi badan di atas rata-rata standar. Pertumbuhan fisik sangat baik!';
  }

  return {
    zScore: roundedZ,
    status,
    isStunting,
    severity,
    measurementType: ageMonths < 24 ? 'Panjang Badan (PB terlentang)' : 'Tinggi Badan (TB berdiri)',
    advice,
    whoMedian: M
  };
}
```

---

## 4. Dependensi Pustaka (Library Stack)

Untuk menjalankan seluruh kebutuhan aplikasi secara optimal pada Expo SDK 54:

| Dependensi | Versi Kompatibel | Kegunaan |
| :--- | :--- | :--- |
| `expo` | `~54.0.35` | Core Expo Framework |
| `react` | `19.1.0` | Core React Engine |
| `react-native` | `0.81.5` | Mobile Framework |
| `@react-navigation/native` | `^7.x` / `^6.x` | Navigation Container |
| `@react-navigation/native-stack` | `^7.x` / `^6.x` | Stack Screen Transitions |
| `react-native-screens` | `~4.4.0` | Native Screen Optimization |
| `react-native-safe-area-context` | `~5.2.0` | Safe Area Handling (Notch & Bar) |
| `expo-web-browser` | `~14.0.0` | In-App Browser untuk Kuisioner |
| `@react-native-async-storage/async-storage` | `~2.1.0` | Penyimpanan Riwayat Lokal |
| `expo-haptics` | `~14.0.0` | Haptic Feedback Interaktif |
| `expo-font` | `~13.0.0` | Custom Typography Loading |

---

## 5. Strategi Pengujian (Testing Strategy)

1. **Unit Testing (Jest)**:
   * Pengujian perhitungan Z-score terhadap data benchmark tabel antropometri WHO 2006 (akurasi 100%).
   * Pengujian seluruh kombinasi skenario MAD (Anak ASI 6-8 bln, ASI 9-23 bln, Non-ASI, 4 kelompok vs 5 kelompok).
2. **Integration Testing**:
   * Pengujian flow navigasi Beranda $\rightarrow$ Sub-screens $\rightarrow$ Kembali ke Beranda.
   * Pengujian penyimpanan & pemanggilan riwayat lokal.
3. **E2E / Usability Testing**:
   * Validasi kelancaran transisi layar dan keterbacaan teks pada resolusi layar Android kecil ($360\text{dp}$) hingga besar ($412\text{dp}+$ / Tablet).
