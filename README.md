# StayMate – PG, Flat, Roommate & Mess Finder

> **Master of Computer Applications (MCA) Mini Project 2026**  
> A complete, responsive, full-stack MERN platform designed for students and working professionals to find accommodations, compatible flatmates, and daily meal subscriptions.

---

## 1. Project Overview

**StayMate** is an end-to-end web application developed to bridge the critical information gap in student and professional housing. It centralizes four core pillars of student living:
1. **Accommodation Discovery:** Verified PGs, student hostels, and rental flats with transparent pricing, security deposits, and amenities.
2. **Roommate Matching Engine:** A deterministic, normalized algorithm scoring compatibility across budget overlap, preferred location, cleanliness routines, food preferences, smoking habits, and study/sleep schedules.
3. **Mess & Tiffin Services:** Searchable directory of daily dining services with complete 7-day weekly meal menus, timings, and monthly rates.
4. **Real-Time Communication:** Persistent Socket.IO chat connecting accommodation seekers directly with verified property hosts and compatible roommates.

---

## 2. Problem Statement & Objectives

### Problem Statement
Finding student accommodation in major educational and technological hubs (e.g., Bangalore, Pune, NCR) is plagued by:
- Unverified listings and fake photos posted by deceptive brokers.
- Hidden maintenance charges and non-refundable deposits.
- Severe flatmate friction due to unaddressed lifestyle habits (sleep hours, food diets, cleanliness).
- Lack of access to hygienic, home-style daily dining services near colleges.

### Project Objectives
- Build a secure, role-based platform (`student`, `owner`, `admin`) with zero reliance on Tailwind or paid proprietary services.
- Provide server-side search, filtering, and pagination for properties and mess services.
- Implement an authentic compatibility engine returning 0–100% normalized matching scores with itemized criteria breakdowns.
- Provide real-time messaging using Socket.IO backed by MongoDB persistence.
- Implement an administrative console for property verification, user suspension, and review/report moderation.

---

## 3. Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React.js (Vite), React Router v6, Plain CSS & CSS Modules (No Tailwind), Lucide React, Axios |
| **Backend** | Node.js, Express.js RESTful APIs |
| **Database** | MongoDB, Mongoose ODM |
| **Real-time** | Socket.IO (WebSockets with HTTP polling fallback) |
| **Maps** | Google Maps Embed API (with interactive OpenStreetMap fallback) |
| **Authentication** | JWT (JSON Web Tokens) with secure HTTP-only Cookies & Bearer fallback |
| **Security & Uploads** | bcryptjs (Salt 10), Multer (5MB limits), Express Rate Limit, CORS |
| **Testing** | Jest, Supertest |

---

## 4. User Roles & Access Control

### 1. Student / Seeker Role
- Secure sign up & sign in.
- Search PGs, Hostels, and Rental Flats with multi-attribute filtering (rent, city, locality, occupancy, gender, food).
- Save and manage favorite properties.
- Discover nearby mess & tiffin services with 7-day menus.
- View compatible roommates with match score percentages and itemized breakdown.
- Send connection requests and chat in real time with roommates and property owners.
- Rate and review properties (1–5 stars) with duplicate review prevention.
- Submit moderation reports for suspicious listings.

### 2. Property Owner / Host Role
- Register as host and create owner profile.
- Create accommodation listings with full details, room occupancy, pricing, amenities, coordinates, and photo uploads.
- Listings enter `pending` state until verified by administrator.
- Edit and delete own listings.
- Toggle listing availability (`Available` vs `Occupied`).
- View tenant inquiries and communicate via integrated real-time chat.
- View owner analytics (total listings, live properties, tenant inquiries, average rating).

### 3. Administrator Role
- Live platform analytics: total users, students, owners, live/pending/rejected properties, mess services, and pending reports.
- User management: search, filter, and suspend/reactivate user and host accounts.
- Property verification queue: inspect details and approve or reject (with feedback reason) host submissions.
- Mess management: CRUD operations for student dining listings.
- Review moderation: inspect all user reviews and delete inappropriate content (automatically updating property average ratings).
- Content reports: resolve or dismiss user-filed reports with administrative resolution notes.

---

## 5. System Architecture

