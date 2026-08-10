# DESIGN SYSTEM & UI/UX SPECIFICATION
# E-MP ASI SMAD (Standart Minimum Acceptable Diet)

---

## 1. Filosofi & Konsep Desain

Aplikasi **E-MP ASI SMAD** mengusung konsep visual:
> **"Warm, Playful, Friendly & Reassuring Healthcare Scrapbook"**

* **Emosi Utama**: Ramah (*friendly*), menenangkan (*reassuring*), ceria (*cheerful*), dan mudah dicerna oleh para Bunda tanpa kesan medis yang kaku/menakutkan.
* **Gaya Visual**: *Pastel Scrapbook / Sticky Notes & Washi Tape* dipadukan dengan aksen modern dan tipografi yang jelas (*legible*).
* **Karakteristik Elemen**:
  * Sudut membulat lembut (*rounded corners* $16\text{px} - 24\text{px}$).
  * Kartu bertekstur garis buku/buku tulis (*notebook lines*) dengan pita perekat washi tape kuning (*washi tape accent*).
  * Banner pita (*ribbon banner*) bersudut miring untuk judul modul.
  * Watermark latar belakang berlogo instansi (Kemenkes & Poltekkes Jakarta III BLU) yang elegan dan transparan.

---

## 2. Skema & Palet Warna (Color Palette)

Palet warna diekstraksi langsung dari aset desain (*mockup* `beranda.png`, `bgsmad.png`, `LoadingScreen.png`, dll) dan diselaraskan untuk kebutuhan UI modern:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             PRIMARY & ACCENTS                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ Primary Blue │  │ Ribbon Teal  │  │ Washi Yellow │  │ Pastel Sky (BG) │  │
│  │   #38A3D8    │  │   #4E9E9C    │  │   #F9C73D    │  │     #EAF8FE     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────────┘  │
│                                                                             │
│                            SEMANTIC & STATUS                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ Success/Good │  │ Stunting/Warn│  │ Warning/Info │  │ Neutral Dark    │  │
│  │   #27AE60    │  │   #E74C3C    │  │   #F39C12    │  │     #1E293B     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Tabel Kode Warna Detail (Color Tokens)

| Token Desain | Hex Code | RGB | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| `color-primary` | `#38A3D8` | `rgb(56, 163, 216)` | Warna utama tombol, header beranda, teks highlight |
| `color-primary-dark` | `#1D76A5` | `rgb(29, 118, 165)` | State pressed tombol, outline teks judul |
| `color-primary-light` | `#D3EBF8` | `rgb(211, 235, 248)` | Latar belakang kartu menu beranda |
| `color-bg-screen` | `#EAF8FE` | `rgb(234, 248, 254)` | Latar belakang layar umum aplikasi |
| `color-bg-screen-alt` | `#F4FBFF` | `rgb(244, 251, 255)` | Area konten sekunder |
| `color-ribbon-teal` | `#4E9E9C` | `rgb(78, 158, 156)` | Pita header modul (Cek SMAD, Kalkulator, dll) |
| `color-ribbon-teal-dark`| `#387B7A` | `rgb(56, 123, 122)` | Shadow/border pada ribbon |
| `color-washi-tape` | `#F9C73D` | `rgb(249, 199, 61)` | Lakban/selotip kuning di sudut kartu |
| `color-washi-tape-dark`| `#E5AC18` | `rgb(229, 172, 24)` | Shadow pita selotip |
| `color-card-line` | `#B0D7EE` | `rgb(176, 215, 238)` | Garis horizontal efek buku pada kartu |
| `color-text-title` | `#0F172A` | `rgb(15, 23, 42)` | Judul utama dan heading tebal |
| `color-text-body` | `#334155` | `rgb(51, 65, 85)` | Paragraf teks dan deskripsi umum |
| `color-text-muted` | `#64748B` | `rgb(100, 116, 139)` | Subteks, satuan cm/bulan, placeholder |
| `color-success` | `#27AE60` | `rgb(39, 174, 96)` | Lencana MAD Terpenuhi, Status Normal |
| `color-danger` | `#E74C3C` | `rgb(231, 76, 60)` | Lencana MAD Belum Terpenuhi, Stunting |
| `color-warning` | `#F39C12` | `rgb(243, 156, 18)` | Indikasi waspada / perbaikan menu |
| `color-white` | `#FFFFFF` | `rgb(255, 255, 255)` | Kontainer putih, kartu modal |

---

## 3. Tipografi (Typography)

Aplikasi menggunakan kombinasi font sans-serif modern yang ramah keluarga dengan kontras tinggi:

* **Header / Title Font**: `Fredoka-Bold` / `Poppins-ExtraBold` / `Nunito-Black` (Rounded, Bold, Playful).
* **Body / Subtitle Font**: `PlusJakartaSans-Regular` / `Poppins-Medium` / `Inter-Regular` (Clean, High Legibility).

### 3.1 Skala Tipografi (Type Scale)

