Here's the updated `README.md` with icons removed and `npm install` section included clearly:

---

```markdown
# Article Hub

A modern Angular 19-based online publishing platform for creating, reading, and managing articles. Built as a PWA with Firebase backend and Google social authentication.

---

## Features

- Create and publish rich text articles
- Author directory and profile pages
- Comment threads with nested replies
- Firebase Google login (Facebook login planned)
- PWA support (offline-first + installable)
- Search and filter articles
- Schedule articles and mark drafts
- Standalone Angular components (Angular 17+ approach)

---

## Tech Stack

| Tech       | Description                              |
|------------|------------------------------------------|
| Angular 19 | Frontend framework using standalone APIs |
| Firebase   | Auth + Firestore for backend             |
| SCSS       | Modular styling                          |
| NgxEditor  | Rich text editor for article creation    |
| PWA        | Offline support, web manifest, icon      |

---

## Project Structure (Key Folders)

```
src/
├── app/
│   ├── components/      # Reusable components
│   ├── pages/           # Standalone pages (Home, Author Directory, etc.)
│   ├── services/        # Firebase interaction (auth, article, comments)
│   ├── interfaces/      # TypeScript interfaces/models
|   |-- Shared /         # shared pages (navbar, footer)
|   |-- workeds/         # web workes ( tag suggestion worker)
├── environments/
├── manifest.webmanifest
└── main.ts
```

---

## Getting Started

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/your-username/article-hub.git
cd article-hub
npm install
```

### 2. Firebase Setup

- Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- Enable Firestore and Google Authentication
- Add your Firebase config to `environment.ts` like:

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_BUCKET",
    messagingSenderId: "SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

---

## Testing

Basic unit testing is implemented using Angular’s default setup. You can run tests with:

```bash
ng test
```

---

## Run Locally

```bash
ng serve
```

Then open [http://localhost:4200](http://localhost:4200) in your browser.

---

## PWA Support

The app is installable and works offline.

- Manifest: `manifest.webmanifest`
- Service Worker: Registered in `main.ts`

---

## Authentication

- Google login (via Firebase)
- Facebook login coming soon

---

## Future Features

- Tag-based filtering system
- Article bookmarking
- Admin dashboard
- User-following system

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

---