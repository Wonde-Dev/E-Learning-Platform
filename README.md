E-Learning Platform
A full-stack e-learning platform for discovering courses, enrolling in learning experiences, and accessing educational content online.
Platform Screenshots
Replace the example paths below with screenshots of your actual application. Save your images in the docs/screenshots/ folder, or update the paths to match where you store them.

## 📸 Platform Screenshots

### Home Page

<img src="client/src/assets/145874475427346552.jpeg" alt="E-Learning Platform Home Page" width="800"/>

### Courses Page

<img src="docs/screenshots/courses.png" alt="Courses Page" width="800"/>

### Student Dashboard

<img src="docs/screenshots/student-dashboard.png" alt="Student Dashboard" width="800"/>

### Admin Dashboard

<img src="docs/screenshots/admin-dashboard.png" alt="Admin Dashboard" width="800"/>

Features
The platform is being developed to support online learning and course management. Depending on the current implementation, features may include:
- User authentication and session management with Clerk
- Course browsing and course details
- Course enrollment
- Admin workflows for managing courses and learning content
- Media management through Cloudinary
- A responsive web interface
Update this list so it includes only features that are implemented and working in your current version.

Technology Stack
- Frontend: React / JavaScript (confirm the framework and build tool in client/package.json)
- Backend: Node.js and Express
- Database: MongoDB
- Authentication: Clerk
- Media management: Cloudinary
- Version control: Git and GitHub
Project Structure
E-Learning-Platform/
├── client/                 # Frontend application
├── server/                 # Backend API
├── docs/
│   └── screenshots/        # README screenshots
├── README.md
└── LICENSE
Your actual repository may include additional folders and files.
Run Locally
Prerequisites
- Node.js and npm
- MongoDB (local installation or MongoDB Atlas)
- Clerk credentials if authentication is enabled
- Cloudinary credentials if Cloudinary features are enabled
1. Install server dependencies
cd server
npm install
2. Install client dependencies
Open another terminal, or return to the project root and run:
cd client
npm install
3. Configure environment variables
Create the .env files in the directories expected by your code. Check your source files to confirm the exact variable names.
Example server configuration:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
Example client configuration (the prefix depends on your frontend build tool):
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
These are examples only; use the names expected by your application. Never commit real secrets or expose server-side secret keys in client-side code.
4. Start the applications
Run the scripts defined in each directory's package.json. For example, if the server has a dev script:
cd server
npm run dev
If the client has a dev script:
cd client
npm run dev
Run npm run inside either directory to see the scripts available in that package. Check the terminal output for the local URL and port.
Security
- Keep .env files out of version control.
- Provide a .env.example with placeholder values, not real credentials.
- Enforce authentication and authorization on the backend, especially for admin actions.
- Keep secret API keys on the server.
- Configure production CORS, cookies, and allowed origins before deployment.
- Only upload content you have the right to distribute.
Contributing
Bug reports, suggestions, and contributions are welcome. For major changes, open an issue to discuss the proposal first. Never include passwords, API keys, or private user information in issues or pull requests.
License
This project is licensed under the MIT License. See LICENSE for details. Third-party dependencies and media may have separate license terms.
