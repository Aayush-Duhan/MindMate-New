# MindMate - Architecture Overview

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Backend Architecture](#backend-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Database Design](#database-design)
8. [API Architecture](#api-architecture)
9. [Real-time Communication](#real-time-communication)
10. [Authentication & Authorization](#authentication--authorization)
11. [Security](#security)
12. [Key Features](#key-features)
13. [Deployment](#deployment)

---

## Introduction

MindMate is a comprehensive mental health and wellness platform designed to provide resources, counseling, and support to students, parents, and counselors. The application follows a client-server architecture with a React-based frontend and Node.js/Express backend, utilizing MongoDB as the database and Socket.io for real-time communication.

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React Application (Port 3000)                 │  │
│  │  - React Router for Navigation                        │  │
│  │  - Context API for State Management                   │  │
│  │  - Socket.io Client for Real-time Updates            │  │
│  │  - Axios for HTTP Requests                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Server Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │       Node.js/Express Server (Port 5000)             │  │
│  │  - RESTful API Routes                                 │  │
│  │  - Socket.io Server for Real-time                    │  │
│  │  - JWT Authentication Middleware                      │  │
│  │  - Security Middleware (Helmet, CORS, etc.)          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MongoDB Database                         │  │
│  │  - Users Collection                                   │  │
│  │  - Chats Collection                                   │  │
│  │  - Goals Collection                                   │  │
│  │  - MoodEntries Collection                             │  │
│  │  - Groups Collection                                  │  │
│  │  - Resources Collection                               │  │
│  │  - And more...                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Patterns

- **MVC Pattern**: Model-View-Controller separation for backend
- **Component-Based Architecture**: React components for frontend
- **RESTful API Design**: Standard HTTP methods for CRUD operations
- **Real-time Communication**: WebSocket protocol via Socket.io
- **Context Pattern**: React Context API for global state management
- **Repository Pattern**: Mongoose models as data access layer

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0.0 | UI framework |
| React Router DOM | 7.1.1 | Client-side routing |
| Tailwind CSS | 3.4.17 | Styling framework |
| Framer Motion | 12.0.0 | Animations |
| Chart.js | 4.4.7 | Data visualization |
| React-Chartjs-2 | 5.3.0 | Chart.js React wrapper |
| Socket.io-client | 4.8.1 | Real-time communication |
| Axios | 1.7.9 | HTTP client |
| React Hot Toast | 2.5.1 | Toast notifications |
| Material-UI | 6.4.0 | Component library |
| Headless UI | 2.2.0 | Unstyled components |
| Hero Icons | 2.2.0 | Icon library |
| Date-fns | 4.1.0 | Date utilities |
| React Markdown | 9.0.3 | Markdown rendering |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | Runtime environment |
| Express | 4.21.2 | Web framework |
| MongoDB | - | NoSQL database |
| Mongoose | 8.9.5 | ODM for MongoDB |
| Socket.io | 4.8.1 | Real-time communication |
| JWT | 9.0.2 | Authentication tokens |
| Bcryptjs | 2.4.3 | Password hashing |
| Helmet | 8.0.0 | Security headers |
| CORS | 2.8.5 | Cross-origin resource sharing |
| Express Rate Limit | 7.5.0 | Rate limiting |
| XSS-Clean | 0.1.4 | XSS protection |
| Express Mongo Sanitize | 2.2.0 | NoSQL injection protection |
| HPP | 0.2.3 | HTTP parameter pollution protection |
| Express Validator | 7.2.1 | Input validation |

---

## Project Structure

### Root Level Structure

```
mindmate/
├── client/                 # React frontend application
├── src/                    # Backend Node.js application
├── docs/                   # Documentation
├── package.json            # Server dependencies
├── start.js               # Concurrent server/client starter
├── .gitignore
└── README.md
```

### Backend Structure (`/src`)

```
src/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── controllers/                 # Business logic controllers
│   ├── admin.controller.js
│   ├── analytics.controller.js
│   ├── anonymousChat.controller.js
│   ├── auth.controller.js
│   ├── chat.controller.js
│   ├── connection.controller.js
│   ├── goal.controller.js
│   ├── mentalHealth.controller.js
│   ├── mood.controller.js
│   ├── parent.controller.js
│   ├── profile.controller.js
│   ├── progress.controller.js
│   ├── quotes.controller.js
│   ├── resource.controller.js
│   ├── school.controller.js
│   ├── settings.controller.js
│   └── user.controller.js
├── middleware/                  # Custom middleware
│   ├── anonymousAuth.js        # Anonymous user authentication
│   ├── async.js                # Async error handler
│   ├── auth.js                 # JWT authentication
│   └── validate.js             # Request validation
├── models/                      # Mongoose schemas
│   ├── Analytics.js
│   ├── AnonymousChat.js
│   ├── Chat.js
│   ├── ConnectionCode.js
│   ├── Goal.js
│   ├── Group.js
│   ├── GroupMembership.js
│   ├── GroupSession.js
│   ├── MentalHealthRecord.js
│   ├── MoodEntry.js
│   ├── PhoneConsultation.js
│   ├── Relationship.js
│   ├── Resource.js
│   ├── School.js
│   ├── Settings.js
│   ├── SharedMoodData.js
│   ├── User.js
│   └── VideoConsultation.js
├── routes/                      # API route definitions
│   ├── admin.routes.js
│   ├── analytics.routes.js
│   ├── anonymousChat.routes.js
│   ├── auth.routes.js
│   ├── chat.routes.js
│   ├── connection.routes.js
│   ├── counselor.routes.js
│   ├── goal.routes.js
│   ├── groups.js
│   ├── mentalHealth.routes.js
│   ├── mood.routes.js
│   ├── parent.routes.js
│   ├── phoneConsultations.js
│   ├── profile.routes.js
│   ├── progress.routes.js
│   ├── quotes.routes.js
│   ├── resource.routes.js
│   ├── school.routes.js
│   ├── settings.routes.js
│   ├── user.routes.js
│   └── videoConsultations.js
├── scripts/                     # Utility scripts
│   ├── seed.js
│   ├── fixMessages.js
│   ├── reEncryptMessages.js
│   ├── resetMessages.js
│   ├── fixMessageFormat.js
│   └── checkCounselors.js
├── seeds/                       # Database seed data
├── services/                    # Business logic services
│   └── moodAnalysis.js
├── utils/                       # Utility functions
│   ├── errorResponse.js
│   └── socketUtils.js
└── server.js                    # Main server entry point
```

### Frontend Structure (`/client/src`)

```
client/src/
├── components/                  # React components
│   ├── admin/                  # Admin-specific components
│   │   ├── Analytics.js
│   │   ├── SystemSettings.js
│   │   └── UserManagement.js
│   ├── auth/                   # Authentication components
│   ├── chat/                   # Chat components
│   │   └── CounselorChat.js
│   ├── counselor/              # Counselor-specific components
│   │   └── Sessions.js
│   ├── dashboard/              # Dashboard components
│   ├── dashboards/             # Role-specific dashboards
│   ├── goals/                  # Goal management components
│   ├── layout/                 # Layout components (header, sidebar, etc.)
│   ├── mood/                   # Mood tracking components
│   ├── profile/                # Profile components
│   │   ├── AdminProfile.js
│   │   ├── CounselorProfile.js
│   │   ├── ParentProfile.js
│   │   └── StudentProfile.js
│   ├── resources/              # Resource components
│   │   ├── ParentResources.js
│   │   └── StudentResources.js
│   ├── routing/                # Routing utilities
│   ├── support/                # Support components
│   │   ├── ParentSupport.js
│   │   └── TeacherSupport.js
│   ├── ChatBot.js              # Chatbot component
│   └── PrivateRoute.js         # Protected route wrapper
├── context/                     # React Context providers
│   └── GoalContext.js
├── contexts/                    # Additional contexts
│   └── AuthContext.js
├── pages/                       # Page components
│   ├── AnonymousChatPage.js
│   ├── Dashboard.js
│   ├── Login.js
│   ├── MoodTracker.js
│   ├── Register.js
│   ├── Resources.js
│   └── StudentProgress.js
├── routes/                      # Route configurations
│   ├── adminRoutes.js
│   └── parentRoutes.js
├── services/                    # API service modules
│   ├── phoneConsultationService.js
│   └── videoConsultationService.js
├── utils/                       # Utility functions
│   ├── api.js                  # Axios instance and API helpers
│   └── auth.js                 # Auth utilities
├── mockData/                    # Mock data for development
├── App.js                       # Main application component
├── App.css                      # Application styles
├── index.js                     # Entry point
└── index.css                    # Global styles
```

---

## Backend Architecture

### MVC Pattern Implementation

#### Models Layer
- **Purpose**: Define data structures and database schemas
- **Technology**: Mongoose ODM
- **Features**:
  - Schema validation
  - Pre/post hooks for business logic
  - Virtual properties
  - Instance methods
  - Index optimization

#### Controllers Layer
- **Purpose**: Handle business logic and orchestrate data flow
- **Responsibilities**:
  - Process requests
  - Validate input data
  - Call model methods
  - Format responses
  - Handle errors

#### Routes Layer
- **Purpose**: Define API endpoints and map to controllers
- **Features**:
  - RESTful endpoint design
  - Middleware integration
  - Route protection
  - Request validation

### Middleware Stack

```javascript
// Security Middleware Chain
app.use(helmet());                  // Set security headers
app.use(cors());                    // Enable CORS
app.use(mongoSanitize());          // Prevent NoSQL injection
app.use(xss());                    // Prevent XSS attacks
app.use(hpp());                    // Prevent HTTP parameter pollution
app.use(rateLimit());              // Rate limiting

// Authentication Middleware
app.use(protect);                  // JWT verification
app.use(authorize('role'));        // Role-based access control
```

### Service Layer

- **Mood Analysis Service**: Analyzes mood patterns and provides insights
- **Socket Utilities**: Manages Socket.io connections and events

---

## Frontend Architecture

### Component Hierarchy

```
App (Router + Global State)
├── AuthProvider
│   └── GoalProvider
│       ├── Layout Components
│       │   ├── Header
│       │   ├── Sidebar
│       │   └── Footer
│       ├── Page Components
│       │   ├── Dashboard (Role-specific)
│       │   ├── Login/Register
│       │   ├── MoodTracker
│       │   ├── Resources
│       │   └── Profile
│       └── Feature Components
│           ├── ChatBot
│           ├── CounselorChat
│           ├── Goals Management
│           ├── Mood Tracking
│           └── Admin Panel
```

### State Management

#### Global State (Context API)
- **AuthContext**: User authentication state
  - Current user data
  - Login/logout functions
  - Token management

- **GoalContext**: Goal management state
  - Goals list
  - CRUD operations
  - Progress tracking

#### Local State
- Component-specific state using `useState`
- Form state management
- UI state (modals, dropdowns, etc.)

### Routing Architecture

#### Route Protection
```javascript
<PrivateRoute allowedRoles={['student', 'counselor']}>
  <ProtectedComponent />
</PrivateRoute>
```

#### Role-Based Routes

| Role | Routes |
|------|--------|
| Student | `/student/chat`, `/student/resources`, `/student/progress`, `/student/profile` |
| Counselor | `/counselor/chats`, `/counselor/sessions`, `/counselor/profile` |
| Parent | `/parent/resources`, `/parent/support`, `/parent/profile` |
| Admin | `/admin/users`, `/admin/settings`, `/admin/analytics`, `/admin/profile` |
| Teacher | `/teacher/support` |

### API Communication

```javascript
// Axios Instance with Interceptors
- Base URL configuration
- Request interceptor: Add JWT token
- Response interceptor: Handle errors
- Custom API methods for common operations
```

---

## Database Design

### Core Collections

#### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: Enum ['student', 'counselor', 'admin', 'parent'],
  specialization: String,
  bio: String,
  yearsOfExperience: Number,
  profile: {
    bio: String,
    education: String,
    approach: String,
    childName: String,
    relationship: Enum
  },
  children: [ObjectId],
  connectionCode: {
    code: String,
    expiresAt: Date
  },
  isActive: Boolean,
  isVerified: Boolean,
  avatar: String,
  preferences: {
    theme: Enum ['light', 'dark', 'system'],
    notifications: Boolean,
    emailUpdates: Boolean
  },
  streakDays: Number,
  lastActive: Date,
  totalMindsessions: Number,
  timestamps: true
}
```

#### Goals Collection
```javascript
{
  user: ObjectId (ref: User),
  title: String,
  description: String,
  category: Enum ['Mental Health', 'Academic', 'Social', 'Personal', 'Other'],
  status: Enum ['not-started', 'in-progress', 'completed'],
  priority: Enum ['High', 'Medium', 'Low'],
  startDate: Date,
  targetDate: Date,
  progress: Number (0-100),
  milestones: [{
    title: String,
    completed: Boolean,
    completedAt: Date
  }],
  completedAt: Date,
  isArchived: Boolean,
  timestamps: true,
  indexes: [{ user: 1, status: 1 }, { user: 1, category: 1 }]
}
```

#### MoodEntry Collection
```javascript
{
  userId: ObjectId (ref: User),
  counselorId: ObjectId (ref: User),
  mood: Enum ['happy', 'sad', 'anxious', 'calm', 'stressed', 'energetic', 'tired', 'neutral'],
  intensity: Number (1-5),
  timestamp: Date,
  entryType: Enum ['quick', 'detailed'],
  isPrivate: Boolean,
  sharedWithCounselor: Boolean,
  notes: String,
  activities: [Enum],
  triggers: [String],
  tags: [String],
  mediaUrls: [String],
  weather: {
    condition: String,
    temperature: Number
  },
  timestamps: true,
  indexes: [{ userId: 1, timestamp: -1 }]
}
```

#### Chat Collection
```javascript
{
  participants: [ObjectId (ref: User)],
  messages: [{
    sender: ObjectId (ref: User),
    content: String,
    timestamp: Date
  }],
  isAnonymous: Boolean,
  status: Enum ['active', 'closed'],
  lastMessage: Date,
  timestamps: true
}
```

#### Group Collection
```javascript
{
  name: String,
  description: String,
  facilitator: ObjectId (ref: User),
  groupType: Enum ['academic', 'emotional', 'behavioral', 'social', 'general'],
  maxParticipants: Number,
  schedule: {
    dayOfWeek: Number (0-6),
    time: String (HH:mm format),
    duration: Number (minutes)
  },
  topics: [String],
  isActive: Boolean,
  createdAt: Date,
  virtuals: { participantCount }
}
```

#### Other Collections
- **AnonymousChat**: Anonymous chat sessions
- **Analytics**: System analytics data
- **ConnectionCode**: Parent-child connection codes
- **GroupMembership**: Group member relationships
- **GroupSession**: Individual group session records
- **MentalHealthRecord**: Mental health records
- **PhoneConsultation**: Phone consultation scheduling
- **VideoConsultation**: Video consultation scheduling
- **Relationship**: User relationships (parent-child)
- **Resource**: Educational resources
- **School**: School information
- **Settings**: User and system settings
- **SharedMoodData**: Shared mood data for counselors

### Database Relationships

```
User (1) ----< (Many) Goals
User (1) ----< (Many) MoodEntries
User (1) ----< (Many) Chats
User (Many) >----< (Many) User (Parent-Child)
User (1) ----< (Many) Groups (as facilitator)
User (Many) >----< (Many) Groups (through GroupMembership)
Group (1) ----< (Many) GroupSessions
MoodEntry (Many) >---- (1) User (counselorId)
```

---

## API Architecture

### API Endpoint Structure

#### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user
- `POST /forgot-password` - Password reset request
- `PUT /reset-password/:token` - Reset password

#### Users (`/api/users`)
- `GET /` - Get all users (admin)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user
- `GET /:id/stats` - Get user statistics

#### Goals (`/api/goals`)
- `GET /` - Get user goals
- `POST /` - Create goal
- `GET /:id` - Get goal by ID
- `PUT /:id` - Update goal
- `DELETE /:id` - Delete goal
- `PUT /:id/progress` - Update progress
- `POST /:id/milestones` - Add milestone
- `PUT /:id/milestones/:milestoneId` - Update milestone

#### Mood Tracking (`/api/mood`)
- `POST /` - Create mood entry
- `GET /` - Get mood entries
- `GET /stats` - Get mood statistics
- `GET /patterns` - Get mood patterns
- `PUT /:id` - Update mood entry
- `DELETE /:id` - Delete mood entry
- `POST /share` - Share with counselor

#### Chat (`/api/chat`)
- `GET /` - Get user chats
- `POST /` - Create chat
- `GET /:id` - Get chat by ID
- `POST /:id/messages` - Send message
- `PUT /:id/close` - Close chat

#### Anonymous Chat (`/api/anonymous-chat`)
- `POST /start` - Start anonymous chat
- `GET /active` - Get active chats
- `POST /assign` - Assign counselor
- `POST /:id/messages` - Send message
- `PUT /:id/close` - Close chat

#### Counselor (`/api/counselor`)
- `GET /students` - Get assigned students
- `GET /sessions` - Get counselor sessions
- `GET /schedule` - Get counselor schedule
- `POST /availability` - Update availability

#### Groups (`/api/groups`)
- `GET /` - Get all groups
- `POST /` - Create group
- `GET /:id` - Get group by ID
- `PUT /:id` - Update group
- `DELETE /:id` - Delete group
- `POST /:id/join` - Join group
- `POST /:id/leave` - Leave group
- `GET /:id/sessions` - Get group sessions

#### Resources (`/api/resources`)
- `GET /` - Get resources
- `POST /` - Create resource (admin)
- `GET /:id` - Get resource by ID
- `PUT /:id` - Update resource
- `DELETE /:id` - Delete resource

#### Phone Consultations (`/api/phone-consultations`)
- `POST /` - Schedule consultation
- `GET /` - Get consultations
- `GET /:id` - Get consultation by ID
- `PUT /:id` - Update consultation
- `DELETE /:id` - Cancel consultation

#### Video Consultations (`/api/video-consultations`)
- `POST /` - Schedule consultation
- `GET /` - Get consultations
- `GET /:id` - Get consultation by ID
- `PUT /:id` - Update consultation
- `DELETE /:id` - Cancel consultation

#### Analytics (`/api/analytics`)
- `GET /overview` - System overview
- `GET /users` - User analytics
- `GET /engagement` - Engagement metrics
- `GET /mood-trends` - Mood trends

#### Admin (`/api/admin`)
- `GET /users` - Manage users
- `GET /settings` - System settings
- `PUT /settings` - Update settings
- `GET /reports` - Generate reports

### API Response Format

#### Success Response
```javascript
{
  success: true,
  data: { /* response data */ },
  message: "Operation successful"
}
```

#### Error Response
```javascript
{
  success: false,
  error: "Error message",
  statusCode: 400
}
```

---

## Real-time Communication

### Socket.io Implementation

#### Server-Side Events

```javascript
// Connection handling
io.on('connection', (socket) => {
  // User authentication via JWT
  // Room management
  // Event listeners
});

// Events
- 'joinChat' - Join chat room
- 'sendMessage' - Send message to room
- 'leaveChat' - Leave chat room
- 'disconnect' - Handle disconnection
```

#### Client-Side Events

```javascript
// Connect to server
const socket = io(SERVER_URL, {
  auth: { token: JWT_TOKEN }
});

// Listen for messages
socket.on('newMessage', (data) => {
  // Handle new message
});

// Send message
socket.emit('sendMessage', { chatId, message });
```

#### Real-time Features
1. **Live Chat**: Counselor-student chat with instant messaging
2. **Anonymous Chat**: Real-time anonymous support
3. **Notifications**: Real-time notification updates
4. **Status Updates**: User online/offline status
5. **Group Sessions**: Real-time group communication

---

## Authentication & Authorization

### JWT-Based Authentication

#### Authentication Flow

```
1. User Login
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Token sent to client
   ↓
5. Client stores token (localStorage)
   ↓
6. Client includes token in subsequent requests
   ↓
7. Server verifies token
   ↓
8. Request processed
```

#### Token Structure
```javascript
{
  id: userId,
  iat: issuedAt,
  exp: expiresIn
}
```

#### Password Security
- **Hashing**: Bcrypt with salt rounds (10)
- **Pre-save Hook**: Automatic password hashing
- **Password Comparison**: Secure comparison method

### Role-Based Access Control (RBAC)

#### User Roles
1. **Student**
   - Access mood tracking
   - View resources
   - Chat with counselors
   - Set goals
   - Track progress

2. **Counselor**
   - View assigned students
   - Access chat sessions
   - View student mood data (if shared)
   - Schedule consultations
   - Manage groups

3. **Parent**
   - View child's progress (if connected)
   - Access parenting resources
   - Connect with support services
   - View shared mood data

4. **Admin**
   - Manage all users
   - System settings
   - View analytics
   - Manage resources
   - Generate reports

#### Authorization Middleware

```javascript
// Protect route
router.get('/protected', protect, controller);

// Role-specific route
router.get('/admin', protect, authorize('admin'), controller);

// Multiple roles
router.get('/resource', protect, authorize('admin', 'counselor'), controller);
```

---

## Security

### Security Measures

#### 1. Authentication Security
- JWT tokens with expiration
- Secure password hashing (bcrypt)
- Token verification on each request
- Protected routes

#### 2. Input Validation & Sanitization
- **Express Validator**: Request validation
- **Mongo Sanitize**: Prevent NoSQL injection
- **XSS Clean**: Prevent XSS attacks
- Schema validation at model level

#### 3. HTTP Security Headers (Helmet)
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- X-XSS-Protection

#### 4. Rate Limiting
```javascript
// Global rate limit: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Chat-specific: 100 requests per minute
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100
});
```

#### 5. CORS Configuration
```javascript
cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
```

#### 6. Additional Security
- **HPP**: HTTP Parameter Pollution prevention
- **Trust Proxy**: For correct client IP behind proxies
- **Error Handling**: No sensitive data in error messages
- **Environment Variables**: Sensitive data in .env

### Security Best Practices

1. **Data Privacy**
   - Mood data privacy controls
   - Anonymous chat support
   - Selective data sharing
   - User consent management

2. **Database Security**
   - Connection string in environment variables
   - Mongoose schema validation
   - Index optimization for query performance

3. **Session Management**
   - JWT expiration handling
   - Token refresh mechanism
   - Logout functionality

4. **Error Handling**
   - Centralized error handling
   - No stack traces in production
   - Logging without sensitive data

---

## Key Features

### 1. User Management
- Multi-role user system (Student, Counselor, Parent, Admin)
- Profile management
- Role-based dashboards
- User verification system
- Activity tracking (streak days, last active)

### 2. Mood Tracking System
- Quick mood entry (emoji + intensity)
- Detailed mood entry with notes
- Activity and trigger tracking
- Mood patterns analysis
- Visual mood calendar
- Statistics and insights
- Share with counselor option
- Weather context integration

### 3. Goal Setting & Progress Tracking
- Create personal goals
- Multiple categories (Mental Health, Academic, Social, Personal)
- Priority levels (High, Medium, Low)
- Progress tracking (0-100%)
- Milestones management
- Goal completion tracking
- Archive functionality

### 4. Chat & Communication
- **Counselor Chat**: Direct messaging with assigned counselor
- **Anonymous Chat**: Anonymous support chat with auto-assignment
- **Real-time Messaging**: Instant message delivery via Socket.io
- **Chat History**: Message persistence
- **Status Tracking**: Active/closed chat status

### 5. Group Sessions
- Create and manage support groups
- Group types (academic, emotional, behavioral, social)
- Schedule management
- Participant management
- Session tracking
- Maximum participant limits

### 6. Consultation Scheduling
- **Phone Consultations**: Schedule phone sessions
- **Video Consultations**: Schedule video sessions
- Counselor availability management
- Consultation status tracking

### 7. Resources Management
- Educational resources for students
- Parenting resources for parents
- Resource categorization
- Admin resource management
- Resource recommendations

### 8. Analytics & Insights
- User engagement metrics
- Mood trends analysis
- System usage statistics
- User activity reports
- Goal completion rates

### 9. Parent-Child Connection
- Unique connection codes
- Secure parent-child linking
- Progress sharing (with permission)
- Mood data sharing controls

### 10. Admin Panel
- User management
- System settings
- Analytics dashboard
- Resource management
- User verification

---

## Deployment

### Environment Variables

#### Backend (.env)
```env
# Database
MONGO_URI=mongodb://...

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d

# Server
PORT=5000
CLIENT_URL=http://localhost:3000

# External APIs (if applicable)
LANGFLOW_API_URL=...
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                         │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌─────────────────────┐       ┌─────────────────────┐
│   Frontend Server    │       │  Backend Server(s)  │
│   (React Build)      │       │  (Node.js/Express)  │
│   - Static hosting   │       │  - API routes       │
│   - CDN integration  │       │  - Socket.io        │
└─────────────────────┘       └─────────────────────┘
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │  MongoDB Database    │
                              │  - Replica Set       │
                              │  - Backup strategy   │
                              └─────────────────────┘
```

### Startup Process

#### Development Mode

```bash
# Start both server and client
npm start

# Or separately
npm run start:server  # Backend on port 5000
npm run start:client  # Frontend on port 3000
```

#### Production Mode

```bash
# Build frontend
cd client && npm run build

# Start server (serves built frontend)
npm run start:server
```

### Database Scripts

```bash
# Seed database with test data
npm run seed

# Fix messages (data migration)
npm run fix-messages

# Re-encrypt messages
npm run reencrypt

# Reset messages
npm run reset-messages

# Fix message format
npm run fix-format

# Check counselors
npm run check-counselors
```

### Health Check Endpoint

```
GET /api/health

Response:
{
  status: 'ok',
  mongodb: 'connected',
  uptime: 12345,
  timestamp: '2024-01-01T00:00:00.000Z'
}
```

---

## Development Workflow

### Git Workflow
- Feature branches: `feature/feature-name`
- Bug fixes: `bugfix/issue-name`
- Current branch: `docs-architecture-overview`

### Code Quality Tools
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Nodemon**: Auto-restart on changes (development)

### Testing Strategy
- Unit tests for models and services
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical user flows

---

## Future Enhancements

### Planned Features
1. **AI-Powered Insights**: Machine learning for mood pattern prediction
2. **Mobile Applications**: Native iOS and Android apps
3. **Video Chat**: WebRTC integration for video sessions
4. **Gamification**: Achievement system and rewards
5. **Export Functionality**: PDF reports for progress and mood data
6. **Multi-language Support**: Internationalization (i18n)
7. **Push Notifications**: Web push notifications
8. **Calendar Integration**: Sync with Google Calendar/Outlook
9. **Emergency Support**: Crisis hotline integration
10. **Community Forums**: Peer support discussions

### Scalability Considerations
- Microservices architecture for growing features
- Redis for caching and session management
- Message queue (RabbitMQ/Kafka) for async tasks
- CDN for static asset delivery
- Database sharding for large datasets
- Horizontal scaling with container orchestration (Kubernetes)

---

## Conclusion

MindMate is built with a modern, scalable architecture that prioritizes security, user experience, and maintainability. The separation of concerns between frontend and backend, combined with real-time communication capabilities, provides a robust platform for mental health support and wellness management.

The application follows industry best practices for:
- Authentication and authorization
- Data security and privacy
- API design
- Real-time communication
- State management
- Code organization

This architecture provides a solid foundation for current features while remaining flexible enough to accommodate future enhancements and scaling requirements.
