# Property Listing Module

A modern property listing application built with Laravel 12, React 19, TypeScript, and Tailwind CSS. This project uses Inertia.js for seamless server-side rendering and client-side navigation.

## Features

- 🏠 Property listing management
- 🎨 Modern UI with Tailwind CSS and Radix UI components 
- 🔒 Authentication and authorization 
- 📱 Responsive design 
- 🚀 Server-side rendering (SSR) support
- 🔍 API documentation with Swagger/OpenAPI 
- ✨ Type-safe development with TypeScript
- 🧪 Testing with Pest PHP
 
## Prerequisites

- PHP 8.2 or higher
- Node.js 18.0 or higher
- Composer
- MySQL/PostgreSQL

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd property-listing-module
```

2. Install PHP dependencies:

```bash
composer install
```

3. Install JavaScript dependencies:

```bash
npm install
```

4. Configure environment:

```bash
cp .env.example .env
php artisan key:generate
```

5. Configure your database in the `.env` file and run migrations:

```bash
php artisan migrate
```

## Development

Start the development server:

```bash
# Run the development server with hot-reloading
composer run dev

# Or with SSR enabled
composer run dev:ssr
```

This will start:

- Laravel development server
- Vite development server
- Queue worker
- Log viewer

Once the application is running, you can access:

- Application: http://localhost:8000
- API Documentation: http://localhost:8000/api/documentation (Swagger/OpenAPI interface)

To generate/update the API documentation, run:

```bash
php artisan l5-swagger:generate
```

### Available Commands

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Type checking
npm run types

# Build for production
npm run build

# Build with SSR
npm run build:ssr
```

## Testing

```bash
# Run PHP tests
./vendor/bin/pest

# Run TypeScript type checking
npm run types
```

## Project Structure

- `/app` - Laravel application code
- `/resources` - Frontend assets and React components
- `/routes` - API and web routes
- `/database` - Database migrations and seeders
- `/tests` - Test files
- `/config` - Application configuration

## Tech Stack

### Backend

- Laravel 12.x
- PHP 8.2+
- Laravel Pail (for logging)
- L5-Swagger (API documentation)

### Frontend

- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- Inertia.js
- Vite

### Testing

- Pest PHP
- Laravel Testing Tools

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
