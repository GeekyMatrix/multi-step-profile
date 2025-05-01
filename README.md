echo "# Multi-Step User Profile Update Form
A modern, multi-step user profile update form with real-time validation and file upload capabilities.

## Features
- Multi-step form with 3 steps
- Real-time form validation
- File upload with preview (Profile picture)
- Password strength meter
- Username availability check
- Dynamic fields (Company Name, Custom Gender)
- Country-State-City cascading dropdowns
- MongoDB integration
- JWT authentication
- Responsive UI with Tailwind CSS

## Tech Stack
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- File Upload: Multer

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation
1. Clone the repository:
git clone <your-repo-url>
cd multi-step-profile

2. Install dependencies:
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

3. Set up environment variables:
Create a .env file in the server directory with:
MONGODB_URI=mongodb://localhost:27017/multi-step-profile
JWT_SECRET=your-secret-key
PORT=5000

## Running the Application
1. Start MongoDB
2. Start the server:
cd server
npm run dev

3. In a new terminal, start the client:
cd client
npm start

The application will be available at http://localhost:3000

## Project Structure
multi-step-profile/
├── client/              # React frontend
├── server/              # Node.js backend
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── uploads/        # Uploaded files
└── .env                # Environment variables

## API Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- POST /api/profile/update - Update user profile
- GET /api/auth/check-username/:username - Check username availability

## Security Features
- Password hashing with bcrypt
- JWT authentication
- Input validation
- Rate limiting
- CORS protection
- File upload validation

## License
MIT" > README.md