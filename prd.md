# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# Aplikasi Mobile: E-MP ASI SMAD (Standart Minimum Acceptable Diet)

---

## 1. Executive Summary & Ringkasan Produk

| Atribut | Keterangan |
| :--- | :--- |
| **Nama Aplikasi** | **E-MP ASI SMAD** (*Elektronik MP-ASI Standart Minimum Acceptable Diet*) |
| **Tagline** | *"Panduan Lengkap Untuk Ibu Bayi Usia 6–23 Bulan & Pencegahan Stunting"* |
| **Slogan Interaksi** | *"Halo Bunda, yuk cek kecukupan gizi makanan si kecil hari ini!"* |
| **Afiliasi / Stakeholder** | Kementerian Kesehatan RI (Kemenkes) & Poltekkes Kemenkes Jakarta III (BLU) |
| **Platform Target** | Android & iOS (React Native Expo SDK 54) |
| **Tipe Aplikasi** | Offline-first Hybrid Mobile Application |
| **Target Pengguna** | Ibu/Orang Tua Balita (6–23 bulan & 0–60 bulan), Kader Posyandu, Tenaga Kesehatan/Gizi |

### 1.1 Latar Belakang & Masalah
*Stunting* (gagal tumbuh akibat kekurangan gizi kronis) merupakan salah satu tantangan kesehatan prioritas di Indonesia. Periode usia **6–23 bulan** adalah jendela kritis (*critical window*) masa transisi dari ASI eksklusif ke Makanan Pendamping ASI (MP-ASI). 
Banyak orang tua dan pengasuh menghadapi kendala:
1. Kurangnya pemahaman tentang **keragaman pangan** (*Minimum Dietary Diversity / MDD*) dan **frekuensi makan** (*Minimum Meal Frequency / MMF*).
2. Kesulitan mengevaluasi secara mandiri apakah pola makan harian anak sudah memenuhi standar kecukupan diet minimal (**MAD / Minimum Acceptable Diet** WHO/UNICEF).
3. Keterbatasan akses pemantauan status pertumbuhan panjang/tinggi badan anak berbasis standar antropometri WHO (Z-Score PB/U atau TB/U).
4. Kebutuhan instrumen evaluasi edukasi kesehatan melalui *Pretest* dan *Posttest* yang terintegrasi untuk penelitian dan intervensi lapangan.

### 1.2 Tujuan Produk
1. Memberikan media edukasi interaktif tentang MP-ASI berkualitas dan higienitas untuk pencegahan *stunting*.
2. Menyediakan alat bantu periksa mandiri harian (**Cek SMAD**) berbasis standar indikator WHO/UNICEF 8 kelompok makanan & frekuensi makan.
3. Menyediakan **Kalkulator Stunting** presisi berbasis rumus antropometri Z-score WHO (*Length/Height-for-Age* 0–60 bulan).
4. Menyediakan pintu akses cepat (**Kuisioner**) untuk instrumen kuesioner penelitian *Pretest* dan *Posttest*.

---

## 2. Analisis Target Pengguna (User Persona)

### Persona 1: Bunda / Pengasuh Balita (Primary Persona)
* **Demografi**: Wanita, usia 20–40 tahun, memiliki bayi/balita usia 6–23 bulan.
* **Kebutuhan**: 
  * Ingin tahu apakah makanan si kecil hari ini sudah cukup beragam dan bernutrisi.
  * Membutuhkan rekomendasi menu bergizi, higienis, dan jadwal makan sesuai usia.
  * Ingin tahu apakah tinggi badan anaknya normal atau berisiko *stunting*.
* **Pain Points**: Bingung membedakan standar gizi bayi, khawatir anak GTM (Gerakan Tutup Mulut), minim waktu membaca buku tebal.

### Persona 2: Kader Posyandu & Tenaga Pelaksana Gizi (Secondary Persona)
* **Demografi**: Kader posyandu desa/kelurahan, bidan desa, nutrisionis puskesmas.
* **Kebutuhan**: 
  * Alat bantu cepat saat konseling meja Posyandu untuk skrining MAD & Z-score balita.
  * Bahan edukasi visual yang mudah dipahami warga saat penyuluhan kelompok.
* **Pain Points**: Perhitungan manual Z-score yang memakan waktu dan rentan salah hitung.

