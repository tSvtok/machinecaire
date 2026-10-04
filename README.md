# MachineCare API 🛠️

API REST de gestion de la maintenance des machines industrielles et de suivi des signalements d'incidents / pannes.

---

## 📖 Documentation Swagger

La documentation interactive Swagger UI est disponible directement lorsque le serveur tourne :

- **Swagger UI** : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Spécification OpenAPI JSON** : [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

---

## 🚀 Démarrage

### Prérequis
- Node.js (v18+)
- MongoDB (ou Docker)

### Installation
```bash
npm install
```

### Configuration (.env)
Copiez ou configurez votre fichier `.env` :
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/machinecare
JWT_SECRET=votre_cle_secrete
JWT_EXPIRES_IN=1d
```

### Lancement
Mode développement :
```bash
npm run dev
```

Mode production :
```bash
npm start
```

Avec Docker Compose :
```bash
docker-compose up --build
```

---

## 📌 Aperçu des Endpoints

### 🔐 Authentification (`/api/auth`)
- `POST /api/auth/register` : Inscription d'un utilisateur
- `POST /api/auth/login` : Connexion et récupération du token JWT

### 👤 Profil (`/api/users`)
- `GET /api/users/me` : Obtenir les informations de l'utilisateur connecté *(Bearer Token requis)*
- `PUT /api/users/me` : Modifier les informations de l'utilisateur *(Bearer Token requis)*

### ⚙️ Machines (`/api/machines`)
- `GET /api/machines` : Lister les machines (filtres par `atelier`, `etat`) *(Bearer Token)*
- `POST /api/machines` : Créer une nouvelle machine *(Bearer Token)*
- `GET /api/machines/:id` : Détails d'une machine *(Bearer Token)*
- `PUT /api/machines/:id` : Mettre à jour une machine *(Bearer Token)*
- `DELETE /api/machines/:id` : Supprimer une machine *(Bearer Token)*
- `GET /api/machines/:id/signalements` : Historique des signalements d'une machine *(Bearer Token)*

### 🚨 Signalements (`/api/signalements`)
- `GET /api/signalements` : Lister les signalements (filtres par `machine`, `statut`) *(Bearer Token)*
- `POST /api/signalements` : Signaler une panne / incident *(Bearer Token)*
- `GET /api/signalements/:id` : Détails d'un signalement *(Bearer Token)*
- `PUT /api/signalements/:id` : Modifier description ou faire évoluer le statut *(Bearer Token)*
- `POST /api/signalements/:id/resolve` : Résoudre un signalement avec note de résolution *(Bearer Token)*
