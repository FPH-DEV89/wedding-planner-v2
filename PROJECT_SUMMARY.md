# 🧠 Résumé Global du Projet : Wedding Planner V2

Ce document sert de **base de connaissances ultra-légère** pour les assistants IA. Il permet de comprendre instantanément l'architecture, l'état actuel et les spécificités du projet afin d'économiser votre quota de tokens lors de l'ouverture de nouvelles discussions.

---

## 🛠️ 1. Pile Technique & Architecture

*   **Framework :** Next.js 15.1.0 (App Router, React 19)
*   **Langage :** TypeScript (mode strict activé)
*   **Base de Données & ORM :** PostgreSQL / Supabase géré via **Prisma ORM** (`^6.4.1`)
*   **Authentification :** NextAuth.js v5 Beta 30 (`next-auth`) avec `@auth/prisma-adapter`
*   **PWA / Service Worker :** **Serwist** (`v9.5.6`)
*   **Design / Styles :** Tailwind CSS V4, Framer Motion, Shadcn UI
*   **Gestion des requêtes :** TanStack React Query (`^5.90.21`)
*   **Notifications :** Web Push via la bibliothèque `web-push`

---

## 🚀 2. Fonctionnalités & Objectifs Stratégiques (Feuille de Route V2.1)

### 📲 A. Transformation PWA & Hors-Ligne (Offline-First)
*   **Moteur PWA (Serwist) :** Utilisation de service workers et manifeste dynamique.
*   **Hors-ligne résilient :** Intégration de Background Sync et interface utilisateur de secours hors-ligne pour la gestion du mariage.
*   **Web Push :** Gestion des abonnements de push via la table `PushSubscription` pour notifier les utilisateurs en temps réel.

### 🌐 B. Internationalisation (i18n) & Nettoyage
*   **Centralisation i18n :** Création et utilisation du fichier `src/lib/constants/i18n.ts` pour centraliser tous les messages utilisateur (succès, erreurs, notifications).
*   **Surcharges des Server Actions :** Remplacer les chaînes de texte codées en dur dans les Server Actions par ces constantes centralisées.
*   **Nettoyage CSS :** Suppression des classes obsolètes et nettoyage des couleurs héritées dans `dashboard-overview.tsx`.

### 📈 C. Dynamisation & UX Premium
*   **Configuration Dynamique :** Implémentation de `getSettings` pour récupérer la date du mariage et le nom des mariés de manière dynamique (suppression des valeurs codées en dur dans le Dashboard et la Navbar).
*   **Optimisation Mobile (UX Premium) :** Restructuration des tableaux de prestataires en grilles de cartes flexibles sur les terminaux mobiles (écrans < 768px).
*   **Micro-Animations :** Utilisation de transitions fluides et animations de changement de page via le fichier de mise en page `template.tsx`.

---

## 🧪 3. Configuration & Commandes Critiques

*   **Scripts de compilation / Dev (CRITIQUE) :**
    En raison des spécificités d'intégration de Serwist v9 avec Next.js 15, il est **impératif d'utiliser le flag `--webpack`** pour le développement et la compilation :
    *   *Démarrage Dev :* `npm run dev` (qui exécute `next dev --webpack`)
    *   *Build de Production :* `npm run build` (qui exécute `prisma generate && next build --webpack`)
*   **Prisma :** Le client est auto-généré après l'installation via le script `postinstall`.
