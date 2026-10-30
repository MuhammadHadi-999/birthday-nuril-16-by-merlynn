# Birthday Website — Nuril 16th

Website statis (HTML, CSS, JavaScript murni). Tidak butuh backend.

## Menjalankan
Buka `index.html` di browser (atau pakai ekstensi Live Server di VS Code).

## Mode test dan production
Edit `CONFIG` di bagian atas `js/script.js`:
- `mode: "test"`       -> countdown 15 detik
- `mode: "production"` -> menunggu `birthdayTarget` (2026-11-29T00:00:00+07:00)

Setelah countdown selesai, countdown tidak muncul lagi. Tombol "Kembali ke awal"
membawa ke kartu Happy Birthday.

## Aset
- Musik: taruh file yang boleh dipakai sebagai `assets/audio/bgm.mp3`
  (jangan memakai lagu berhak cipta tanpa izin).
- Gambar karakter: taruh di `assets/images/`.

## Deploy (Cloudflare Pages)
1. Upload folder ini ke repositori GitHub.
2. Cloudflare Pages -> Create project -> Connect to Git.
3. Build command: kosong. Output directory: `/`.
4. Pastikan `mode` sudah `"production"` sebelum dibagikan.

## Tema dan lagu (versi terbaru)
Tombol 🎨 Tema di kiri bawah (selalu tampil) mengganti tema, dan lagu ikut ganti:
1. Kuning pastel + pink pastel  -> assets/audio/bgm1.mp3
2. Ungu pastel + pink pastel    -> assets/audio/bgm2.mp3
3. Merah + gelap                -> assets/audio/bgm3.mp3
Klik ke-4 kembali ke tema 1. File bgm2.mp3 dan bgm3.mp3 harus kamu taruh sendiri.