| Tingkat Tipografi | Ukuran (Size) | Weight | Line Height | Contoh Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Display 1** | `28px` / `32sp` | 800 (Extra Bold) | `36px` | Judul "BERANDA", "E-MP ASI SMAD" |
| **Heading 1** | `22px` / `24sp` | 700 (Bold) | `28px` | Judul Ribbon Screen ("Kalkulator Stunting") |
| **Heading 2** | `18px` / `20sp` | 700 (Bold) | `24px` | Judul Kartu Menu ("INFORMASI", "SMAD") |
| **Heading 3** | `16px` / `18sp` | 600 (Semi Bold)| `22px` | Label Pertanyaan Form ("1. Usia Anak") |
| **Body Regular** | `14px` / `16sp` | 400 (Regular) | `20px` | Deskripsi edukasi, panduan pengisian |
| **Body Bold** | `14px` / `16sp` | 600 (Semi Bold)| `20px` | Opsi pilihan, status badge, data tabel |
| **Caption / Small**| `12px` / `13sp` | 400 (Regular) | `16px` | Catatan kaki, sumber referensi WHO |

---

## 4. Anatomi Komponen UI Unik (Custom Components)

### 4.1 Kartu Menu Beranda Bergaya *Sticky Note*
Setiap kartu menu pada Beranda (`Asset/informasi.png`, `Asset/SMAD.png`, `Asset/kalkulator.png`, `Asset/kuisioner.png`) memiliki struktur:

```
    ┌───┐ (Washi Tape Kiri Atas - Rotasi -12°)
    │   │
┌───┴───┴───────────────────────┐
│ ═════════════════════════════ │ (Garis Buku Biru Muda)
│          [ ILUSTRASI ]        │ (Karakter Kartun Ceria)
│ ═════════════════════════════ │
│ ═════════════════════════════ │
│         JUDUL MENU            │ (Font Black/Heavy 18px)
└───────────────────────────────┴───┬───┐
                                    │   │ (Washi Tape Kanan Atas - Rotasi 15°)
                                    └───┘
```
* **Spesifikasi Kartu**:
  * Latar Belakang: `#D3EBF8` dengan efek garis `#B0D7EE` berjarak $18\text{px}$.
  * Bayangan (*Drop Shadow*): `offset: (0, 6)`, `opacity: 0.12`, `radius: 8`.
  * Washi Tape: Kotak kuning `#F9C73D` transparan ($90\%$) dengan sudut dipotong miring atau zigzag.

### 4.2 Header Ribbon Sub-Screen (Banner Pita)
Pada halaman *Cek SMAD*, *Kalkulator Stunting*, dan *Kuisioner*:
* Bentuk: Kotak panjang horizontal dengan ujung kanan berbentuk panah pita (*chevron cut* / *flag banner*).
* Warna: Teal tosca `#4E9E9C` dengan teks putih atau hitam tebal (`#0F172A`) dengan stroke/shadow halus.
* Ketinggian: $56\text{px} - 64\text{px}$.

### 4.3 Stepper Counter `[ - ] [ Angka ] [ + ]`
Komponen penambah/pengurang frekuensi makan:
* Tombol Minus `[-]`: Lingkaran/kotak tumpul `#38A3D8` dengan ikon `-`.
* Tampilan Nilai: Kotak putih `#FFFFFF` di tengah dengan border `#38A3D8`, font size `20px` Bold.
* Tombol Plus `[+]`: Lingkaran/kotak tumpul `#38A3D8` dengan ikon `+`.

### 4.4 Checkbox 8 Kelompok Makanan
* Desain: Baris kartu sentuh interaktif dengan ikon kelompok makanan berwarna + nama kelompok + kotak centang custom bergaya pensil/centang tebal hijau.
* State Aktif: Border hijau tosca `#27AE60`, latar belakang hijau lembut `#E8F8F0`.

---

## 5. Blueprint Layar & Alur Navigasi (Screen Mockup Flow)

```
 [1. SPLASH / LOADING]
        │ (Auto redirect 2 detik)
        ▼
 [2. BERANDA DASHBOARD]
        ├───► [3. INFORMASI EDUKASI]
        │        ├── Tab: Pengertian & SMAD
        │        ├── Tab: 6 Prinsip MPASI
        │        ├── Tab: 8 Kelompok Pangan (MDD)
        │        ├── Tab: Frekuensi Makan (MMF)
        │        ├── Tab: 5 Kunci Higienitas WHO
        │        └── Tab: Checklist Mandiri Rumah
        │
        ├───► [4. CEK MANDIRI SMAD]
        │        ├── Step 1: Usia & Status ASI
        │        ├── Step 2: Checklist 8 Kelompok Makanan
        │        ├── Step 3: Input Frekuensi Makan & Susu
        │        └── Step 4: Hasil Evaluasi MAD (Status + Rekomendasi)
        │
        ├───► [5. KALKULATOR STUNTING]
        │        ├── Form: Nama, Gender, Usia (0-60m), PB/TB (cm)
        │        └── Hasil: Z-Score Gauge, Kategori Stunting, Saran Gizi
        │
        └───► [6. KUISIONER]
                 ├── Kartu Pre-Test (Buka Form Riset)
                 └── Kartu Post-Test (Buka Form Riset)
```