### Persona 3: Peneliti / Tim Akademisi Poltekkes Kemenkes Jakarta III (Researcher Persona)
* **Kebutuhan**: Mengukur efektivitas edukasi digital melalui evaluasi data *Pretest* dan *Posttest* sebelum dan sesudah intervensi.

---

## 3. Fitur Utama & Spesifikasi Fungsional

Aplikasi memiliki **4 Modul Utama** yang dapat diakses langsung dari Halaman Beranda (*Home Dashboard*):

```
                       ┌─────────────────────────┐
                       │      LOADING SCREEN     │
                       └────────────┬────────────┘
                                    │
                       ┌────────────▼────────────┐
                       │     BERANDA (HOME)      │
                       └────────────┬────────────┘
         ┌──────────────────┬───────┴──────────┬──────────────────┐
         │                  │                  │                  │
┌────────▼─────────┐ ┌──────▼─────────┐ ┌──────▼─────────┐ ┌──────▼─────────┐
│ 1. INFORMASI     │ │ 2. CEK SMAD    │ │ 3. KALKULATOR  │ │ 4. KUISIONER    │
│    (Edukasi MPASI│ │    (Self-Check │ │    STUNTING    │ │    (Pre & Post  │
│     & Stunting)  │ │     MAD 6-23m) │ │    WHO Z-score)│ │     G-Forms)    │
└──────────────────┘ └────────────────┘ └────────────────┘ └─────────────────┘
```

---

### Fitur 1: MODUL INFORMASI (Edukasi MP-ASI & Pencegahan Stunting)

Modul ini menyajikan ringkasan materi edukasi visual terstruktur bersumber dari panduan Kementerian Kesehatan RI dan WHO.

#### Struktur Konten Informasi:
1. **Pengertian Dasar MP-ASI & SMAD**:
   * Definisi SMAD (*Standart Minimum Acceptable Diet*): indikator gabungan kualitas (MDD) dan kuantitas (MMF).
   * Formula dasar: $\text{MAD} = \text{MDD (Keragaman)} + \text{MMF (Frekuensi)}$.
2. **Dasar & 6 Prinsip MP-ASI Pencegahan Stunting**:
   * *Prinsip 1*: Diberikan tepat waktu saat bayi berusia 6 bulan.
   * *Prinsip 2*: Porsi dinaikkan bertahap (mulai 2–3 sdm hingga ½–¾ mangkuk 250ml).
   * *Prinsip 3*: Tekstur bertahap (lumat/saring $\rightarrow$ lembik/cincang $\rightarrow$ makanan keluarga).
   * *Prinsip 4*: Frekuensi disesuaikan usia.
   * *Prinsip 5*: Menu beragam kaya protein hewani (telur, ikan, daging, ayam, hati).
   * *Prinsip 6*: Pemberian makan responsif, sabar, dan higienis.
3. **Keberagaman Pangan (8 Kelompok Makanan WHO)**:
   * 1. Serealia & umbi-umbian (beras, kentang, jagung, ubi, mie)
   * 2. Kacang-kacangan & biji-bijian (tahu, tempe, kacang hijau, kedelai)
   * 3. Produk susu / *dairy* (susu formula, yogurt, keju)
   * 4. Pangan hewani / daging (ayam, sapi, ikan, jeroan/hati)
   * 5. Telur (semua jenis telur unggas)
   * 6. Buah & sayuran kaya vitamin A (wortel, labu kuning, bayam, pepaya, mangga)
   * 7. Buah & sayuran lainnya (pisang, jeruk, apel, buncis, brokoli)
   * 8. ASI (Air Susu Ibu)
   * *Standar MDD*: Minimal **5 dari 8 kelompok makanan** dalam 24 jam terakhir.
4. **Frekuensi Makan Minimum (MMF)**:
   * Bayi 6–8 bulan (ASI): 2–3 kali makan utama + 1–2 kali camilan.
   * Anak 9–23 bulan (ASI): 3–4 kali makan utama + 1–2 kali camilan.
   * Anak 6–23 bulan (Non-ASI): Minimal 4 kali makan utama + minimal 2 kali pemberian susu.
5. **5 Langkah Higienitas & Keamanan Pangan (WHO Five Keys)**:
   * 1. Cuci tangan dengan sabun dan air mengalir.
   * 2. Gunakan peralatan makan bersih (hindari botol/dot, utamakan cangkir/sendok).
   * 3. Pisahkan bahan mentah dan makanan matang.
   * 4. Masak hingga matang sempurna (panas mendidih/beruap).
   * 5. Gunakan air bersih dan bahan baku segar.
