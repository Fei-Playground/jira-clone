# InvoPk - Simple Invoicing for Pakistani Freelancers

A mobile-first invoicing and payment tracking web application designed specifically for Pakistani freelancers working with international clients.

## 🚀 Features

### Core Features (MVP)
- ✅ **Authentication**: Email/password + Google sign-in with Firebase Auth
- ✅ **Client Management**: Create, edit, delete, and search clients
- ✅ **Invoice Creation**: Professional invoices with line items, taxes, and discounts
- ✅ **Dashboard**: Total income, pending/overdue tracking, and recent invoices
- ✅ **Multi-Currency**: Support for PKR and USD invoicing
- ✅ **Status Tracking**: Auto-status updates (Draft, Pending, Paid, Overdue)
- ✅ **Pro Tier**: Free tier (3 invoices) with Pro upgrade option

### Mobile-First Design
- Bottom tab navigation for mobile (Dashboard, Invoices, Clients, Settings)
- Responsive layout optimized for small screens
- Touch-friendly interactions with 44px minimum touch targets
- Desktop sidebar navigation support

## 🎨 Design System

### Colors
- **Primary**: Deep Professional Blue (#00236f, #1e3a8a)
- **Success**: Green (#10B981) for paid invoices
- **Error**: Red (#ba1a1a) for overdue invoices
- **Background**: Soft white/blue tints (#f9f9ff)

### Typography
- **Font**: Plus Jakarta Sans
- **Mobile Headlines**: 24px/bold
- **Desktop Headlines**: 32px/bold
- **Body Text**: 16px/400 (large), 14px/400 (small)
- **Labels**: 12px/600/uppercase

### Components
- **Cards**: 24px rounded corners with soft shadows
- **Buttons**: 12px rounded with minimum 52px height
- **Status Badges**: Pill-shaped with color-coded backgrounds
- **Forms**: 48px minimum input height with focus states

## 📦 Tech Stack

- **Frontend**: React Router 7 (React 19) with TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Email/Password + Google)
- **Hosting**: Vercel-compatible (any React hosting)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js >= 20
- pnpm (or npm)
- Firebase project with Firestore and Authentication enabled

### 1. Clone and Install

```bash
cd path/to/project
pnpm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → Email/Password and Google providers
4. Enable **Firestore Database** in production mode

#### Security Rules
Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Clients collection
    match /clients/{clientId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Invoices collection
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 3. Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Get these values from**:
Firebase Console → Project Settings → General → Your apps → Web app config

### 4. Install Firebase Dependencies

```bash
pnpm add firebase
```

### 5. Run Development Server

```bash
pnpm dev
```

Open http://localhost:5173 in your browser.

## 📁 Project Structure

```
src/
├── domain/
│   └── invopk/                 # Business entities
│       ├── user.ts             # User types
│       ├── client.ts           # Client types
│       ├── invoice.ts          # Invoice types
│       └── index.ts
├── infrastructure/
│   └── firebase/               # Data layer
│       ├── firebase.client.ts  # Firebase config
│       ├── users.ts            # User CRUD
│       ├── clients.ts          # Client CRUD
│       └── invoices.ts         # Invoice CRUD
├── app/
│   ├── store/
│   │   └── invopk-auth.store.tsx  # Auth context
│   └── ui/
│       └── invopk/             # InvoPk UI components
│           ├── landing/
│           ├── auth/
│           ├── dashboard/
│           ├── clients/
│           ├── invoices/
│           ├── settings/
│           ├── layout/
│           └── components/
```

## 🚢 Deployment

### Vercel Deployment

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Add Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all `NEXT_PUBLIC_FIREBASE_*` variables

4. **Production Deploy**:
```bash
vercel --prod
```

### Other Hosting Options

The app is a standard React application and can be deployed to:
- Netlify
- Cloudflare Pages
- AWS Amplify
- Any static hosting service

## 📱 Usage Guide

### For Users

#### 1. Getting Started
1. Sign up with email/password or Google
2. Complete onboarding (name, business name, currency)
3. Add your first client
4. Create your first invoice

#### 2. Creating Invoices
1. Click "Create New Invoice" from dashboard or invoices page
2. Select client from dropdown
3. Add line items (description, quantity, unit price)
4. Set tax percentage and discount if needed
5. Choose currency (PKR or USD)
6. Add notes and payment link (optional)
7. Save invoice

#### 3. Managing Clients
1. Navigate to Clients tab
2. Click "Add New Client"
3. Fill in client details (name, email, phone, address, country)
4. Save client

#### 4. Pro Tier Upgrade
- Free tier: Up to 3 invoices
- Pro tier: Rs 300/month or Rs 2,500/year
- Payment methods: JazzCash/EasyPaisa (PKR) or PayRoute (USD)
- After payment, email support to activate Pro

### For Administrators

#### Manually Grant Pro Access
1. Open Firebase Console → Firestore
2. Find user document in `users` collection
3. Set `isPro: true`
4. User will see Pro features immediately

## 🔧 Configuration

### Currency Conversion Rate
Edit `src/app/ui/invopk/dashboard/dashboard.view.tsx`:

```typescript
// Current rate: 1 USD = 283 PKR
≈ Rs {(summary.totalIncome * 283).toLocaleString()} PKR
```

Update `283` to current exchange rate.

### Free Tier Invoice Limit
Edit check in invoice creation logic (to be added in route handlers):

```typescript
if (!invoPkUser.isPro && invoPkUser.invoiceCount >= 3) {
  // Show paywall modal
}
```

## 🐛 Known Limitations (MVP)

1. **Manual Pro Activation**: Admins must manually set `isPro` flag in Firestore
2. **No Email Notifications**: Reminder emails not implemented in MVP
3. **No Recurring Invoices**: Planned for Pro tier
4. **Basic Reporting**: No advanced analytics or export features
5. **Single Currency Stats**: Dashboard shows income in one currency only

## 🔮 Future Enhancements

- Automated Pro tier payment verification
- Email reminders for overdue invoices
- Recurring invoice templates
- PDF export and email sending
- Advanced reporting and analytics
- Multi-currency dashboard aggregation
- WhatsApp integration (without Meta verification)
- Bank account integration

## 📞 Support

For issues or questions:
- Email: support@invopk.com
- Create an issue in the repository

## 📄 License

MIT License - See LICENSE file for details

---

Built with ❤️ for Pakistani freelancers