```
[ React.js Single Page Application ]
           │
           ├────────────────────────────┐
           ▼ (HTTP / REST APIs)         ▼ (WebSocket Connection)
[ Express.js REST Server ]      [ Socket.IO Real-Time Server ]
           │                                    │
           ├────────────────────────────────────┘
           ▼
[ MongoDB Database via Mongoose ODM ]
 (Users, Properties, Mess, Conversations, Messages, Reviews, Favorites, Reports)
```

---

## 6. Directory Structure

```
staymate/
├── backend/
│   ├── scripts/
│   │   └── seed.js                 # Realistic seed database script
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection logic
│   │   ├── controllers/            # 10 route controllers
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── chatController.js
│   │   │   ├── favoriteController.js
│   │   │   ├── messController.js
│   │   │   ├── propertyController.js
│   │   │   ├── reportController.js
│   │   │   ├── reviewController.js
│   │   │   ├── roommateController.js
│   │   │   └── userController.js
│   │   ├── middleware/             # Auth, role check, upload, rate limit, error handler
│   │   ├── models/                 # 9 Mongoose schemas
│   │   ├── routes/                 # Express API routes
│   │   ├── services/
│   │   │   └── roommateService.js  # Transparent compatibility algorithm
│   │   ├── sockets/
│   │   │   └── chatSocket.js       # Authenticated Socket.IO handlers
│   │   ├── utils/                  # JWT token & response handlers
│   │   ├── app.js                  # Express middleware & router mounting
│   │   └── server.js               # HTTP & Socket.IO server startup
│   ├── tests/
│   │   ├── auth.test.js            # Auth & JWT supertest suite
│   │   ├── property.test.js        # Property discovery, creation & admin verification
│   │   └── features.test.js        # Roommates, mess, reviews, favorites, reports
│   ├── uploads/                    # Local storage for user images
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Navbar, Footer, PropertyCard, MessCard, RoommateCard, MapView, Modal, StarRating
│   │   ├── context/                # AuthContext, SocketContext
│   │   ├── layouts/                # MainLayout, DashboardLayout
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Properties.jsx
│   │   │   ├── PropertyDetails.jsx
│   │   │   ├── Mess.jsx
│   │   │   ├── MessDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── FindRoommates.jsx
│   │   │   ├── RoommateDetails.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── MyReviews.jsx
│   │   │   ├── MyReports.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── MyProperties.jsx
│   │   │   ├── AddProperty.jsx
│   │   │   ├── EditProperty.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── admin/              # UserManagement, PropertyVerification, MessManagement, ReviewModeration, ReportManagement
│   │   ├── services/               # Modular Axios API services
│   │   ├── styles/                 # Plain CSS system (variables, global, cards, dashboard, chat)
│   │   ├── App.jsx                 # Routes & protected route mappings
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
├── postman_collection.json         # Ready-to-import Postman collection
├── package.json                    # Root scripts
└── README.md
```

---

## 7. Database Models & Schema Relationships

1. **User:** `name`, `email` (unique), `password` (bcrypt hash), `phone`, `role` (`student`, `owner`, `admin`), `profileImage`, `occupation`, `bio`, `gender`, `collegeOrCompany`, `budgetMin`, `budgetMax`, `preferredCity`, `preferredLocality`, `preferredAccommodationType`, `roommatePreferences`, `isVerified`, `isSuspended`.
2. **Property:** `owner` (ref User), `title`, `description`, `propertyType` (`PG`, `Flat`, `Hostel`), `monthlyRent`, `securityDeposit`, `address`, `locality`, `city`, `coordinates`, `availableRooms`, `totalRooms`, `occupancyType`, `genderPreference`, `amenities`, `foodAvailability`, `images`, `verificationStatus` (`pending`, `approved`, `rejected`), `rejectionReason`, `isAvailable`, `averageRating`, `reviewCount`.
3. **MessService:** `name`, `description`, `address`, `locality`, `city`, `coordinates`, `contactNumber`, `mealTypes`, `foodType` (`Veg`, `Non-Veg`, `Both`), `monthlyPrice`, `dailyPrice`, `mealTimings`, `operatingDays`, `menu` (7-day schedule), `images`, `isVerified`, `isAvailable`.
4. **Conversation:** `participants` ([ref User]), `property` (ref Property, optional), `lastMessage` (ref Message), `lastMessageAt`.
5. **Message:** `conversation` (ref Conversation), `sender` (ref User), `receiver` (ref User), `content`, `read` (boolean).
6. **Review:** `property` (ref Property), `user` (ref User), `rating` (1–5), `comment`. Compound unique index on `{ property, user }` prevents duplicate reviews.
7. **Favorite:** `user` (ref User), `property` (ref Property). Compound unique index on `{ user, property }`.
8. **Report:** `reporter` (ref User), `reportedItemType`, `reportedItemId`, `reason`, `details`, `status` (`pending`, `reviewed`, `resolved`, `dismissed`), `resolutionNotes`, `resolvedBy`.
9. **ConnectionRequest:** `sender` (ref User), `receiver` (ref User), `status` (`pending`, `accepted`, `rejected`), `message`.

