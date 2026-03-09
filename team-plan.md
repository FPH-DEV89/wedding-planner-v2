# Team Plan: Roadmap V2.1 - Excellence Technique & i18n

Suite à l'audit global, voici le plan stratégique pour porter le projet au niveau supérieur.

## Proposed Strategy

### 1. Fondations i18n & Nettoyage
- [ ] Créer un fichier `src/lib/constants/i18n.ts` pour centraliser les messages de succès/erreur.
- [ ] Remplacer les textes hardcodés dans les Server Actions par ces constantes.
- [ ] Nettoyer les classes CSS inutilisées (ex: legacy colors dans `dashboard-overview.tsx`).

### 2. Dynamisation de la Configuration
- [ ] Créer une action `getSettings` pour récupérer la date du mariage et les noms des mariés.
- [ ] Remplacer les valeurs hardcodées dans le Dashboard et la Navbar par les données dynamiques.

### 3. UX Boutique Premium
- [ ] **Mobile optimization**: Transformer les tableaux de prestataires en "Cards" sur les écrans < 768px.
- [ ] **Animations**: Ajouter des transitions de page via `template.tsx` comme préconisé dans la rétrospective.

## Distribution of Tasks
- **Expert Front-End**: Refactorisation i18n, nettoyage CSS, et transformation PWA (Config `serwist`, Service Worker, Background Sync, UI de secours Hors Ligne).
- **Expert Database**: Ajout de la gestion des réglages (Settings) et de la table `PushSubscription` pour les notifications web push.
- **Expert Design**: Optimisations Mobile & Animations.
- **Chef (Head of Engineering)**: Cadrage de l'architecture offline et push (validé), génération du logo premium (terminé), supervision globale de l'implémentation.
