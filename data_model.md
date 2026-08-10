# DATA MODEL & REFERENCE SCHEMAS
# E-MP ASI SMAD (Data Structures & WHO Growth Reference)

---

## 1. Skema Data 8 Kelompok Makanan MP-ASI (Food Groups Schema)

Berdasarkan pedoman indikator terbaru **WHO/UNICEF (2021)**, keragaman makanan (MDD) dinilai dari konsumsi minimal **5 dari 8 kelompok makanan**:

```json
[
  {
    "id": "breastmilk",
    "groupNumber": 1,
    "name": "Air Susu Ibu (ASI)",
    "description": "ASI tetap menjadi sumber nutrisi penting hingga usia 2 tahun atau lebih.",
    "icon": "baby-bottle",
    "examples": ["ASI eksklusif", "ASI lanjutan"],
    "isAutoSelectable": true
  },
  {
    "id": "grains_roots",
    "groupNumber": 2,
    "name": "Serealia, Biji & Umbi-umbian",
    "description": "Sumber karbohidrat dan energi utama untuk aktivitas bayi.",
    "icon": "bowl-rice",
    "examples": ["Beras/Nasi", "Bubur", "Kentang", "Ubi jalar", "Singkong", "Jagung", "Mie", "Roti", "Oatmeal"]
  },
  {
    "id": "legumes_nuts",
    "groupNumber": 3,
    "name": "Kacang-kacangan & Biji-bijian",
    "description": "Sumber protein nabati, serat, dan mineral penting.",
    "icon": "seedling",
    "examples": ["Tahu", "Tempe", "Kacang hijau", "Kacang merah", "Kacang kedelai", "Kacang tanah"]
  },
  {
    "id": "dairy_products",
    "groupNumber": 4,
    "name": "Susu & Produk Olahan Susu",
    "description": "Sumber kalsium dan lemak sehat (selain ASI).",
    "icon": "cheese",
    "examples": ["Susu formula", "Susu sapi UHT", "Yogurt tawar", "Keju"]
  },
  {
    "id": "flesh_foods",
    "groupNumber": 5,
    "name": "Daging, Unggas, Ikan & Hati",
    "description": "Sumber protein hewani berkualitas tinggi, zat besi heme, dan seng pencegah stunting.",
    "icon": "drumstick-bite",
    "examples": ["Daging ayam", "Daging sapi", "Ikan kembung/lele/salmon", "Hati ayam/sapi", "Udang", "Belut"]
  },
  {
    "id": "eggs",
    "groupNumber": 6,
    "name": "Telur",
    "description": "Superfood sumber kolin dan protein hewani lengkap untuk perkembangan otak anak.",
    "icon": "egg",
    "examples": ["Telur ayam ras/kampung", "Telur bebek", "Telur puyuh"]
  },
  {
    "id": "vitamin_a_fruits_veg",
    "groupNumber": 7,
    "name": "Buah & Sayuran Kaya Vitamin A",
    "description": "Mendukung kesehatan mata, imunitas tubuh, dan regenerasi sel.",
    "icon": "carrot",
    "examples": ["Wortel", "Labu kuning", "Bayam", "Daun kelor", "Pepaya", "Mangga", "Tomat"]
  },
  {
    "id": "other_fruits_veg",
    "groupNumber": 8,
    "name": "Buah & Sayuran Lainnya",
    "description": "Sumber vitamin C, serat pangan, dan antioksidan alami.",
    "icon": "apple-alt",
    "examples": ["Pisang", "Jeruk", "Apel", "Alpukat", "Buncis", "Labu siam", "Brokoli", "Kembang kol"]
  }
]
```

---

## 2. Skema Riwayat Pemeriksaan SMAD (Assessment History Schema)

Disimpan pada `AsyncStorage` dengan key: `@smad_history_records`:

