# Belajar Bersama Sapo — Kajian & Reka Bentuk

Permainan pendidikan untuk kanak-kanak **4 tahun**. Dokumen ini terangkan kenapa setiap kandungan & ciri dipilih.

## 1. Apa yang kanak-kanak 4 tahun biasanya boleh buat

| Bidang | Rujukan | Kesan pada game |
|---|---|---|
| Menamakan beberapa warna | CDC "Learn the Signs. Act Early." — milestone kognitif 4 tahun | Game **Warna**: 4 → 7 warna → warna benda sebenar |
| Faham konsep membilang (nombor kecil) | Senarai milestone CDC lama & sumber pediatrik (U. Michigan) | Game **Kira**: 1–3 → 1–5 → 1–10 (susunan *ten-frame* 5+5 untuk bantu *subitizing*) |
| Memberitahu apa yang berlaku seterusnya | CDC 4 tahun (urutan cerita) | Game **Corak**: AB → AAB/ABB → ABC |
| Mula kenal huruf, terutama huruf dalam nama sendiri | Literasi awal KSPK (Tunjang Komunikasi), 4+ | Game **Huruf**: huruf besar A–Z + perkataan Melayu bermula dengan huruf itu |
| Perbandingan & klasifikasi | KSPK Matematik Awal (Tunjang Sains & Teknologi) | Game **Besar Kecil**: besar/kecil → 3 saiz → banyak/sedikit |
| Mengenal persekitaran & haiwan | KSPK Sains Awal | Game **Haiwan**: ladang → hutan (Harimau Malaya!) → laut |
| Ingatan kerja & tumpuan | Perkembangan fungsi eksekutif prasekolah | Game **Padan Kad**: 3 → 4 → 6 pasang |
| Bentuk asas | KSPK Matematik Awal | Game **Bentuk**: 3 → 5 → 7 bentuk |

> Milestone CDC ialah apa yang ≥75% kanak-kanak boleh buat pada umur itu, jadi tahap 1 setiap game sengaja dibuat mudah dan tahap 3 sebagai cabaran.

## 2. Prinsip reka bentuk untuk umur 4 tahun

- **Tak perlu membaca.** Setiap arahan disebut dengan suara (Web Speech API, Bahasa Melayu `ms-MY`; jika tiada, guna suara Indonesia `id-ID`). Butang 🔊 / tekan kotak soalan untuk dengar lagi.
- **Sasaran sentuh besar** (≥ 100 px), maksimum 2–4 pilihan setiap soalan.
- **Tiada "kalah".** Jawapan salah = goyang lembut + "Cuba lagi", pilihan itu dipudarkan. Selepas 2 kali salah, jawapan betul berdenyut sebagai petunjuk. Setiap pusingan sentiasa dapat sekurang-kurangnya 1 bintang.
- **Pusingan pendek**: 5 soalan (±1–2 minit) — sesuai dengan tempoh tumpuan prasekolah.
- **Ganjaran jelas**: bintang (1–3), pelekat baru setiap kali tahap pertama kali selesai (24 pelekat), konfeti & muzik.
- **Pembelajaran adaptif**: item yang selalu salah (cth. huruf Q, warna ungu) muncul lebih kerap; item yang sama tidak diulang berturut-turut.
- **Pengukuhan**: selepas jawapan betul, Sapo ulang konsep ("Satu, dua, tiga. Tiga epal!", "B untuk buku!", "Penyu bertelur di pantai.").

## 3. Masa skrin

- AAP (2016): umur 2–5 tahun → **tidak lebih 1 jam sehari** kandungan berkualiti tinggi, sebaik-baiknya **ditonton/dimain bersama ibu bapa**; tiada skrin semasa makan & sejam sebelum tidur.
- Oleh itu: **had masa harian** (lalai 20 minit, boleh ubah 10–60 minit atau tiada). Bila cukup, keluar skrin "Masa rehat!" dan hanya ibu bapa boleh tambah masa.
- Zon ibu bapa ada tip main bersama.

## 4. Kemajuan & data

- Berbilang profil anak (nama + avatar).
- Setiap game: 3 tahap, tahap seterusnya dibuka selepas tahap sebelum selesai.
- **Zon Ibu Bapa** (dikunci soalan tambah, cth. 7 + 5): jumlah bintang, tahap selesai, pelekat, % betul cubaan pertama, masa hari ini, hari berturut-turut, carta masa 7 hari, penguasaan setiap kemahiran, senarai "perlu latihan lagi".
- Semua data dalam `localStorage` peranti sahaja — tiada akaun, tiada iklan, tiada penjejak. Boleh eksport/import fail JSON sebagai sandaran.

## 5. Teknikal (PWA)

- HTML/CSS/JS biasa, tiada build step. Fail: `index.html`, `style.css`, `data.js` (kandungan), `app.js` (logik), `sw.js` (offline), `manifest.webmanifest`, `icons/`.
- Service worker cache semua fail → **boleh main tanpa internet** selepas buka sekali.
- Boleh "Add to Home Screen" (Android/iOS) dan dibuka skrin penuh seperti aplikasi.
- Bunyi kesan dijana dengan Web Audio (tiada fail audio). Gambar guna emoji + SVG (saiz kecil).
- Untuk tambah kandungan: ubah `data.js`. Untuk kemas kini versi offline: tukar `V` dalam `sw.js`.

## Rujukan

- CDC — Milestones by 4 Years: https://www.cdc.gov/act-early/milestones/4-years.html
- CDC — milestone 4 tahun (versi arkib, termasuk membilang): https://webharvest.gov/congress115th/20190113061547/https://www.cdc.gov/ncbddd/actearly/milestones/milestones-4yr.html
- Michigan Medicine — 4 Year Developmental Milestones: https://www.med.umich.edu/1libr/Pediatrics/4YearDevelopmentalMilestones.pdf
- KPM — Kurikulum Standard Prasekolah Kebangsaan (KSPK) Semakan 2017: https://anyflip.com/japld/fvtj/basic
- AAP via Michigan Medicine — When kids should and shouldn't use digital media: https://www.michiganmedicine.org/childrens-health/aap-when-your-kids-should-and-shouldnt-use-digital-media
- KidsHealth — Media use guidelines: preschoolers: https://kidshealth.org/CHW/en/parents/screentime-preschool.html
