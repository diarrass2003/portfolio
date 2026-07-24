# 👨‍💻 Portfolio de Diarrassouba (Édition Angular 21)

## 🚀 À propos

Portfolio professionnel de **Diarrassouba**, développeur Full Stack passionné par la création d'expériences digitales exceptionnelles. Initialement conçu en HTML/JS natif, ce portfolio a été intégralement migré et modernisé vers **Angular 21** en mode Single Page Application (SPA).

## ✨ Fonctionnalités

- 🎨 **Design moderne et responsive** - Interface élégante, Mobile-First
- 🌙 **Mode sombre/clair** - Basculement en temps réel et mémorisé
- ⚡ **Single Page Application (SPA)** - Navigation fluide sans rechargement
- 🎯 **Animations interactives** - Scroll Reveal dynamique (Observer API)
- 📊 **Section projets** - Présentation détaillée des réalisations
- 💼 **Compétences techniques** - Barres de progression stylisées
- 📞 **Mode de Contact** - Formulaire intégré (Formspree) sans rafraîchissement
- 📄 **Curriculum Vitae** - Page dédiée avec timeline interactive et design Midnight Aurora
- 🎭 **Curseur interactif & Particules** - Effets dynamiques complexes gérés par la logique Angular

## 🛠️ Technologies utilisées

### Architecture Logicielle
- **Angular 21** - Framework Frontend moderne
- **Standalone Components** - Composants autonomes et routage allégé
- **TypeScript** - Typage strict et logique orientée objet (ECMAScript Next)
- **Angular Router** - Gestion de la navigation entre les vues (Mentions légales, Conditions)

### Styles & Design
- **CSS3 Vanilla** - Styles avancés sans framework externe
- **Font Awesome** - Icônes vectorielles professionnelles
- **Google Fonts (Poppins)** - Typographie principale
- **Glassmorphism & CSS Grid** - Design moderne translucide

## 📁 Structure du projet

```
PORTFOLIO/
├── portfolio-angular/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── about/        # Section À Propos
│   │   │   │   ├── contact/      # Formulaire de contact
│   │   │   │   ├── cv/           # Page Curriculum Vitae (New)
│   │   │   │   ├── footer/       # Pied de page (Newsletter)
│   │   │   │   ├── hero/         # Bannière principale
│   │   │   │   ├── home/         # Vue principale 
│   │   │   │   ├── navbar/       # Barre de navigation
│   │   │   │   ├── projects/     # Liste des projets
│   │   │   │   └── skills/       # Grille de compétences
│   │   │   ├── app.component.ts  # Conteneur racine & Routage visuel
│   │   │   └── app.routes.ts     # Routage applicatif
│   │   ├── public/
│   │   │   ├── Assets/           # CSS globaux et images
│   │   │   └── CV de DIARRASSOUBA/ # CV PDF ou HTML
│   │   ├── index.html            # Fichier d'entrée HTML
│   │   └── main.ts               # Point de démarrage Angular
│   ├── angular.json              # Configuration du workspace Angular
│   └── package.json              # Dépendances Node.js
└── README.md                     # Documentation du projet
```

## 🚀 Installation et exécution

Puisque l'application utilise Angular, Node.js est prérequis.

1. **Cloner le repository et entrer dans le projet**
   ```bash
   git clone [URL_DU_REPO]
   cd PORTFOLIO/portfolio-angular
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run start
   ```
   > Accédez à l'application via `http://localhost:4200/`. Le serveur se rechargera automatiquement si vous modifiez vos fichiers sources.

4. **Compiler pour la production**
   ```bash
   npm run build
   ```
   > Le rendu optimisé sera généré dans le dossier `/dist/portfolio-angular/browser/`. C'est ce dossier que vous pouvez uploader sur Vercel, Netlify ou GitHub Pages.

## 🎨 Design et UX

### Palette de couleurs Globale
- **Primaire** : Bleu (`#3b82f6`)
- **Secondaire** : Violet (`#8b5cf6`)
- **Accent** : Rose (`#ec4899`)
- **Neutre** : Gris (`#6b7280`)

### Animations & UX
- Transitions fluides (`0.3s ease`) et hover effects travaillés (transformations et ombres).
- Traitement optimisé du scroll (calcul performant natif de l'Intersection Observer).
- Curseur personnalisé en surcouche du DOM lié au `HostListener`.

## 📞 Contact réseau

- **GitHub** : [LeYASSOUNG](https://github.com/LeYASSOUNG)
- **LinkedIn** : [Yassoungo Youssouf Diarrassouba](https://www.linkedin.com/in/yassoungo-youssouf-diarrassouba-0b7037306)
- **Twitter** : [@YassoungoD](https://x.com/Yassoungo01)
- **Instagram** : [@diarr_assoubayassoungo](https://www.instagram.com/diarr_assoubayassoungo)

## 📄 Licence

Ce projet est sous licence libre. Vous pouvez l'utiliser et le modifier selon vos besoins.

---

**Développé avec ❤️ par Diarrassouba**

*Dernière mise à jour : 28 avril 2026*