```typescript
interface SmadHistoryRecord {
  id: string;                      // Unique UUID (misal: "smad_1723270000000")
  timestamp: string;               // ISO 8601 String ("2026-08-10T13:00:00.000Z")
  childName?: string;              // Nama anak (opsional)
  ageGroup: '6-8' | '9-23';        // Kategori umur dalam bulan
  isBreastfeeding: boolean;        // Status menyusu ASI
  selectedFoodGroupIds: string[];  // Array ID kelompok makanan yang dicentang
  mealFrequency: number;           // Frekuensi makan padat/lunak (0-10)
  milkFrequency: number;           // Frekuensi minum susu jika non-ASI (0-10)
  
  // Hasil Evaluasi
  mddScore: number;                // Jumlah kelompok makanan (0-8)
  isMddPass: boolean;              // true jika mddScore >= 5
  mmfTarget: number;               // Target minimal frekuensi makan
  isMmfPass: boolean;              // true jika mealFrequency >= mmfTarget
  isMmffPass: boolean;             // true jika milkFrequency >= 2 (atau true jika masih ASI)
  isMadPass: boolean;              // Status kelulusan MAD keseluruhan (true = MAD Terpenuhi)
  recommendations: string[];       // Daftar pesan saran perbaikan gizi
}
```

---

## 3. Tabel Referensi Standar WHO Antropometri (WHO LMS Growth Standards)

Berdasarkan **WHO Child Growth Standards 2006 (Length/Height-for-age)** untuk anak usia **0–60 bulan**:

### Parameter Box-Cox LMS:
* $L$ (*Lambda*): Box-Cox power transformation (derajat skewness).
* $M$ (*Mu*): Median panjang/tinggi badan standar WHO (cm).
* $S$ (*Sigma*): Koefisien variasi (*Coefficient of Variation*).

```javascript
// Contoh Cuplikan Data LMS WHO (src/data/whoGrowthData.js)
export const whoLmsData = {
  boy: {
    0:  { L: 1, M: 49.8842, S: 0.03795, sd3neg: 44.2, sd2neg: 46.1, sd0: 49.9, sd2pos: 53.7, sd3pos: 55.6 },
    1:  { L: 1, M: 54.7244, S: 0.03559, sd3neg: 48.9, sd2neg: 50.8, sd0: 54.7, sd2pos: 58.6, sd3pos: 60.6 },
    6:  { L: 1, M: 67.6236, S: 0.03517, sd3neg: 60.5, sd2neg: 63.6, sd0: 67.6, sd2pos: 71.9, sd3pos: 74.0 },
    9:  { L: 1, M: 71.9642, S: 0.03597, sd3neg: 64.2, sd2neg: 67.5, sd0: 72.0, sd2pos: 76.5, sd3pos: 78.7 },
    12: { L: 1, M: 75.7483, S: 0.03689, sd3neg: 67.4, sd2neg: 71.0, sd0: 75.7, sd2pos: 80.5, sd3pos: 82.9 },
    18: { L: 1, M: 82.3125, S: 0.03841, sd3neg: 73.8, sd2neg: 76.9, sd0: 82.3, sd2pos: 87.7, sd3pos: 90.4 },
    24: { L: 1, M: 87.8184, S: 0.03960, sd3neg: 78.0, sd2neg: 81.0, sd0: 87.8, sd2pos: 93.9, sd3pos: 97.0 },
    36: { L: 1, M: 96.1130, S: 0.04162, sd3neg: 85.0, sd2neg: 88.7, sd0: 96.1, sd2pos: 103.5, sd3pos: 107.2 },
    48: { L: 1, M: 103.312, S: 0.04311, sd3neg: 91.0, sd2neg: 94.9, sd0: 103.3, sd2pos: 111.7, sd3pos: 115.9 },
    60: { L: 1, M: 110.024, S: 0.04421, sd3neg: 96.5, sd2neg: 100.7, sd0: 110.0, sd2pos: 119.4, sd3pos: 123.9 }
    // ... Data lengkap bulan 0 s/d 60
  },
  girl: {
    0:  { L: 1, M: 49.1477, S: 0.03790, sd3neg: 43.6, sd2neg: 45.4, sd0: 49.1, sd2pos: 52.9, sd3pos: 54.7 },
    1:  { L: 1, M: 53.6872, S: 0.03580, sd3neg: 47.8, sd2neg: 49.8, sd0: 53.7, sd2pos: 57.6, sd3pos: 59.5 },
    6:  { L: 1, M: 65.7311, S: 0.03550, sd3neg: 58.8, sd2neg: 61.2, sd0: 65.7, sd2pos: 70.3, sd3pos: 72.5 },
    9:  { L: 1, M: 70.1382, S: 0.03630, sd3neg: 62.5, sd2neg: 65.3, sd0: 70.1, sd2pos: 75.0, sd3pos: 77.4 },
    12: { L: 1, M: 74.0189, S: 0.03720, sd3neg: 65.8, sd2neg: 68.9, sd0: 74.0, sd2pos: 79.2, sd3pos: 81.7 },
    18: { L: 1, M: 80.7021, S: 0.03880, sd3neg: 72.0, sd2neg: 74.9, sd0: 80.7, sd2pos: 86.5, sd3pos: 89.4 },
    24: { L: 1, M: 86.4255, S: 0.04010, sd3neg: 76.5, sd2neg: 80.0, sd0: 86.4, sd2pos: 92.9, sd3pos: 96.0 },
    36: { L: 1, M: 95.1203, S: 0.04210, sd3neg: 83.6, sd2neg: 87.4, sd0: 95.1, sd2pos: 102.7, sd3pos: 106.5 },
    48: { L: 1, M: 102.731, S: 0.04350, sd3neg: 89.8, sd2neg: 94.1, sd0: 102.7, sd2pos: 111.3, sd3pos: 115.7 },
    60: { L: 1, M: 109.412, S: 0.04470, sd3neg: 95.2, sd2neg: 99.9, sd0: 109.4, sd2pos: 118.9, sd3pos: 123.7 }
    // ... Data lengkap bulan 0 s/d 60
  }
};
```

