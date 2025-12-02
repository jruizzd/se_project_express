# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## About

The WTWR API helps users choose appropriate clothing based on current weather conditions. It provides a backend service for managing user wardrobes and delivering weather-based clothing recommendations.

## Features

- User registration and profile management
- Add and manage clothing items in personal wardrobe
- Categorize clothing by weather conditions (hot, warm, cold)
- Like and unlike clothing items
- Get weather-appropriate clothing recommendations

## Data Management

The API manages three main types of data:

- **User profiles**: Authentication and personal information
- **Clothing items**: Name, weather category, images, and ownership details
- **User interactions**: Liked items and wardrobe collections

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12

## Technologies and Techniques Used

This project uses the following technologies:

- Node.js and Express for the backend server
- MongoDB with Mongoose for data storage
- ESLint with Airbnb configuration for code quality
- Prettier for code formatting
- Nodemon for development
