E-Learning Platform
A full-stack e-learning platform designed to help learners discover courses, enroll in learning experiences, and access course content online. The project includes a client application and a server API, with authentication and media-management integrations.
Project status: Under active development. Features, routes, and setup details may change as the project evolves.

Features
The following describes the intended capabilities of the platform; confirm each item against the current implementation before presenting it as production-ready.
- Authentication: User sign-in and session handling using Clerk.
- Course management: Organize and manage courses and their learning content.
- Enrollment: Support learner enrollment in courses.
- Media management: Integrate with Cloudinary for supported media assets.
- Admin tools: Provide administrative workflows for managing platform content.
- Responsive client: A web client for accessing the platform on supported screen sizes.
Technology Stack
Based on the project's current architecture, the stack includes:
- Client: JavaScript and React (confirm the exact framework and build tool in client/package.json).
- Server: Node.js and Express.
- Database: MongoDB.
- Authentication: Clerk.
- Media storage: Cloudinary.
- Development tools: npm and Git.
Project Structure
E-Learning-Platform/
├── client/       # Frontend application
├── server/       # Backend API
└── README.md
Your repository may contain additional folders and configuration files. Check the actual project tree for the complete structure.
Prerequisites
Install the following before running the project:
- Node.js (use a version supported by the project's package files; Node.js 18.18 or newer is suitable if that requirement applies to your server)
- npm
- A MongoDB database (local MongoDB or MongoDB Atlas)
- A Clerk application and its required keys
- Cloudinary credentials if you use its media features
Getting Started
1. Clone the repository
git clone https://github.com/Wonde-Dev/E-Learning-Platform.git
cd E-Learning-Platform
2. Install dependencies
Install dependencies in each application directory that has its own package.json:
cd server
npm install
Then, in a second terminal or after returning to the root:
cd ../client
npm install
3. Configure environment variables
Check the server and client source code for the exact environment-variable names it reads. Create local .env files in the appropriate directories and supply your own values. Do not commit real credentials.
Typical server-side settings may include:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
Typical client-side settings may include a Clerk publishable key, for example:
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
Important: These are examples, not guaranteed variable names for this repository. Use the names expected by your code and framework. Some frameworks require a specific prefix for client-exposed variables. Never expose secret keys in client-side code.
4. Start the applications
Use the scripts defined in each directory's package.json. For example, if the server defines a dev script:
cd server
npm run dev
If the client defines a dev script:
cd client
npm run dev
If the available scripts differ, run npm run inside the relevant directory to list them. The terminal will display the local URL for the client; check the server configuration for its API port.
Environment and Security Notes
- Keep .env files and credentials out of Git. Add them to .gitignore.
- Provide a .env.example containing variable names and safe placeholders, never real secrets.
- Validate and authorize administrative operations on the server, not only in the client UI.
- Keep authentication, database, and media-provider secret keys on the server.
- Configure production CORS, cookie settings, and allowed origins for your deployment.
- Do not upload private course material unless you have the rights and access controls needed for it.
- Rotate any secret that has accidentally been committed or shared.
Development Workflow
1. Create a feature branch for larger changes.
2. Make and test your changes locally.
3. Check git status and review your diff before committing.
4. Never commit .env, API keys, database passwords, or user data.
5. Push your branch and open a pull request if you are collaborating with others.
Contributing
Contributions, bug reports, and suggestions are welcome. For substantial changes, open an issue first to discuss the proposal. Please include reproduction steps for bug reports and avoid sharing credentials or personal data.
License
This project is licensed under the MIT License. See the LICENSE file for details.
Third-party libraries, services, icons, fonts, images, and course materials may be subject to their own licenses and terms. This project's license does not override those terms.