---

## 4. Skema Riwayat Pemeriksaan Stunting (Stunting Growth Log Schema)

Disimpan pada `AsyncStorage` dengan key: `@stunting_growth_records`:

```typescript
interface StuntingGrowthRecord {
  id: string;                      // Unique UUID
  timestamp: string;               // ISO 8601 String
  childName: string;               // Nama anak (misal "Adik Arka")
  gender: 'boy' | 'girl';          // Jenis kelamin
  ageMonths: number;               // Umur (0-60 bulan)
  heightLengthCm: number;          // Hasil ukur (cm)
  measurementType: 'PB' | 'TB';    // PB (<24m) atau TB (>=24m)
  zScore: number;                  // Nilai Z-Score (misal -1.45)
  category: 'severely_stunted' | 'stunted' | 'normal' | 'tall';
  statusLabel: string;             // "Normal (Tidak Stunting)", "Pendek", dll
  isStunted: boolean;              // true jika zScore < -2.0
  whoMedian: number;               // Nilai median referensi WHO (cm)
  advice: string;                  // Saran tindak lanjut
}
```

---

## 5. Skema Tautan Kuisioner (Questionnaire Links Schema)

```json
{
  "questionnaires": [
    {
      "id": "pretest",
      "title": "Kuesioner Pre-Test",
      "subtitle": "Evaluasi Awal Pengetahuan MP-ASI & Stunting",
      "description": "Mohon isi formulir ini sebelum Bunda membaca materi atau menggunakan fitur aplikasi untuk mengukur pemahaman awal.",
      "url": "https://forms.gle/YXgp728KKKNrk9aj6",
      "badge": "Langkah 1",
      "color": "#38A3D8"
    },
    {
      "id": "posttest",
      "title": "Kuesioner Post-Test",
      "subtitle": "Evaluasi Akhir Setelah Penggunaan Aplikasi",
      "description": "Mohon isi formulir ini setelah Bunda mempelajari materi dan mencoba fitur cek gizi di aplikasi ini.",
      "url": "https://forms.gle/6NPibUB7T2awLDRb6",
      "badge": "Langkah 2",
      "color": "#27AE60"
    }
  ]
}
```
