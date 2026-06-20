# Kumaon Craft Connect

Kumaon Craft Connect is a digital trade portal and catalog system designed to bridge the gap between rural artisans of the Kumaon Himalayan region in Uttarakhand and institutional retail buyers, boutique stores, and conscious consumers.

The platform showcases heritage handloom and handicrafts (including Panchachuli Tweed, Almora Copperware, Likhai Woodcraft, and Aipan Folk Art) and permits buyers to place wholesale inquiry sessions directly with artisan guilds, reducing reliance on intermediaries and preserving indigenous traditional craftsmanship.

---

## 📂 Folder Structure

```text
kumaon-craft-connect/
├── backend/                  # Backend Node.js service
│   ├── .gitignore            # Git exclusions for backend files
│   ├── package.json          # Node dependencies & project scripts
│   └── server.js             # Entrypoint server configuration
│
└── frontend/                 # Frontend React application (Vite + Tailwind CSS v4)
    ├── src/
    │   ├── components/       # Shared reusable UI elements
    │   │   ├── Navbar.jsx    # Glassmorphic, responsive main navigation
    │   │   ├── Footer.jsx    # Informational footer with craft categories
    │   │   └── ProductCard.jsx # Catalog item details card with wholesale inquiry dialog
    │   │
    │   ├── pages/            # Routed page views
    │   │   ├── Home.jsx      # Landing hero, metrics, search, and catalog explorer
    │   │   ├── About.jsx     # Cultural heritage, story, and four craft pillars
    │   │   ├── Login.jsx     # Minimalist login page for artisans and buyers
    │   │   └── Dashboard.jsx # Role-based portal for listing management & inquiry tracking
    │   │
    │   ├── App.jsx           # App shell and React Router path configurations
    │   ├── main.jsx          # React application root entrypoint
    │   └── index.css         # Global styles, tailwind layers, and custom typography
    │
    ├── index.html            # Core HTML template shell
    ├── vite.config.js        # Vite build configuration with Tailwind support
    └── .gitignore            # Git exclusions for React/Vite development
```

---

## 🚀 Features Coming Soon

We are actively developing the next stages of the Kumaon Craft Connect platform. The upcoming roadmap features include:

### 1. Database & Backend API Integration
- **Relational Databases:** Transitioning from local mock JSON simulations to database storage (e.g., PostgreSQL or MongoDB) to store artisan details, buyer information, and catalog product listings.
- **Inquiry Processing API:** Secure REST endpoints to submit, process, and update the status of wholesale inquiries with auto-email alerts.

### 2. Verified Authentication & Role Access
- **JSON Web Tokens (JWT):** Implementing encrypted login sessions for both artisans and verified wholesale buyers.
- **Admin Roles:** Dashboards for guild managers to handle seller approvals, verify artisan credentials, and manage system parameters.

### 3. Real-Time Negotiation & Messaging
- **Direct Guild Chat:** Allowing institutional buyers to negotiate fabric yards, custom copper dimensions, or custom wood carvings directly with the guild leaders.
- **Notifications Hub:** Real-time push updates for status changes on custom wholesale estimates.

### 4. Interactive Heritage Map
- **Artisan Stories:** An interactive map highlighting exact Himalayan villages, artisan profiles, video tours of handloom setups, and regional stories behind specific craft techniques.
