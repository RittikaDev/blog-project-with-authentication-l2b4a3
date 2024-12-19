## Blog Project with Authentication L2B4A3

This project is a blogging platform designed for managing and sharing content. It includes features such as user authentication, blog creation, and editing while ensuring secure access with role-based permissions. The application is built using Node.js, Express, MongoDB, Zod Validation, JWT Token

## Features

### Blog Management:

- Create, update, and delete blogs.
- Ensure users can only update their own blogs

### Authentication:

- JWT-based secure access with role-based permissions.

## Getting Started

Follow the instructions below to set up the project locally.

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (Local or Atlas)
- A package manager (npm or yarn)

## Installation

Clone the repository:

```bash
git clone https://github.com/RittikaDev/blog-project-with-authentication-l2b4a3.git
cd car-store-B4A2V3
```

Install dependencies:

```bash
npm install
```

Set up environment variables:

- Create a .env file in the project root and configure secret keys

```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb+srv://rittikadev:rittikaadmin1234@cluster0.729wj.mongodb.net/assignment-three?retryWrites=true&w=majority&appName=Cluster0

BCRYPT_SALT_ROUNDS=12
DEFAULT_PASS=carstore!@#

JWT_ACCESS_SECRET=e341fe176377614a6cbe4fb91cea0f7687c24193993f585532db58deac241dd4
JWT_ACCESS_EXPIRES_IN=1d

JWT_REFRESH_SECRET=e59d9de219a10a3bbe5ca930c6f5ad3fbf077dd9948a7539acb707ed92d4f56dba02d54a0a2b93ef123ae5fd403b145a04c3cd95413a74ac78254cb5fbccd871
JWT_REFRESH_EXPIRES_IN=365d
```

Run the application:

```bash
npm run start:dev
```

Build the application:

```bash
npm run build
```

API Documentation

- Once the server is running, you can access the API documentation (if Swagger or Postman is configured) or use the endpoints directly via Postman.

### API Endpoints

#### User Endpoints

- Create a User:
  - POST /api/auth/register
  - Request Body:
    {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
    }
- Login:
  - POST /api/auth/login
  - Request Body:
    {
    "email": "john@example.com",
    "password": "securepassword"
    }

#### Blog Management

- Create an blog:
  - POST /api/blogs
  - Request Body:
    {
    "title": "My First Blog",
    "content": "This is the content of my blog."
    }
- Update Blog
  - PATCH /api/blogs/:id
  - Request Body:
    {
    "title": "Updated Blog Title",
    "content": "Updated content."
    }
- Delete Blog
  - DELETE /api/blogs/:id
  - Request Header:Authorization: Bearer <token>
- Get All Blogs (Public)
  - GET /api/blogs
  - Example URL /api/blogs?search=technology&sortBy=createdAt&sortOrder=desc&filter=60b8f42f9c2a3c9b7cbd4f18

#### Admin Actions

- Block User
  - PATCH /api/admin/users/:userId/block
  - Request Header:Authorization: Bearer <admin_token>
- Delete Blog
  - DELETE /api/admin/blogs/:id
  - Request Header:Authorization: Bearer <admin_token>

## Project Structure

```go
blog-project-with-authentication-l2b4a3/
├── src/
│   ├── app/
│   │   ├── builder/
│   │   │   │
│   │   │   ├── QueryBuilder.ts
│   │   │
│   │   ├── errors/
│   │   │   │
│   │   │   ├── AppErros.ts
│   │   │   ├── handleCastError.ts
│   │   │   ├── handleDuplicateError.ts
│   │   │   ├── handleValidationError.ts
│   │   │   ├── handleZodError.ts
│   │   │
│   │   ├── interface/
│   │   │   │
│   │   │   ├── errors.ts
│   │   │   ├── index.d.ts
│   │   │
│   │   ├── middlewares/
│   │   │   │
│   │   │   ├── auth.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   ├── ValidateRequest.ts
│   │   │
│   │   ├── modules/
│   │   │   │
│   │   │   ├── blog/
│   │   │   │   ├── blog.controllers.ts
│   │   │   │   ├── blog.model.ts
│   │   │   │   ├── blog.route.ts
│   │   │   │   ├── blog.service.ts
│   │   │   │   ├── blog.interface.ts
│   │   │   │   └── blog.validation.ts
│   │   │   │
│   │   │   ├── user/
│   │   │   │   ├── user.constant.ts
│   │   │   │   ├── user.controllers.ts
│   │   │   │   ├── user.interface.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── user.route.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── user.validation.ts
│   │   │   │   └── userAuth.utils.ts
│   │   │
│   │   ├─── utils/
│   │   │    └── catchAsync.ts
│   │   │    └── sendResponse.ts
│   │   │
│   │   ├─── config/
│   │       └── index.ts
│   │   │
│   │   ├─── config/
│   │       └── index.ts
│   ├── app.ts
│   ├── server.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```
