# Sports Faculty Platform - PoC

## Project Overview
The **Sports Faculty Platform** is a proof-of-concept (PoC) application developed to showcase key platform capabilities within a **two-day** development timeframe. It provides a base template system, content editing functionality, and an admin panel for managing content.

## Features Implemented

### 1. Base Template System
- **Hero Section:** Image slider with 2-3 images, displaying coach name and title.
- **Coach Profile Section:** Displays coach details.
- **Events Calendar Section:** Lists upcoming events with add/edit functionality.
- **Content Editing:** Implemented for all sections.
- **Mobile Responsiveness:** Optimized for seamless user experience.

### 2. Technical Implementation
- **Frontend:** React.js 18 with TailwindCSS.
- **Backend:** API hosted at `http://localhost:8000/api/v1`, API documentation at `http://localhost:8000/api/v1/docs/`.
- **Database:** MongoDB integration.
- **Image Upload:** AWS S3 for media storage.
- **Content Management API:** Handles modifications efficiently.

## Specific Features

### 1. Header/Hero Section
- Image slider with 2-3 rotating images.
- Displays coach name and title.
- Fully responsive layout.

### 2. Events Calendar Section
- Displays upcoming events.
- Allows adding and editing events.
- Stores and retrieves event details (title, date, description).

### 3. Basic Admin Panel
- **Login Credentials:**
  - **Username:** admin@gmail.com
  - **Password:** Password@123
- **Template Editor Page:**
  - **Prepare Template:** Drag and drop elements.
  - **Save:** Saves the created template.
  - **Load:** Load existing template.
  - **Preview:** Preview template before uploading data.
  - **Signout:** Logs out the user.
- **Preview Page:**
  - Delete/Add buttons are shown **only for authenticated users**.
  - If not logged in, these actions are hidden.

## Tech Stack Used
- **Frontend:** React.js 18, TailwindCSS, shadcn/ui
- **Backend:** Node.js with MongoDB
- **Storage:** AWS S3 for image uploads
- **Authentication:** Admin login with role-based access

## Deliverables
- Fully functional PoC application.
- Admin credentials for testing.
- API documentation: `http://localhost:8000/api/v1/docs/`
- Frontend: `http://localhost:3000/login`
- Template editor with drag-and-drop functionality.

## How to Run the Application

### 1. Clone the Repository
```sh
git clone <repository-url>
cd sports-faculty-platform
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add:
```sh
NODE_ENV=development
PORT=8000
HOST=http://localhost
API_URL=http://localhost:8000/api/v1
CORS_ORIGIN=http://localhost:3000
MONGODB_URI="<mongo connect string>"
```
### 4. Start the Application
```sh
npm run dev
```

### 5. Access the Platform
- **Frontend:** `http://localhost:3000/login`
- **API Docs:** `http://localhost:8000/api/v1/docs/`

This proof of concept sets the foundation for future development and feature expansion. 🚀
