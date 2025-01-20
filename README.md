# MindMate

MindMate is a comprehensive mental health and wellness platform designed to provide resources, counseling, and support to students, parents, and counselors.

## Features

- **Responsive Design**: Optimized for both mobile and desktop views.
- **User Roles**: Supports multiple user roles including students, counselors, and parents.
- **Counseling Sessions**: Facilitates chat and support sessions.
- **Resource Management**: Provides educational resources for students and parents.
- **User Management**: Admin functionalities for managing users and settings.

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mindmate.git
   cd mindmate
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
MONGO_URI=your_mongodb_connection_string
```

## Running the Application

1. **Start the server**
   ```bash
   npm run start:server
   ```

2. **Start the client**
   ```bash
   npm run start:client
   ```

## Seeding the Database

To seed the database with test users:

```bash
npm run seed:users
```

## Technologies Used

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT

## Flowcharts
![Image](https://github.com/user-attachments/assets/6e349bc1-9768-414c-8976-a85263a3a9e0)

![Image](https://github.com/user-attachments/assets/0fc70779-bb23-4e93-ac25-7d43ba69a5a6)
