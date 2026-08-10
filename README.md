# E-MP ASI SMAD 🥣👶
### Aplikasi Edukasi, Evaluasi Mandiri Gizi MP-ASI, dan Kalkulator Stunting WHO (Usia 0–60 Bulan)

![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_54-0284C7?style=for-the-badge&logo=react)
![Kemenkes RI](https://img.shields.io/badge/Standar-Kemenkes_RI_%26_WHO-10B981?style=for-the-badge)
![Status](https://img.shields.io/badge/Version-1.0.0--Production-38A3D8?style=for-the-badge)

---

## 📖 1. Tentang Aplikasi

**E-MP ASI SMAD** adalah aplikasi kesehatan digital berbasis mobile dan web yang dikembangkan untuk membantu para ibu, kader Posyandu, dan tenaga kesehatan dalam memantau pemberian Makanan Pendamping Air Susu Ibu (MP-ASI) serta mendeteksi dini risiko *stunting* pada anak usia 0 hingga 60 bulan.

Aplikasi ini mengacu langsung pada pedoman baku:
1. **Standar Antropometri Anak Kemenkes RI (Permenkes No. 2 Tahun 2020)** & **WHO Child Growth Standards (2006)**.
2. **Pedoman Indikator Minimum Acceptable Diet (MAD/SMAD) WHO/UNICEF** untuk anak usia 6–23 bulan.
3. **Modul Edukasi MP-ASI Pencegahan Stunting** dari Kementerian Kesehatan RI & Poltekkes Kemenkes Jakarta III.

---

## ✨ 2. Fitur Utama Aplikasi

### 📚 A. Modul Informasi & Edukasi MP-ASI (6 Bab Terstruktur)
* **Bab 1: Pengertian MP-ASI & Standar SMAD**: Konsep dasar MP-ASI tepat 6 bulan (180 hari) dan formula kunci $\text{MAD} = \text{MDD} + \text{MMF}$.
* **Bab 2: Dasar & 6 Prinsip MP-ASI**: Prinsip Tepat Waktu, Adekuat, Porsi Bertahap, Tekstur Bertahap, Frekuensi Sesuai, Aman & Responsif beserta tabel panduan porsi & tekstur usia 6–8 bln, 9–11 bln, dan 12–23 bln.
* **Bab 3: 8 Kelompok Makanan & MDD**: Panduan 8 kelompok pangan standar WHO/UNICEF dan syarat minimal keragaman ($\ge 5$ kelompok).
* **Bab 4: Frekuensi Makan Minimum (MMF)**: Kebutuhan frekuensi makan utama dan camilan harian anak.
* **Bab 5: 5 Kunci Keamanan & Higienitas Pangan**: 5 langkah baku WHO menjaga kebersihan dan sanitasi makanan balita.
* **Bab 6: Pemberian Makan Responsif & Kasih Sayang**: Pendekatan *responsive feeding* tanpa paksaan serta **7 Daftar Periksa Cepat MAD di Rumah** dengan fitur interaktif *Tap-to-Check*.

---

### 🥗 B. Cek SMAD (Evaluasi Mandiri Kualitas MP-ASI Harian)
* **Evaluasi 3 Indikator WHO**:
  * **MDD (*Minimum Dietary Diversity*)**: Menghitung konsumsi minimal 5 dari 8 kelompok makanan dalam 24 jam terakhir.
  * **MMF (*Minimum Meal Frequency*)**: Memeriksa kecukupan frekuensi makan utama harian sesuai tahapan umur.
  * **MMFF (*Minimum Milk Feeding Frequency*)**: Memeriksa kecukupan konsumsi susu/olahan susu ($\ge 2\times$) khusus balita non-ASI.
* **Dashboard Hasil Premium**:
  * Skor hero keragaman pangan (`6 / 8`).
  * 3 kartu pilar evaluasi gizi ber-ikon.
  * **Grid Visual 8 Kelompok Makanan (2 Kolom)**: Menampilkan checklist chip hijau (`✓`) untuk makanan yang sudah dikonsumsi dan abu-abu (`○`) untuk yang belum dikonsumsi.
  * **Rekomendasi Menu Personal**: Rekomendasi spesifik mengenai bahan makanan bergizi yang perlu ditambahkan pada menu esok hari.

---

### 📏 C. Kalkulator Stunting Standar WHO (PB/U & TB/U)
* **Algoritma Antropometri Box-Cox LMS WHO (2006)**:
  * Formula: $Z = \frac{(X/M)^L - 1}{L \cdot S}$ (dan $Z = \frac{\ln(X/M)}{S}$ jika $L=0$).
  * Menghitung nilai Z-Score presisi untuk anak laki-laki dan perempuan usia 0–60 bulan.
* **Klasifikasi Status Pertumbuhan Permenkes No. 2/2020**:
  * $Z < -3\text{ SD}$: *Sangat Pendek (Severely Stunted)* 🔴
  * $-3\text{ SD} \le Z < -2\text{ SD}$: *Pendek (Stunted)* 🟠
  * $-2\text{ SD} \le Z \le +3\text{ SD}$: *Gizi Baik / Normal (Tidak Stunting)* 🟢
  * $Z > +3\text{ SD}$: *Tinggi* 🔵
* **Visual Z-Score Gauge Bar**: Menampilkan posisi pertumbuhan anak di atas spektrum kurva WHO beserta median standar usia.

---

### 📝 D. Kuisioner Penelitian Berjenjang (*Locked Workflow*)
* **Alur Validasi Penelitian**:
  $$\text{Pre-Test} \longrightarrow \text{Mempelajari Materi (Bab 1–6)} \longrightarrow \text{Post-Test (Terbuka Otomatis)}$$
* Form Post-Test terlindungi dan hanya akan terbuka (*unlocked*) setelah responden menyelesaikan Pre-Test dan membaca seluruh materi edukasi guna menjamin keabsahan data penelitian.

---

## 🛠️ 3. Teknologi & Dependensi

* **Framework**: [React Native](https://reactnative.dev/) dengan [Expo SDK 54](https://docs.expo.dev/)
* **Tipografi**: Google Font [Nunito](https://fonts.google.com/specimen/Nunito) (`@expo-google-fonts/nunito` & `expo-font`)
* **Desain & UI**: Sistem tema terpusat (`theme.js`), palet abu-abu arang lembut (`#334155`), aksen *Washi Tape*, dan *shadow elevation* modern.
* **Ikonografi**: `@expo/vector-icons` (*Feather*, *FontAwesome6*, *MaterialCommunityIcons*)
* **Penyimpanan Lokal**: `@react-native-async-storage/async-storage`
* **Navigasi**: `@react-navigation/native` & `@react-navigation/native-stack`

---

## 🚀 4. Cara Menjalankan Aplikasi

### Prasyarat:
* [Node.js](https://nodejs.org/) (Versi LTS $\ge 18.x$)
* npm atau yarn

### Langkah Instalasi & Menjalankan:
```bash
# 1. Masuk ke direktori proyek
cd empasi-smad

# 2. Pasang seluruh dependensi
npm install

# 3. Jalankan server pengembangan Expo
npx expo start
```

### Opsi Akses:
* **Web Browser**: Tekan tombol `w` di terminal Expo untuk membuka di browser lokal (`http://localhost:8081`).
* **HP Android / iOS**: Unduh aplikasi **Expo Go** di Play Store / App Store, lalu pindai (*scan*) QR Code yang muncul di terminal.

---

## 📂 5. Struktur Direktori Proyek

```
empasi-smad/
├── App.js                      # Root component, font loader Nunito & Navigation Container
├── app.json                    # Konfigurasi Expo SDK 54
├── Asset/                      # Dokumen materi, pedoman DOCX/PDF, dan aset gambar
├── src/
│   ├── components/
│   │   ├── common/             # ScreenContainer & background wrapper
│   │   └── custom/             # RibbonHeader, WashiTape, StepperCounter, ZScoreGauge, StickyCard
│   ├── constants/
│   │   ├── links.js            # Tautan Google Forms kuesioner
│   │   └── theme.js            # Design tokens: COLORS, FONTS, SHADOWS, SPACING
│   ├── data/
│   │   ├── educationContent.js # Konten materi 6 Bab edukasi MP-ASI
│   │   ├── foodGroups.js       # Data 8 Kelompok Makanan WHO/UNICEF
│   │   └── whoGrowthData.js    # Tabel parameter LMS WHO 0–60 bulan (L, M, S, SD)
│   ├── navigation/
│   │   └── AppNavigator.js     # Stack navigator (Splash, Home, Info, SMAD, Kalkulator, Kuisioner)
│   ├── screens/
│   │   ├── SplashScreen.js     # Layar pembuka / loading screen
│   │   ├── HomeScreen.js       # Menu utama 2x2 grid navigasi
│   │   ├── InformationScreen.js# Layar edukasi interaktif 6 bab
│   │   ├── SmadCheckScreen.js  # Layar evaluasi mandiri MP-ASI & MAD
│   │   ├── StuntingCalculatorScreen.js # Layar kalkulator stunting WHO
│   │   └── QuestionnaireScreen.js      # Layar kuesioner Pre-Test & Post-Test
│   └── services/
│       ├── smadService.js      # Logika komputasi MAD, MDD, MMF, MMFF
│       ├── stuntingService.js  # Logika komputasi Box-Cox LMS & Z-Score
│       └── storageService.js   # Penyimpanan progres kuesioner & riwayat lokal
└── README.md                   # Dokumentasi proyek
```

---

## 📄 6. Lisensi & Hak Cipta

Aplikasi ini dikembangkan untuk kebutuhan edukasi gizi dan penelitian pencegahan stunting balita Indonesia.  
© 2026 **Kementerian Kesehatan Republik Indonesia & Poltekkes Kemenkes Jakarta III**. Seluruh hak cipta dilindungi undang-undang.
