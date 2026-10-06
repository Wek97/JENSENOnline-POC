# JENSENOnline POC

POC till inlämningen i Säker systemutveckling. En enkel webbshop där man kan registrera sig, logga in, söka produkter och lägga order. Admin kan lägga till och ändra produkter.

Backend är ASP.NET Core med SQLite och frontend är vanlig JavaScript.

## Så här startar man

Man behöver .NET 10 och Node.js.

### Backend

Gå till `backend/JensenOnline.Api`.

Första gången måste man lägga in JWT-nyckeln och admin-lösenordet i user secrets, annars startar inte backend:

```bash
dotnet user-secrets set "Jwt:Key" "$(openssl rand -base64 48)"
dotnet user-secrets set "Admin:Password" "valfrittlosenord"
```

Sen startar man med:

```bash
dotnet run
```

Databasen skapas automatiskt första gången.

### Frontend

Gå till `frontend` i en ny terminal:

```bash
npm install
npm start
```

Sidan finns på http://localhost:3000

## Inloggning

Admin: `admin@jensenonline.se` med lösenordet du satte i user secrets.

Vanlig användare: skapa ett konto på sidan.