6. **Feeding Rules & Pemberian Makan Responsif**:
   * Kenali sinyal lapar dan kenyang si kecil.
   * Ciptakan suasana makan menyenangkan tanpa paksaan dan tanpa distraksi berlebihan.
7. **Daftar Periksa Cepat (*Checklist*) MAD di Rumah**: Checklist interaktif harian untuk Bunda.

---

### Fitur 2: CEK MANDIRI SMAD (Minimum Acceptable Diet Calculator)

Fitur kalkulator skrining pola makan 24 jam terakhir untuk anak usia **6–23 bulan**.

#### Input Data:
1. **Usia Anak**: Radio Button / Segmented Control
   * `6 – 8 bulan`
   * `9 – 23 bulan`
2. **Status ASI**: Radio Button
   * `Ya (Masih menyusu ASI)`
   * `Tidak (Sudah tidak menyusu ASI)`
3. **Daftar 8 Kelompok Makanan yang Dikonsumsi (24 Jam Terakhir)**:
   * Checklist interaktif (Checkbox dengan ikon makanan menarik):
     * [x] ASI (*Otomatis tercentang dan terkunci jika status ASI = 'Ya'*)
     * [ ] Makanan Pokok (Beras, jagung, gandum, singkong, kentang, roti)
     * [ ] Kacang-kacangan (Tahu, tempe, kacang hijau, kedelai)
     * [ ] Susu & Olahannya (Susu sapi, UHT, formula, keju, yogurt)
     * [ ] Daging / Ayam / Ikan / Hati / Seafood (Protein hewani)
     * [ ] Telur (Ayam, bebek, puyuh)
     * [ ] Buah & Sayur Kaya Vitamin A (Bayam, wortel, labu kuning, tomat, pepaya)
     * [ ] Buah & Sayur Lainnya (Pisang, apel, melon, buncis, kol)
4. **Frekuensi Makan Makanan Padat/Lunak/Semi-padat**:
   * Interactive Counter Stepper `[ - ] [ Angka ] [ + ]` (Rentang: 0 sampai 10 kali).
5. **Frekuensi Pemberian Susu (Khusus jika Status ASI = 'Tidak')**:
   * Interactive Counter Stepper `[ - ] [ Angka ] [ + ]` (Rentang: 0 sampai 10 kali).

#### Logika Evaluasi & Algoritma (Business Logic):
1. **Perhitungan MDD (Minimum Dietary Diversity)**:
   $$\text{Skor MDD} = \sum (\text{Kelompok Makanan Terpilih})$$
   $$\text{Status MDD} = \begin{cases} \text{TERPENUHI (Lolos)}, & \text{jika Skor MDD} \ge 5 \\ \text{BELUM TERPENUHI}, & \text{jika Skor MDD} < 5 \end{cases}$$
2. **Perhitungan MMF (Minimum Meal Frequency)**:
   * *Kondisi A (Usia 6–8 bulan, Masih ASI)*: Target $\ge 2$ kali makan padat/lunak.
   * *Kondisi B (Usia 9–23 bulan, Masih ASI)*: Target $\ge 3$ kali makan padat/lunak.
   * *Kondisi C (Usia 6–23 bulan, Tidak ASI)*: Target $\ge 4$ kali makan padat/lunak.
3. **Perhitungan MMFF (Minimum Milk Feeding Frequency - Non-ASI)**:
   * Jika Masih ASI: Status MMFF = *Tidak berlaku (N/A)*.
   * Jika Tidak ASI: Target frekuensi susu $\ge 2$ kali per hari.
4. **Kesimpulan Akhir MAD (Standart Minimum Acceptable Diet)**:
   $$\text{MAD Terpenuhi} = \begin{cases} \text{MDD Terpenuhi} \land \text{MMF Terpenuhi}, & \text{jika Masih ASI} \\ \text{MDD Terpenuhi} \land \text{MMF Terpenuhi} \land \text{MMFF Terpenuhi}, & \text{jika Tidak ASI} \end{cases}$$

#### Output & Tampilan Hasil:
* **Banner Status Visual**:
  * 🟢 **MAD TERPENUHI**: Lencana Hijau, icon bintang/jempol ceria, pesan apresiasi.
  * 🔴 **MAD BELUM TERPENUHI**: Lencana Merah-Oranye lembut, pesan motivasi membangun.
