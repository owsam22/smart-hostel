# Smart Hostel Issue Tracking System

A comprehensive full-stack web application for managing hostel issues, announcements, and lost & found items with role-based access control.

## Features

### 🔐 Authentication & Role-Based Access Control
- Secure JWT-based authentication
- Two user roles: Student and Management
- Role-specific permissions and visibility

### 📋 Issue Reporting System
- Students can report issues with categories (plumbing, electrical, cleanliness, internet, furniture, other)
- Priority levels (low, medium, high, emergency)
- Public/private issue visibility
- Media upload support (images/videos)
- Automatic location tagging based on user profile
- Issue status workflow: Reported → Assigned → In Progress → Resolved → Closed
- Comments and reactions on issues
- Duplicate issue management

### 📢 Hostel-Specific News & Announcements
- Targeted announcements by hostel, block/wing, and user role
- Multiple announcement types (general, maintenance, cleaning, pest control, water, electricity)
- Expiration dates for announcements
- Comments and reactions on announcements

### 🔍 Lost & Found Module
- Report lost or found items
- Item categorization and location tracking
- Claim workflow with moderation
- Status tracking (pending, claimed, closed)
- Image/video support

### 📊 Analytics & Monitoring Dashboard
- Comprehensive analytics for management
- Issue category breakdown
- Hostel/block-wise issue density
- Priority distribution
- Monthly trends
- Average response and resolution times
- Peak reporting hours analysis

### 💬 Community Interaction
- Comments and threaded replies
- Reactions (like, dislike, urgent, helpful)
- Real-time interaction on public issues and announcements

## Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Rate Limiting** - API rate limiting

## Project Structure

```
smart-hostel-tracker/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts for state management
│   │   ├── pages/           # Page components
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Node.js backend API
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── uploads/             # File upload directory
│   ├── package.json
│   └── server.js
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-hostel-tracker
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/hostel-tracker
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   The backend will be running on `http://localhost:5000`

5. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The frontend will be running on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Issues
- `GET /api/issues` - Get all issues with filters
- `GET /api/issues/:id` - Get single issue
- `POST /api/issues` - Create new issue
- `PATCH /api/issues/:id/status` - Update issue status
- `POST /api/issues/:id/comments` - Add comment
- `POST /api/issues/:id/reactions` - Add reaction
- `PATCH /api/issues/:id/duplicate` - Mark as duplicate

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get single announcement
- `POST /api/announcements` - Create announcement (management only)
- `PUT /api/announcements/:id` - Update announcement (management only)
- `PATCH /api/announcements/:id/deactivate` - Deactivate announcement
- `POST /api/announcements/:id/comments` - Add comment
- `POST /api/announcements/:id/reactions` - Add reaction

### Lost & Found
- `GET /api/lost-found` - Get all items
- `GET /api/lost-found/:id` - Get single item
- `POST /api/lost-found` - Report item
- `PATCH /api/lost-found/:id/claim` - Claim item
- `PATCH /api/lost-found/:id/status` - Update status (management only)
- `POST /api/lost-found/:id/comments` - Add comment

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/trends` - Get issue trends
- `GET /api/analytics/hostels` - Get hostel performance

## Demo Accounts

For testing purposes, you can use these demo accounts:

**Student Account:**
- Email: `student@hostel.com`
- Password: `password123`
- Role: Student

**Management Account:**
- Email: `admin@hostel.com`
- Password: `admin123`
- Role: Management

## Development

### Frontend Development
The frontend uses Vite for fast development and building. Key features:
- Hot module replacement
- TypeScript support
- Tailwind CSS with JIT compilation
- Component-based architecture

### Backend Development
The backend follows RESTful API principles:
- Express.js with ES modules
- MongoDB with Mongoose ODM
- JWT authentication
- File upload support
- Comprehensive error handling
- Input validation and sanitization

### Database Schema

#### User Model
```javascript
{
  name: String,
  email: String,
  password: String, // hashed
  role: ['student', 'management'],
  hostel: String,
  block: String,
  room: String,
  avatar: String,
  phone: String,
  isActive: Boolean
}
```

#### Issue Model
```javascript
{
  title: String,
  description: String,
  category: ['plumbing', 'electrical', 'cleanliness', 'internet', 'furniture', 'other'],
  priority: ['low', 'medium', 'high', 'emergency'],
  status: ['reported', 'assigned', 'in_progress', 'resolved', 'closed'],
  visibility: ['public', 'private'],
  reportedBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  hostel: String,
  block: String,
  room: String,
  media: [String],
  remarks: String,
  comments: [Comment],
  reactions: [Reaction],
  isDuplicate: Boolean,
  duplicateOf: ObjectId (ref: Issue)
}
```

## Security Features

- JWT-based authentication with expiration
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Security headers with Helmet
- Role-based access control
- File upload restrictions

## Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm install --production
npm start
```

For production deployment:
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Set up SSL/TLS
5. Configure environment variables securely

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.