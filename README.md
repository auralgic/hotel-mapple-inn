# Hotel Mapple Inn Jaipur — Hotel Management & QR Room Service Web App

A production-ready hotel operations and in-room digital dining system built for **Hotel Mapple Inn, Plot No. 408-409, Nirman Nagar, Mansarovar, Jaipur, Rajasthan**.

---

## 🌟 Key Features

### 1. 🏨 Public Hotel Website
- **Hero & Story**: Official branding ("Comfort, convenience, and Jaipur at your doorstep").
- **Rooms & Suites**: 16 rooms across 4 floors (Deluxe, Super Deluxe, Executive Suites) with verified rates and amenities.
- **Contact & Location**: Proximity guide (Jaipur Junction, Metro, Airport), WhatsApp instant booking link, and direct front-desk calling.

### 2. 📱 Guest QR Room Service
- **Room Identification**: Each of the 16 rooms has a unique signed QR token (`?room=101&token=...`).
- **Complete Pure Veg Digital Menu**: Sandwiches, Pizzas, Maggi, Starters, Dry/Gravy Curries, Paneer Specials, Dal Makhani, Rajasthani Specials, Breads, Thalis, and Beverages with variant selector (Half / Full).
- **Persistent Cart & Custom Instructions**: Save dishes, adjust portions, and specify special instructions.
- **Dynamic UPI Payment**: Generates dynamic UPI QR codes and deep links for Google Pay, PhonePe, Paytm, Cred, and BHIM with exact order total in ₹.
- **Manual Verification Workflow**: Guests submit 12-digit UPI UTR reference and optional receipt screenshot proof.
- **Live Status Timeline**: Realtime progression (`Pending Verification` → `Preparing in Kitchen` → `Ready for Dispatch` → `Delivered to Room`).

### 3. 👨‍🍳 Kitchen Display System (KDS) (`/kitchen`)
- **Realtime Kanban Workflow**: `NEW` → `PREPARING` → `READY` → `COMPLETED`.
- **Alerts**: Audio chime on new incoming orders with a top visual flashing alert banner.
- **Ticket Cards**: Room number, elapsed time counter, dish quantities, variant details, and special cooking notes.

### 4. 💼 Master Admin & Front-Desk Dashboard (`/admin`)
- **Executive KPI Dashboard**: Live occupied rooms count, available rooms, today's check-ins/outs, pending orders, and total daily revenue.
- **16-Room Grid Manager**: Interactive color-coded room status cards (Available, Occupied, Cleaning, Reserved, Maintenance, Out of Service) with quick status toggle and stay details.
- **Bookings & Check-In/Check-Out**: Front desk reservations, guest details, check-in, and auto-calculated Stay Folio (Room Charges + Food Orders + Extra - Payments = Balance Due) with **Printable Tax Invoice**.
- **Payment Verifier Queue**: Review guest UPI references and payment proof screenshots, with 1-click "Verify Payment" or "Reject Payment" actions.
- **16-Room QR Generator**: Single and batch printable acrylic table stand cards ("Scan • Select • Pay • Relax") with token regeneration and revocation.
- **Menu & Price Editor**: Add/edit items, adjust prices, and toggle instant item availability (sold-out items instantly disappear from guest screens).
- **Analytics & CSV Exports**: Revenue trends, top selling dishes, and 1-click CSV downloads for daily sales, food orders, and bookings.
- **Settings & Audit Trail**: Edit all hotel profile info without touching code, with an immutable audit log of all sensitive staff actions.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🗄️ Database & Supabase Setup

Full SQL migration and seed scripts are located in:
1. `supabase/migrations/001_initial_schema.sql`: 13 core relational tables, foreign keys, RLS policies, and triggers.
2. `supabase/seed.sql`: 16 rooms (101–116), room types, complete Mapple Inn digital menu items, and initial configuration.