* **Tabel Rincian Capaian**:
  * Keragaman Makanan (MDD): `x/8 kelompok` (✅/❌)
  * Frekuensi Makan (MMF): `x kali` (✅/❌)
  * Frekuensi Susu (MMFF): `x kali` (✅/❌/N/A)
* **Rekomendasi / Solusi Tindakan Personal**:
  * Jika MDD kurang: *"Tambahkan minimal (5 - x) kelompok makanan lagi, terutama prioritaskan Protein Hewani (telur/ikan/ayam) dan sayuran beraneka warna."*
  * Jika MMF kurang: *"Tingkatkan frekuensi makan si kecil menjadi minimal (target) kali sehari ditambah camilan sehat."*
  * Jika MMFF kurang: *"Untuk anak yang tidak menyusu ASI, pastikan memberikan susu/olahan susu minimal 2 kali sehari."*
* **Fitur Tambahan**: Tombol "Hitung Ulang" dan "Simpan Riwayat Pemeriksaan" (disimpan di penyimpanan lokal).

---

### Fitur 3: KALKULATOR STUNTING (WHO Child Growth Standards 2006)

Fitur kalkulator antropometri untuk menentukan status gizi berdasarkan indeks **Panjang Badan menurut Umur (PB/U)** untuk anak $<24$ bulan atau **Tinggi Badan menurut Umur (TB/U)** untuk anak $\ge 24$ bulan (rentang 0–60 bulan).

#### Input Data:
1. **Nama Anak** (Opsional/Label)
2. **Jenis Kelamin**: `Laki-laki` (Boy) / `Perempuan` (Girl)
3. **Tanggal Lahir / Umur dalam Bulan**: `0 – 60 bulan`
4. **Pengukuran Fisik**:
   * Input Nilai (cm) dengan desimal (misal `72.5 cm`).
   * Indikator Otomatis:
     * Umur $< 24$ bulan: Mode **Panjang Badan (PB)** - pengukuran posisi terlentang (*recumbent length*).
     * Umur $\ge 24$ bulan: Mode **Tinggi Badan (TB)** - pengukuran posisi berdiri (*standing height*).

#### Logika Perhitungan Antropometri (WHO Standard Formula):
Menggunakan parameter LMS WHO (*Lambda, Mu, Sigma*) atau Lookup Table Standar Deviasi WHO:

$$Z = \begin{cases} \dfrac{(X / M)^L - 1}{L \times S}, & \text{jika } L \neq 0 \\ \dfrac{\ln(X / M)}{S}, & \text{jika } L = 0 \end{cases}$$

*Dimana:*
* $X$ = Nilai Panjang/Tinggi Badan anak aktual (cm).
* $M$ = Nilai Median standar WHO menurut umur dan jenis kelamin.
* $L$ = Parameter Box-Cox power transformation WHO.
* $S$ = Parameter Koefisien Variasi WHO.

#### Klasifikasi Kategori Z-Score PB/U atau TB/U (Kemenkes & WHO):

| Rentang Z-Score | Kategori Pertumbuhan (WHO) | Status Stunting | Aksi & Rekomendasi Klinis |
| :--- | :--- | :--- | :--- |
| $Z < -3\text{ SD}$ | Sangat Pendek (*Severely Stunted*) | 🔴 **STUNTING (BERAT)** | Segera rujuk ke Puskesmas / Dokter Spesialis Anak untuk intervensi gizi intensif. |
| $-3\text{ SD} \le Z < -2\text{ SD}$ | Pendek (*Stunted*) | 🟠 **STUNTING** | Konsultasikan ke Posyandu/Puskesmas, evaluasi pola asuh & asupan protein hewani MP-ASI. |
| $-2\text{ SD} \le Z \le +3\text{ SD}$ | Normal | 🟢 **TIDAK STUNTING (NORMAL)** | Pertahankan pola makan bergizi seimbang SMAD dan pantau rutin setiap bulan. |
| $Z > +3\text{ SD}$ | Tinggi (*Tall*) | 🔵 **TIDAK STUNTING (TINGGI)** | Pertumbuhan optimal, lanjutkan pola makan sehat. |

#### Output Tampilan Hasil:
* Visual Gauge / Progress Meter Z-Score interaktif yang memperlihatkan posisi anak terhadap kurva normal WHO.
* Kartu Status Hasil (Lencana status + Nilai Z-Score presisi, misal: `-1.42 SD (Normal)`).
* Saran tindakan yang jelas dan ramah ibu.
* Tombol "Simpan Hasil" untuk memantau grafik riwayat pertumbuhan balita.

