# CacheFlow – Begagnad IT Auktionsplattform

Fullstack-applikation med React (frontend) + ASP.NET Web API (backend) + SQL Server.

## Kom igång

### Backend (CacheFlow.API)

**Förutsättningar:** .NET 8 SDK, SQL Server LocalDB

```bash
cd CacheFlow.API

# Återställ NuGet-paket
dotnet restore

# Skapa och migrera databasen (körs automatiskt vid start)
# Men för att skapa migreringen manuellt:
dotnet ef migrations add InitialCreate
dotnet ef database update

# Starta API:et (kör på https://localhost:7000)
dotnet run
```

**Admin-konto (skapas automatiskt vid start):**
- E-post: `admin@cacheflow.se`
- Lösenord: `Admin123!`

Swagger UI finns på: `https://localhost:7000/swagger`

---

### Frontend (cacheflow-client)

**Förutsättningar:** Node.js 18+

```bash
cd cacheflow-client

# Installera beroenden
npm install

# Starta dev-server (kör på http://localhost:5173)
npm run dev
```

---

## Projektstruktur

```
LAB 2 - CacheFlow/
├── CacheFlow.API/              # ASP.NET Web API (.NET 8)
│   ├── Controllers/            # REST-endpoints
│   ├── Data/                   # DbContext + seeder
│   ├── DTOs/                   # Data Transfer Objects
│   ├── Models/                 # Entity-modeller (User, Auction, Bid)
│   ├── Services/               # Affärslogik (Interface + Implementation)
│   └── Program.cs              # App-konfiguration
│
└── cacheflow-client/           # React (Vite)
    └── src/
        ├── components/         # Delade komponenter (Navbar, ProtectedRoute)
        ├── context/            # AuthContext (Context API)
        ├── features/           # Feature-baserad struktur
        │   ├── home/           # Startsida
        │   ├── auth/           # Login & Registrering
        │   ├── auctions/       # Auktionslista, detalj, skapa, redigera
        │   ├── bids/           # BudLista, LäggBud
        │   ├── admin/          # Admin Dashboard
        │   └── profile/        # Profil/lösenordsuppdatering
        └── services/           # apiClient (Axios)
```

## Tekniker

| Del       | Teknik                                   |
|-----------|------------------------------------------|
| Backend   | ASP.NET Core 8, Entity Framework Core 8  |
| Databas   | SQL Server (LocalDB för dev)             |
| Auth      | JWT Bearer tokens, BCrypt                |
| Frontend  | React 18, React Router v6, Context API   |
| HTTP      | Axios                                    |
| Bygg      | Vite 5                                   |
