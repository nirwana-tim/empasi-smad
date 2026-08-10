import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0284C7"))
            self.drawString(45, 804, "E-MP ASI SMAD • Buku Panduan Penggunaan Aplikasi")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawRightString(550, 804, "Kemenkes RI & Poltekkes Kemenkes Jakarta III")
            self.setStrokeColor(colors.HexColor("#BAE6FD"))
            self.setLineWidth(0.75)
            self.line(45, 796, 550, 796)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(45, 40, 550, 40)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(45, 28, "Dokumen Panduan Teknis & Operasional • Aplikasi E-MP ASI SMAD")
        self.drawRightString(550, 28, f"Halaman {self._pageNumber} dari {page_count}")
        
        self.restoreState()


def build_pdf(filename="Panduan_Penggunaan_Aplikasi_EMPASI_SMAD.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=45,
        rightMargin=45,
        topMargin=48,
        bottomMargin=48,
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    style_cover_title = ParagraphStyle(
        'CoverTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0284C7'),
        alignment=1, # Center
        spaceAfter=3,
    )

    style_cover_subtitle = ParagraphStyle(
        'CoverSubtitle',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#334155'),
        alignment=1,
        spaceAfter=4,
    )

    style_cover_desc = ParagraphStyle(
        'CoverDesc',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#64748B'),
        alignment=1,
        spaceAfter=8,
    )

    style_h1 = ParagraphStyle(
        'Heading1_Custom',
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor('#0284C7'),
        spaceBefore=8,
        spaceAfter=4,
    )

    style_h2 = ParagraphStyle(
        'Heading2_Custom',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceBefore=6,
        spaceAfter=3,
    )

    style_body = ParagraphStyle(
        'Body_Custom',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=4,
    )

    style_bullet = ParagraphStyle(
        'Bullet_Custom',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#334155'),
        leftIndent=10,
        spaceAfter=2,
    )

    style_callout = ParagraphStyle(
        'Callout_Custom',
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor('#0369A1'),
    )

    style_table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=1,
    )

    style_table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#334155'),
    )

    story = []

    # ==================== HALAMAN 1: COVER & MODUL INFORMASI ====================
    story.append(Paragraph("E-MP ASI SMAD", style_cover_title))
    story.append(Paragraph("BUKU PANDUAN PENGGUNAAN APLIKASI", style_cover_subtitle))
    story.append(Paragraph(
        "Aplikasi Edukasi MP-ASI, Evaluasi Mandiri Gizi (MAD WHO), dan Kalkulator Stunting Balita Standar Kemenkes RI & WHO",
        style_cover_desc
    ))

    # Badge Box
    cred_table = Table(
        [[
            Paragraph("<b>Penyusun:</b> Tim Riset Poltekkes Kemenkes Jakarta III & Kementerian Kesehatan RI &nbsp;|&nbsp; <b>Standar:</b> Permenkes No. 2/2020 & WHO Child Growth Standards", style_callout)
        ]],
        colWidths=[505],
    )
    cred_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F0F9FF')),
        ('BORDER', (0, 0), (-1, -1), 0.75, colors.HexColor('#BAE6FD')),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
    ]))
    story.append(cred_table)
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#0284C7'), spaceBefore=6, spaceAfter=8))

    story.append(Paragraph("1. Pendahuluan & Latar Belakang", style_h1))
    story.append(Paragraph(
        "Stunting adalah kondisi gagal tumbuh kembang balita akibat kekurangan gizi kronis pada 1.000 Hari Pertama Kehidupan (0–23 bulan). Aplikasi <b>E-MP ASI SMAD</b> hadir sebagai solusi terpadu untuk memantau kecukupan gizi Makanan Pendamping ASI (MP-ASI) dan mendeteksi dini risiko stunting.",
        style_body
    ))
    story.append(Paragraph("Aplikasi ini memiliki 4 pilar utama: <b>(1) Modul Informasi Edukasi</b>, <b>(2) Cek SMAD</b>, <b>(3) Kalkulator Stunting</b>, dan <b>(4) Kuisioner Penelitian</b>.", style_body))

    story.append(Paragraph("2. Panduan Modul Informasi Edukasi MP-ASI", style_h1))
    story.append(Paragraph(
        "Modul Informasi memuat 6 bab terstruktur yang bersumber langsung dari Pedoman Kemenkes RI & WHO:",
        style_body
    ))

    info_data = [
        [Paragraph("Bab", style_table_header), Paragraph("Judul Modul", style_table_header), Paragraph("Pokok Bahasan Utama", style_table_header)],
        [
            Paragraph("<b>Bab 1</b>", style_table_cell),
            Paragraph("Pengertian MP-ASI & Standar SMAD", style_table_cell),
            Paragraph("Mulai tepat 6 bulan (180 hari), rumus MAD = MDD (Keragaman) + MMF (Frekuensi).", style_table_cell),
        ],
        [
            Paragraph("<b>Bab 2</b>", style_table_cell),
            Paragraph("Dasar & 6 Prinsip Emas MP-ASI", style_table_cell),
            Paragraph("Tepat Waktu, Adekuat, Porsi Bertahap, Tekstur Bertahap, Frekuensi Sesuai, Aman & Responsif + Tabel porsi.", style_table_cell),
        ],
        [
            Paragraph("<b>Bab 3</b>", style_table_cell),
            Paragraph("8 Kelompok Makanan & MDD", style_table_cell),
            Paragraph("Klasifikasi 8 kelompok pangan WHO/UNICEF dan syarat minimal konsumsi 5 dari 8 kelompok.", style_table_cell),
        ],
        [
            Paragraph("<b>Bab 4</b>", style_table_cell),
            Paragraph("Frekuensi Makan Minimum (MMF)", style_table_cell),
            Paragraph("Standar frekuensi makan utama (2–3x untuk 6–8 bln, 3–4x untuk 9–23 bln, 4x non-ASI) + 1–2x camilan.", style_table_cell),
        ],
        [
            Paragraph("<b>Bab 5</b>", style_table_cell),
            Paragraph("5 Kunci Keamanan & Higienitas", style_table_cell),
            Paragraph("5 Standar kebersihan WHO: Cuci tangan sabun, alat bersih, pisah mentah-matang, masak matang, air bersih.", style_table_cell),
        ],
        [
            Paragraph("<b>Bab 6</b>", style_table_cell),
            Paragraph("Pemberian Makan Responsif", style_table_cell),
            Paragraph("Responsive feeding tanpa paksaan + 7 Daftar Periksa Cepat MAD interaktif (*Tap-to-Check*).", style_table_cell),
        ],
    ]

    t_info = Table(info_data, colWidths=[40, 165, 300])
    t_info.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0284C7')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0, 0), (-1, -1), 4.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
    ]))
    story.append(t_info)

    story.append(PageBreak())

    # ==================== HALAMAN 2: CEK SMAD & KALKULATOR STUNTING ====================
    story.append(Paragraph("3. Panduan Evaluasi Mandiri Gizi MP-ASI (Cek SMAD)", style_h1))
    story.append(Paragraph(
        "Menu <b>Cek SMAD</b> menilai apakah makanan si kecil dalam 24 jam terakhir memenuhi kriteria <i>Minimum Acceptable Diet (MAD)</i> WHO/UNICEF.",
        style_body
    ))
    story.append(Paragraph("<b>Langkah Penggunaan:</b>", style_h2))
    story.append(Paragraph("1. Pilih kelompok usia anak: <code>6–8 Bulan</code> atau <code>9–23 Bulan</code>.", style_bullet))
    story.append(Paragraph("2. Tentukan status menyusu: <code>Ya</code> (masih ASI) atau <code>Tidak</code>. Jika ASI, Kelompok 1 otomatis terhitung.", style_bullet))
    story.append(Paragraph("3. Centang kelompok makanan yang dimakan kemarin dari 8 kelompok pangan bergizi.", style_bullet))
    story.append(Paragraph("4. Atur frekuensi makan utama dan frekuensi minum susu (khusus anak non-ASI) dengan tombol stepper <code>[ − ]</code> <code>[ + ]</code>.", style_bullet))
    story.append(Paragraph("5. Tekan tombol <b>'Evaluasi Gizi SMAD'</b> untuk melihat skor keragaman, status MAD, dan rekomendasi menu perbaikan.", style_bullet))

    mad_box = Table(
        [[
            Paragraph("<b>Standar Indikator MAD WHO/UNICEF:</b><br/>"
                      "• <b>MDD (Keragaman):</b> Konsumsi &ge; 5 dari 8 kelompok makanan.<br/>"
                      "• <b>MMF (Frekuensi):</b> &ge; 2x (6–8 bln ASI), &ge; 3x (9–23 bln ASI), &ge; 4x (anak non-ASI).<br/>"
                      "• <b>MMFF (Susu Non-ASI):</b> &ge; 2x konsumsi susu/olahan susu per hari bagi anak non-ASI.<br/>"
                      "• <b>Status MAD Terpenuhi:</b> Jika syarat MDD, MMF, dan MMFF seluruhnya tercapai.", style_callout)
        ]],
        colWidths=[505],
    )
    mad_box.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F0FDF4')),
        ('BORDER', (0, 0), (-1, -1), 0.75, colors.HexColor('#86EFAC')),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
    ]))
    story.append(mad_box)

    story.append(Paragraph("4. Panduan Penggunaan Kalkulator Stunting WHO", style_h1))
    story.append(Paragraph(
        "Kalkulator Stunting menggunakan algoritma antropometri <b>Box-Cox LMS WHO (2006)</b> dan <b>Permenkes RI No. 2 Tahun 2020</b> untuk menghitung Z-Score Panjang Badan / Tinggi Badan menurut Umur (PB/U & TB/U) balita usia 0–60 bulan.",
        style_body
    ))
    story.append(Paragraph("<b>Langkah Penggunaan:</b>", style_h2))
    story.append(Paragraph("1. Masukkan Nama Panggilan Anak dan pilih Jenis Kelamin (Laki-laki 👦 / Perempuan 👧).", style_bullet))
    story.append(Paragraph("2. Masukkan Umur (0–60 Bulan) dan Panjang/Tinggi Badan (cm) si kecil.", style_bullet))
    story.append(Paragraph("3. Tekan tombol <b>'Hitung Status Stunting'</b> untuk melihat nilai Z-Score presisi dan grafik posisi pertumbuhan anak.", style_bullet))

    z_data = [
        [Paragraph("Kategori Pertumbuhan", style_table_header), Paragraph("Rentang Z-Score", style_table_header), Paragraph("Artian Medis & Rekomendasi Tindak Lanjut", style_table_header)],
        [
            Paragraph("<font color='#DC2626'><b>Sangat Pendek</b></font><br/>(Severely Stunted)", style_table_cell),
            Paragraph("Z &lt; -3.0 SD", style_table_cell),
            Paragraph("Stunting berat. Segera konsultasikan ke Dokter Spesialis Anak/Puskesmas.", style_table_cell),
        ],
        [
            Paragraph("<font color='#D97706'><b>Pendek</b></font><br/>(Stunted)", style_table_cell),
            Paragraph("-3.0 SD &le; Z &lt; -2.0 SD", style_table_cell),
            Paragraph("Stunting sedang. Tingkatkan asupan protein hewani harian dan pantau di Posyandu.", style_table_cell),
        ],
        [
            Paragraph("<font color='#15803D'><b>Normal</b></font><br/>(Gizi Baik)", style_table_cell),
            Paragraph("-2.0 SD &le; Z &le; +3.0 SD", style_table_cell),
            Paragraph("Panjang/tinggi badan ideal standar WHO. Pertahankan pola makan bergizi.", style_table_cell),
        ],
        [
            Paragraph("<font color='#2563EB'><b>Tinggi</b></font><br/>(Tall)", style_table_cell),
            Paragraph("Z &gt; +3.0 SD", style_table_cell),
            Paragraph("Tinggi badan di atas rata-rata usia sebayanya. Pertahankan nutrisi optimal.", style_table_cell),
        ],
    ]

    t_z = Table(z_data, colWidths=[120, 95, 290])
    t_z.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0284C7')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0, 0), (-1, -1), 4.5),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
    ]))
    story.append(t_z)

    story.append(PageBreak())

    # ==================== HALAMAN 3: KUISIONER & FAQ ====================
    story.append(Paragraph("5. Panduan Pengisian Kuisioner Penelitian", style_h1))
    story.append(Paragraph(
        "Menu Kuisioner menggunakan metode berjenjang (*locked workflow*) untuk mengukur efektivitas edukasi gizi:",
        style_body
    ))
    story.append(Paragraph("1. <b>Langkah 1 (Pre-Test):</b> Responden membuka dan mengisi form Google Form Pre-Test sebelum membaca modul materi.", style_bullet))
    story.append(Paragraph("2. <b>Langkah 2 (Mempelajari Materi):</b> Responden mempelajari modul Informasi (Bab 1–6) hingga menekan tombol 'Selesai Belajar'.", style_bullet))
    story.append(Paragraph("3. <b>Langkah 3 (Post-Test):</b> Form Post-Test otomatis terbuka (*unlocked*) setelah langkah 1 dan 2 rampung.", style_bullet))

    story.append(Paragraph("6. Pertanyaan Umum & Bantuan Teknis", style_h1))
    story.append(Paragraph(
        "<b>T: Mengapa form Post-Test saya masih terkunci?</b><br/>"
        "J: Pastikan Bunda sudah mengisi form Pre-Test dan membaca modul Informasi hingga menekan tombol 'Selesai Belajar' di akhir Bab 6.",
        style_body
    ))
    story.append(Paragraph(
        "<b>T: Apakah data riwayat yang dimasukkan tersimpan aman?</b><br/>"
        "J: Ya, seluruh riwayat kalkulator dan evaluasi SMAD tersimpan secara privat di memori lokal (*AsyncStorage*) perangkat Anda.",
        style_body
    ))
    story.append(Paragraph(
        "<b>T: Apakah aplikasi ini dapat digunakan secara offline?</b><br/>"
        "J: Fitur Modul Informasi, Cek SMAD, dan Kalkulator Stunting dapat digunakan 100% secara offline tanpa internet. Internet hanya diperlukan saat membuka link Google Forms.",
        style_body
    ))

    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceBefore=4, spaceAfter=8))

    # Closing Signature Table
    closing_table = Table(
        [[
            Paragraph("<b>E-MP ASI SMAD Version 1.0.0</b><br/>Dikembangkan bersama Kementerian Kesehatan Republik Indonesia & Poltekkes Kemenkes Jakarta III.<br/>Hak Cipta © 2026. Seluruh hak cipta dilindungi undang-undang.", style_callout)
        ]],
        colWidths=[505],
    )
    closing_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BORDER', (0, 0), (-1, -1), 0.75, colors.HexColor('#E2E8F0')),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
    ]))
    story.append(closing_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated: {filename}")

if __name__ == "__main__":
    build_pdf()
