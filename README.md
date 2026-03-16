# receipt-ai-app

Receipt AI est une application intelligente permettant aux utilisateurs de scanner leurs tickets de caisse, analyser leurs dépenses et recevoir des recommandations personnalisées pour économiser et consommer plus intelligemment.
L'objectif est de transformer les tickets de caisse en données exploitables sur la consommation quotidienne.

📱 Aperçu de l'application

Dashboard

Statistiques globales de dépenses.

Scanner de ticket

Scan d’un ticket via photo ou QR code.

Analyse des dépenses

Statistiques détaillées par :
* magasin
* produit
* catégorie
* période (jour / mois / année)

Conseils IA

Recommandations personnalisées :
* réduire certaines dépenses
* alternatives moins chères
* produits plus sains

🎯 Vision du projet

Aujourd’hui les tickets de caisse sont perdus ou inutilisés.
Receipt AI transforme ces tickets en :
* historique de consommation
* analyse budgétaire
* conseils intelligents
L'objectif long terme :
devenir le "Google Analytics de la consommation personnelle"

🧠 Fonctionnalités principales

📷 Scan intelligent

* OCR automatique
* détection des produits
* catégorisation automatique
📊 Analyse des dépenses

* dépenses par magasin
* dépenses par produit
* évolution mensuelle
📦 Analyse de consommation

* quantité consommée
* fréquence d'achat
* produits les plus achetés
🤖 Recommandations IA

* conseils d'économie
* produits alternatifs
* analyse de consommation

🏗 Architecture du projet

Mobile App
   ↓
API Backend (Node.js)
   ↓
OCR Service
   ↓
AI Analysis
   ↓
PostgreSQL Database

Technologies utilisées :
Backend :
* Node.js
* Express.js
* JWT Authentication
Base de données :
* PostgreSQL
Mobile :
* Flutter / React Native
AI :
* OCR (Tesseract / Google Vision)
* IA d'analyse

📂 Structure du projet

receipt-ai
│
├── backend
│   ├── config
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── services
│   └── server.js
│
├── mobile_app
│
├── ai_services
│
├── docs
│   └── screenshots
│
└── README.md


⚙️ Installation

1 Cloner le projet

git clone https://github.com/USERNAME/receipt-ai.git
cd receipt-ai/backend


2 Installer les dépendances

npm install


3 Configurer l'environnement

Créer un fichier .env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=receipt_ai
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD

JWT_SECRET=supersecretkey


4 Lancer le serveur

node server.js

API disponible sur :
http://localhost:3000


🔌 API principales

Authentification

POST /api/auth/register
POST /api/auth/login

Tickets

POST /api/receipts/upload
GET /api/receipts

Statistiques

GET /api/stats/monthly
GET /api/stats/products
GET /api/stats/stores


🗄 Base de données

Tables principales :
users
stores
receipts
products
receipt_items

Relation principale :
User
  ↓
Receipts
  ↓
Receipt Items
  ↓
Products


🛣 Roadmap produit

MVP

* authentification utilisateur
* upload ticket
* extraction produits OCR
* historique tickets

V1

* statistiques dépenses
* analyse consommation
* dashboard mobile

V2

* recommandations IA
* analyse nutritionnelle
* comparaison prix magasins

📜 Licence

Projet sous licence MIT.

⭐ Support

Si le projet te plaît :
⭐ Star le repository
