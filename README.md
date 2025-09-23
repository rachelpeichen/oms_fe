# OMS - Order Management System

A modern React-based Order Management System built with TypeScript and Vite, featuring comprehensive campaign and invoice management capabilities.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: React Bootstrap
- **Routing**: React Router DOM
- **Export**: ExcelJS for Excel file generation
- **Styling**: Bootstrap 5 + Custom CSS

## Getting Started

1. Clone the repository
```bash
git clone git@github.com:rachelpeichen/oms_fe.git
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Docker Support

The application includes Docker configuration for easy deployment:

1. Build the Docker image
```bash
docker build -t oms-app .
```

2. Run the container
```bash
docker run -p 4173:4173 oms-app
```