---

## 8. REST API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new student or owner |
| POST | `/api/auth/login` | Public | Authenticate user & issue JWT cookie |
| GET | `/api/auth/me` | Private | Retrieve current user profile |
| POST | `/api/auth/logout` | Private | Clear authentication cookie |
| PUT | `/api/auth/update-password`| Private | Update account password |

### Accommodations (`/api/properties`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/properties` | Public | Filter, search & paginate approved listings |
| GET | `/api/properties/:id` | Public | View single property with reviews |
| POST | `/api/properties` | Owner/Admin | Create listing (enters pending verification) |
| PUT | `/api/properties/:id` | Owner/Admin | Edit own property |
| DELETE | `/api/properties/:id` | Owner/Admin | Delete own property |
| PATCH | `/api/properties/:id/availability` | Owner/Admin | Toggle available/occupied |
| GET | `/api/properties/owner/me` | Owner/Admin | List own properties |
| GET | `/api/properties/owner/stats` | Owner/Admin | View owner summary statistics |

### Roommates (`/api/roommates`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/roommates` | Private | Discover roommates with compatibility scores |
| GET | `/api/roommates/:id` | Private | View candidate profile & score breakdown |
| POST | `/api/roommates/:id/connect`| Private | Send connection invitation |
| GET | `/api/roommates/connections/all` | Private | Get incoming & outgoing requests |
| PUT | `/api/roommates/connections/:id` | Private | Accept or reject connection request |

### Mess Services (`/api/mess`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/mess` | Public | Search mess listings by city & food type |
| GET | `/api/mess/:id` | Public | View 7-day menu & timings |
| POST | `/api/mess` | Admin/Owner | Create new mess listing |
| PUT | `/api/mess/:id` | Admin/Owner | Update mess details |
| DELETE | `/api/mess/:id` | Admin/Owner | Delete mess service |

### Chat (`/api/chat`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/chat/conversations` | Private | List user conversations |
| POST | `/api/chat/conversations` | Private | Get or create conversation |
| GET | `/api/chat/conversations/:id/messages` | Private | View conversation history |
| POST | `/api/chat/messages` | Private | Send message (triggers Socket event) |

### Reviews, Favorites & Reports
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/reviews` | Student | Submit property review (1–5 stars) |
| GET | `/api/reviews/property/:id` | Public | List reviews for property |
| DELETE | `/api/reviews/:id` | Private | Delete own review |
| GET | `/api/favorites` | Private | List bookmarked properties |
| POST | `/api/favorites/:id` | Private | Bookmark property |
| DELETE | `/api/favorites/:id` | Private | Remove property bookmark |
| POST | `/api/reports` | Private | Submit content moderation report |
| GET | `/api/reports/me` | Private | View my filed reports |

### Admin Console (`/api/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Platform metrics and recent activity |
| GET | `/api/admin/users` | Admin | Searchable user table |
| PATCH | `/api/admin/users/:id/suspend` | Admin | Suspend / reactivate user account |
| GET | `/api/admin/properties` | Admin | Manage and review listings |
| PATCH | `/api/admin/properties/:id/verify` | Admin | Approve or reject listing |
| GET | `/api/admin/reports` | Admin | View content reports |
| PATCH | `/api/admin/reports/:id/resolve` | Admin | Resolve or dismiss report |
| GET | `/api/admin/reviews` | Admin | List all reviews for moderation |
| DELETE | `/api/admin/reviews/:id` | Admin | Remove inappropriate review |

---

## 9. Google Maps Integration & Graceful Fallback

