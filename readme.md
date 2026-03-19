# NAVI - Agentic Productivity Web App

An intelligent productivity application designed to help you manage your tasks, notes, and habits in one unified platform. NAVI leverages modern web technologies to provide a seamless user experience.

## Overview

NAVI is a full-stack web application that combines a Vue.js frontend with an Express.js backend, powered by MongoDB for data persistence. Whether you're tracking daily todos, capturing quick notes, or building productive habits, NAVI keeps you organized and motivated.

## Features

- **Todo Management** - Create, update, and track your tasks with ease
- **Notes** - Capture and organize your thoughts and ideas
- **Habit Tracking** - Build and maintain positive habits with progress tracking
- **User Authentication** - Secure account management with bcrypt password hashing
- **File Uploads** - Attach files to your tasks and notes
- **Real-time Updates** - Stay synchronized across your devices

## Tech Stack

### Frontend
- **Vue 3** - Modern JavaScript framework for building UI
- **Vite** - Lightning-fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework for styling
- **Axios** - Promise-based HTTP client
- **Lucide Vue** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework for building REST APIs
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing and encryption
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing support

## Project Structure

```
NAVI/
├── server.js              # Main Express server entry point
├── auth.js                # Authentication logic
├── db.js                  # Database configuration
├── multer.js              # File upload configuration
├── package.json           # Backend dependencies
├── routes/                # API route handlers
│   ├── user.js           # User routes
│   ├── todo.js           # Todo routes
│   ├── notes.js          # Notes routes
│   └── habits.js         # Habit routes
├── frontend/              # Vue.js frontend application
│   ├── src/              # Vue components and logic
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
└── prototype/            # Prototype/static files

```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or remote)

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables by creating a `.env` file:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

3. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## API Routes

The application provides the following API endpoints:

- **User Routes** - `/api/users/*` - User authentication and profile management
- **Todo Routes** - `/api/todos/*` - CRUD operations for tasks
- **Notes Routes** - `/api/notes/*` - Create and manage notes
- **Habit Routes** - `/api/habits/*` - Track and manage daily habits

## Development

### Running Locally

1. Ensure MongoDB is running
2. Start the backend server: `npm start`
3. In a new terminal, start the frontend: `cd frontend && npm run dev`
4. Open your browser to `http://localhost:5173` (or the URL shown by Vite)

### Code Style

The project uses JavaScript ES modules throughout. Make sure to:
- Use `import/export` statements
- Follow the existing directory structure
- Keep API responses consistent across routes

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests to help improve NAVI.

## License

This project is licensed under the ISC License - see the `package.json` file for details.

## Author

Created by [@samir419](https://github.com/samir419)

---

**Happy Productivity! 🚀**
