# 💼 Karirku AI

Karirku AI adalah aplikasi chatbot berbasis React yang dirancang untuk membantu pengguna dalam pengembangan karier, persiapan wawancara kerja, pembuatan CV, dan strategi mencari pekerjaan. Menggunakan teknologi Google Gemini AI, Karirku AI menghadirkan pengalaman interaktif layaknya ngobrol dengan Career Coach pribadi.

---

## 🚀 Fitur Utama

- ✅ Chatbot AI bertema *Career Coach*
- ✅ Simulasi interview interaktif
- ✅ Tips membuat CV & resume
- ✅ Saran pengembangan diri dan karier
- ✅ Mode terang & gelap
- ✅ Simpan dan akses riwayat chat
- ✅ Tombol "Stop Generating" untuk menghentikan respons AI
- ✅ UI modern dengan sidebar animasi

---

## 🧠 Teknologi yang Digunakan

- **React + TypeScript**
- **Tailwind CSS** untuk styling
- **Google Gemini API** (via `@google/generative-ai`)
- **Lucide React Icons**
- **LocalStorage** untuk menyimpan riwayat percakapan

---

## 🛠️ Instalasi

1. **Clone repository ini**
```bash
git clone https://github.com/danielaugust67/karirku-ai.git
cd karirku-ai
```

2. **Install dependencies**
```bash
npm i
```

3. **Siapkan API Key dari Google Gemini AI**

- Daftar di Google AI Studio
- Buat file .env atau ubah langsung di config.ts:
```bash
export const GEMINI_API_KEY = "YOUR_API_KEY_HERE";
```

4.**Jalankan aplikasi**
```bash
npm run dev

```