---

## 6. Detail Desain Tiap Layar

### Layar 1: Splash / Loading Screen (`Asset/LoadingScreen.png`)
* **Latar Belakang**: Pola watermark Kemenkes & Poltekkes BLU lembut.
* **Elemen Visual**:
  * Judul besar membulat: **"E-MP ASI SMAD"** dengan outline tebal.
  * Karakter ilustrasi bayi lucu merangkak bermain balok huruf (`B-A-B-Y`) dan mainan *rattle*.
  * Teks Subtitle: *"Panduan Lengkap Untuk Ibu Bayi Usia 6-23 Bulan"*.
  * Tagline bawah: *"APP"*.
  * Progress Bar / Spinner lembut bertema tosca.

### Layar 2: Beranda Dashboard (`Asset/beranda.png`)
* **Top Header**: Banner Pita Motif Grid Kotak-kotak Biru bertuliskan **"BERANDA"** (`Asset/iconberanda.png`).
* **Greeting Box**:
  * Teks: *"HALO BUNDA, YUK CEK KECUKUPAN GIZI MAKANAN SI KECIL HARI INI!"* (Huruf kapital tebal, warna `#0F172A`).
* **Grid 2x2 Menu Sticky Notes**:
  * **Kiri Atas**: `INFORMASI` (Ilustrasi Bunda menggendong bayi tersenyum).
  * **Kanan Atas**: `SMAD` (Ilustrasi piring gizi seimbang dengan 8 kelompok makanan).
  * **Kiri Bawah**: `KALKULATOR STUNTING` (Ilustrasi bayi ditimbang di timbangan bayi).
  * **Kanan Bawah**: `KUISIONER` (Ilustrasi berkas kertas kuesioner dengan ikon tanda tanya `?`).

### Layar 3: Layar Informasi Edukasi
* **Header**: Pita Ribbon Tosca bertuliskan **"Informasi Edukasi"**.
* **Navigasi Tab/Pills Carousel**: Memudahkan Bunda berpindah topik edukasi tanpa scrolling terlalu panjang.
* **Card Interaktif**: Ilustrasi warna cerah, poin bernomor dengan ikon bulat, tips praktis singkat.

### Layar 4: Layar Cek Mandiri SMAD (`Asset/bgsmad.png`)
* **Header**: Pita Ribbon Tosca bertuliskan **"Cek SMAD"**.
* **Card Formulir**:
  * Pilihan Usia: Toggle Pill `6-8 Bulan` | `9-23 Bulan`.
  * Status Menyusu: Toggle Pill `Ya, masih ASI` | `Tidak`.
  * Grid Checklist 8 Kelompok Makanan dengan visual menarik.
  * Counter Stepper Frekuensi Makan `[-] [ 3 ] [+]`.
  * Counter Stepper Frekuensi Susu (kondisional).
* **Modal / Bottom Sheet Hasil**:
  * Kartu Lencana Hasil dengan efek confetti lembut jika MAD Terpenuhi.
  * Kartu breakdown detail rekomendasi perbaikan.

### Layar 5: Layar Kalkulator Stunting (`Asset/bgkalkulator.png`)
* **Header**: Pita Ribbon Tosca bertuliskan **"Kalkulator Stunting"**.
* **Formulir**:
  * Segmented Switch: `Laki-laki 👦` | `Perempuan 👧`.
  * Input Umur (Bulan) dengan slider atau text input `[ 12 ] Bulan`.
  * Input Panjang/Tinggi Badan `[ 74.5 ] cm`.
* **Visualisasi Gauge Kurva Pertumbuhan**: Menunjukkan titik anak pada spektrum `<-3 SD`, `-3 SD s/d -2 SD`, `-2 SD s/d +3 SD`, `>+3 SD`.

### Layar 6: Layar Kuisioner (`Asset/bgkuisiner.png`)
* **Header**: Pita Ribbon Tosca bertuliskan **"Kuisioner"**.
* **Kartu Pilihan**:
  * 📋 **Pre-Test**: Kartu warna biru lembut dengan deskripsi *"Kerjakan sebelum membaca materi aplikasi"*.
  * 📝 **Post-Test**: Kartu warna hijau pastel lembut dengan deskripsi *"Kerjakan setelah menggunakan dan mempelajari aplikasi"*.
* Tombol interaktif "Buka Formulir" dengan integrasi in-app browser.

---

## 7. Pedoman Aset & Animasi (Micro-Interactions)

1. **Haptic Feedback**: Getaran ringan (*light haptic*) pada tombol counter stepper dan pemilihan checkbox.
2. **Animasi Transisi Halaman**: *Slide from right* dengan durasi $250\text{ms}$ kurva *ease-in-out*.
3. **Animasi Kartu Ditekan**: *Scale down* ke $0.97$ saat *press in* dan kembali ke $1.0$ saat *press out*.
4. **Watermark Background**: Dibuat sebagai `ImageBackground` dengan `resizeMode="cover"` menggunakan gambar `Asset/defaultbg.png` atau komponen SVG responsif.
