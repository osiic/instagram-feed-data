# Dokumentasi Fitur Instagram Public Data Scraper (Dari Nol)

Dokumentasi ini dibuat khusus untuk memindahkan fitur penayangan feed Instagram publik ke dalam dashboard proyek utama kamu dengan arsitektur **Database-First Caching**.

---

## 1. Konsep & Arsitektur Utama

### Mengapa Pendekatan Ini Dipilih?
1. **Bebas Hambatan Meta OAuth**: Tidak perlu membuat Meta App, verifikasi bisnis, app review, atau whitelist redirect URI yang sering diblokir (`Feature Unavailable`).
2. **Database Caching (Anti-Rate-Limit)**:
   - **Buka Halaman Dashboard**: 100% membaca dari PostgreSQL / Prisma lokal. Halaman terbuka instan (< 10ms) dan tidak ada request ke Instagram sama sekali.
   - **Scraping**: Hanya berjalan saat tombol **"Sync"** atau **"Sync All"** ditekan secara manual oleh pengguna. Sekali di-scrape, profil dan postingan langsung tersimpan ke database.
3. **3 Slot Akun Terkunci**:
   - Akun diawasi terbatas pada 3 slot khusus:
     - **Slot 1**: `@baron_nduts`
     - **Slot 2**: `@baron_nduts_bbq`
     - **Slot 3**: `@baron_nduts.cottage`
   - User dapat mengedit username di tiap slot, namun **tidak bisa menambah slot baru** (maksimal 3 slot).

---

## 2. Struktur File Paket Fitur

Semua file siap-pakai telah disiapkan di folder ini:

| File | Fungsi |
|---|---|
| `schema.prisma` | Model Prisma untuk tabel `WatchedAccount` dan `WatchedMedia` |
| `scraper.ts` | Scraper TypeScript native (tanpa library npm) untuk profil & 12 feed posts |
| `db-service.ts` | Service layer database (ambil data, simpan data scraping, edit slot username) |
| `api-sync-route.ts` | Next.js API Route untuk trigger sinkronisasi (`/api/instagram/sync`) |
| `api-slot-route.ts` | Next.js API Route untuk mengedit handle/username slot (`/api/instagram/slots`) |
| `dashboard-component.tsx` | Komponen React / Next.js Server Component siap pasang di halaman dashboard |

---

## 3. Langkah-Langkah Pemasangan ke Proyek Utama dari Nol

### Langkah 1: Tambahkan Schema ke `prisma/schema.prisma`

Buka file `prisma/schema.prisma` di proyek utama kamu, lalu tambahkan model berikut (atau salin dari `feature-get-instagram-data/schema.prisma`):

```prisma
model WatchedAccount {
  slot              Int            @id // Slot 1, 2, atau 3 (terkunci)
  username          String         @unique
  name              String?
  biography         String?
  profilePictureUrl String?
  followersCount    Int?
  followsCount      Int?
  mediaCount        Int?
  isVerified        Boolean        @default(false)
  lastSyncedAt      DateTime?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  media             WatchedMedia[]

  @@map("watched_instagram_accounts")
}

model WatchedMedia {
  id                 String         @id @default(cuid())
  slot               Int
  instagramMediaId   String
  mediaType          String         // IMAGE, VIDEO, atau CAROUSEL_ALBUM
  mediaUrl           String?
  thumbnailUrl       String?
  caption            String?
  permalink          String
  likeCount          Int?
  commentsCount      Int?
  timestamp          DateTime?
  createdAt          DateTime       @default(now())
  updatedAt          DateTime       @updatedAt

  account            WatchedAccount @relation(fields: [slot], references: [slot], onDelete: Cascade)

  @@unique([slot, instagramMediaId])
  @@index([slot, timestamp])
  @@map("watched_instagram_media")
}
```

Jalankan migrasi database di terminal:
```bash
npx prisma migrate dev --name add_watched_instagram_accounts
npx prisma generate
```

---

### Langkah 2: Salin File Scraper & Service

1. Salin `feature-get-instagram-data/scraper.ts` ke `lib/instagram/scraper.ts`.
2. Salin `feature-get-instagram-data/db-service.ts` ke `lib/instagram/db-service.ts`.

> **Catatan**: Jika Prisma Client di proyekmu di-export dari file lain (misal `@/lib/db` atau `@/lib/prisma`), sesuaikan path import `prisma` di baris atas `db-service.ts`.

---

### Langkah 3: Buat API Routes di Next.js App Router

1. Buat folder `app/api/instagram/sync/` dan buat file `route.ts`:
   - Salin isi dari `feature-get-instagram-data/api-sync-route.ts`.
2. Buat folder `app/api/instagram/slots/` dan buat file `route.ts`:
   - Salin isi dari `feature-get-instagram-data/api-slot-route.ts`.

---

### Langkah 4: Pasang Komponen di Dashboard

Salin `feature-get-instagram-data/dashboard-component.tsx` ke dalam folder komponen proyekmu (misal `components/dashboard/watched-instagram.tsx`).

Lalu panggil di halaman dashboard:

```tsx
// app/dashboard/page.tsx
import WatchedInstagramDashboard from "@/components/dashboard/watched-instagram";

export default async function DashboardPage(props: {
  searchParams: Promise<{ success?: string; error?: string; slot?: string }>;
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Pasang widget feed Instagram di sini */}
      <WatchedInstagramDashboard searchParams={props.searchParams} />
    </div>
  );
}
```

---

## 4. Cara Kerja Scraping (Teknis)

### A. Mengapa Header Desktop Browser Penting?
Instagram membedakan respon berdasarkan `User-Agent`:
- User-Agent biasa/mobile sering dialihkan ke halaman login modal (`Login Required`).
- Dengan menyertakan User-Agent Chrome Desktop standar:
  ```ts
  "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  ```
  Instagram mengembalikan halaman profil SSR lengkap (±800KB).

### B. Cara Ekstraksi Data:
1. **Profil Pengguna**:
   - Diambil dari blok JSON `"xig_user_by_username":{...}` atau `"xig_user_by_igid_v2":{...}`.
   - Fallback otomatis ke meta tag OpenGraph (`og:description`, `og:image`, `og:title`) jika format berubah.
2. **12 Postingan Publik (Feed)**:
   - Diambil langsung dari blok JSON SSR `"polaris_ordered_timeline_connection":{"edges": [...]}`.
   - Menghasilkan gambar HD (`display_uri`), caption (`caption.text`), permalink (`code`), dan tipe (`media_type`).

---

## 5. Pertanyaan Umum & Troubleshooting

### Q: Apakah Instagram memblokir IP server jika sering di-sync?
**Jawab**: Karena scraping hanya dilakukan manual saat tombol "Sync" ditekan (bukan setiap pengunjung membuka web), request ke Instagram sangat jarang terjadi. Dengan batas 3 akun, risiko terkena rate limit sangat kecil.

### Q: Apakah gambar postingan kedaluwarsa?
**Jawab**: URL gambar dari CDN Instagram (`scontent.cdninstagram.com`) memiliki masa berlaku signed token (biasanya 2 hingga 4 minggu). Tombol "Sync" memperbarui URL gambar tersebut dengan token baru dari Instagram ke database.