---

### Fitur 4: MODUL KUISIONER (Pretest & Posttest)

Modul evaluasi intervensi edukasi untuk mendukung kegiatan penelitian / posyandu.

#### Spesifikasi Fitur:
* Menu pemilihan kuesioner dengan 2 kartu/opsi utama:
  1. **Pre-Test Kuesioner**: Evaluasi pengetahuan awal sebelum membaca materi aplikasi.
     * URL Target: `https://forms.gle/YXgp728KKKNrk9aj6`
  2. **Post-Test Kuesioner**: Evaluasi peningkatan pengetahuan setelah menggunakan aplikasi.
     * URL Target: `https://forms.gle/6NPibUB7T2awLDRb6`
* **Metode Pembukaan**:
  * Opsi 1: Pembukaan via *In-App Browser* (menggunakan `expo-web-browser`) sehingga pengguna tidak perlu keluar dari aplikasi.
  * Opsi 2: *Fallback* buka di aplikasi browser eksternal via `Linking.openURL()`.
* Panduan & tata cara pengisian kuesioner yang informatif.

---

## 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

1. **Kinerja & Responsivitas (Performance)**:
   * Waktu *cold start* aplikasi $\le 2.0$ detik.
   * Waktu respon kalkulasi Z-Score dan SMAD $\le 50$ milidetik (kalkulasi instan pada *client side*).
2. **Ketersediaan Offline (Offline-First)**:
   * Seluruh fitur utama (Informasi, Cek SMAD, Kalkulator Stunting, Riwayat Lokal) dapat berjalan 100% **tanpa koneksi internet**.
   * Koneksi internet hanya dibutuhkan saat membuka tautan Google Forms Kuisioner.
3. **Aksesibilitas & Kemudahan Penggunaan (Usability)**:
   * Target pengguna mencakup ibu-ibu dengan berbagai latar belakang literasi digital.
   * Desain tombol dengan *hitbox* minimal $48 \times 48\text{ dp}$.
   * Kontras teks memenuhi standar WCAG AA.
   * Bahasa pengantar adalah Bahasa Indonesia santai, hangat, dan mudah dimengerti (*mother-friendly*).
4. **Kompatibilitas Platform**:
   * Android 8.0 (API Level 26) ke atas.
   * iOS 15.0 ke atas.
   * Expo SDK 54, React Native 0.81+, React 19.

---

## 5. Matriks Pengguna & Hak Akses

| Fitur | Pengguna Tamu / Ibu (Bunda) | Kader Posyandu | Peneliti / Admin |
| :--- | :---: | :---: | :---: |
| Membaca Materi Informasi | ✅ | ✅ | ✅ |
| Cek Mandiri SMAD | ✅ | ✅ | ✅ |
| Hitung Kalkulator Stunting | ✅ | ✅ | ✅ |
| Buka Form Pretest / Posttest | ✅ | ✅ | ✅ |
| Simpan Riwayat di HP | ✅ | ✅ | ✅ |

*Catatan: Aplikasi tidak mewajibkan login/registrasi akun yang rumit untuk mempermudah akses instan di Posyandu.*

---

## 6. Kriteria Penerimaan (Acceptance Criteria)

* **AC-01 (Beranda)**: Pengguna dapat melihat 4 modul utama (Informasi, SMAD, Kalkulator Stunting, Kuisioner) dengan layout kartu *sticky-note* bergaya ceria sesuai referensi mockup.
* **AC-02 (SMAD Logic)**: Algoritma SMAD berhasil menghitung status MDD (target $\ge 5/8$), MMF, dan MMFF secara akurat sesuai standar WHO/UNICEF.
* **AC-03 (Z-Score Accuracy)**: Nilai Z-Score tinggi/panjang badan menurut umur terhitung akurat sesuai standar tabel antropometri WHO 2006 dengan deviasi $< 0.01\text{ SD}$.
* **AC-04 (Offline Mode)**: Aplikasi dapat digunakan untuk membaca edukasi, menghitung SMAD, dan menghitung Z-score saat perangkat dalam *Airplane Mode*.
* **AC-05 (Kuisioner Integration)**: Menekan kartu Pre-test atau Post-test berhasil membuka link Google Form yang sesuai.