- **Google Maps API**: If a valid `GOOGLE_MAPS_API_KEY` is provided in environment variables, an embedded interactive Google Map is rendered with precise property markers.
- **Graceful Fallback**: If the key is not configured, the application automatically switches to an interactive **OpenStreetMap** iframe with exact coordinate markers, displaying coordinates, street address, and direct deep-links to **Google Maps Directions** (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`). The platform remains 100% usable without any errors.

---

## 10. Roommate Compatibility Scoring Algorithm

The matching algorithm in `backend/src/services/roommateService.js` is 100% transparent and deterministic:
1. **Location Match (Max 25 pts):** Exact locality match awards 25 pts; matching city awards 18 pts.
2. **Budget Overlap (Max 25 pts):** Calculates proportional overlap between user budget $[min_1, max_1]$ and candidate budget $[min_2, max_2]$. Overlap ratio scales score between 15 and 25 pts.
3. **Accommodation & Gender Compatibility (Max 20 pts):** Accommodation preference match (10 pts) + mutual gender requirement satisfaction (10 pts).
4. **Lifestyle Compatibility (Max 30 pts):**
   - Cleanliness routine match: 7 pts.
   - Food habits compatibility: 7 pts.
   - Smoking habit compatibility: 8 pts (non-smoker with smoker awards 0 pts).
   - Sleep schedule alignment: 8 pts (early bird with night owl awards 2 pts).

Total Compatibility: **0% – 100%**.

---

## 11. Quick Start & Execution Guide

### Prerequisites
- Node.js (v18+ or v24+)
- npm (v9+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### Step 1: Clone or Navigate to Project
```powershell
cd C:\Users\HP\.gemini\antigravity\scratch\staymate
```

### Step 2: Seed Sample Data
Populates realistic demo accounts, approved accommodations, student mess services, reviews, and chat history:
```powershell
npm run seed
```

### Step 3: Run Automated Test Suite
Executes all 16 Jest + Supertest test cases across authentication, permissions, roommate scoring, reviews, and admin workflows:
```powershell
npm test
```

### Step 4: Start the Applications
Open two terminal windows:

**Terminal 1 (Backend API on port 5000):**
```powershell
cd backend
npm run dev
```

**Terminal 2 (Frontend Client on port 5173):**
```powershell
cd frontend
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 12. Demo Accounts for Project Evaluation

| Role | Email | Password | Preloaded Data & Scenarios |
|---|---|---|---|
| **Admin** | `admin@staymate.com` | `Admin@123` | Complete console, verify pending properties, suspend users, resolve reports |
| **Owner 1** | `owner1@staymate.com` | `Owner@123` | Host of Green Meadows PG & St. Jude Hostel in Koramangala; has live inquiries |
| **Owner 2** | `owner2@staymate.com` | `Owner@123` | Host of Serene Heights flat & Whitefield Studio; has pending Pune listing |
| **Student 1** | `student1@staymate.com` | `Student@123` | Aarav Patel (MCA student, Bangalore), Koramangala preference, has saved properties & chat |
| **Student 2** | `student2@staymate.com` | `Student@123` | Ananya Sen (Software Trainee, Bangalore), female PG preference |
| **Student 3** | `student3@staymate.com` | `Student@123` | Rohan Verma (B.Tech student), 92% compatibility match with Aarav Patel |
| **Student 4** | `student4@staymate.com` | `Student@123` | Priya Nair (UI/UX Intern) |

*Tip: On the Login screen, click any of the "Demo Accounts" buttons (Student, Owner, Admin) for instant 1-click credentials entry.*

---

## 13. Test Results Summary

```
Test Suites: 3 passed, 3 total
Tests:       16 passed, 16 total
Snapshots:   0 total
Time:        14.394 s
```
- `auth.test.js`: Verified registration, password encryption, JWT tokens, duplicate email error, cookie headers, and unauthenticated protection.
- `property.test.js`: Verified property search, role restriction (blocking student creation), owner property creation, and administrative verification approval.
- `features.test.js`: Verified roommate compatibility calculation, mess discovery filters, favorite bookmarks, duplicate review prevention, and report moderation.

---

## 14. Future Enhancements
- Integration of razorpay payment gateway for online token room booking and mess monthly passes.
- Push notifications via Web Push API for mobile browser alerts.
- Virtual 360-degree video tours for accommodation previews.
