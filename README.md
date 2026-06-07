# Worker Services Platform

A comprehensive platform connecting skilled workers with clients, built with React, TypeScript, and Supabase.

## Features

- **Worker Discovery**: Search and filter workers by category, rating, price range, and more
- **Real-time Messaging**: Direct communication between clients and workers
- **Booking System**: Schedule and manage service appointments
- **Reviews & Ratings**: Leave and view worker reviews
- **Service Packages**: Workers can offer different service tiers
- **User Authentication**: Secure login and registration system
- **Profile Management**: Detailed worker profiles with portfolios and certifications

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Backend & Auth**: Supabase
- **Testing**: Cypress for E2E tests
- **Form Handling**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account (for backend services)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

### Worker Profiles

The platform uses Supabase for data storage and API endpoints. Here are the main tables and their relationships:

- `worker_profiles`: Stores worker information
- `service_packages`: Contains service offerings
- `reviews`: Manages client reviews
- `bookings`: Handles service bookings
- `messages`: Stores communication between users

For detailed API documentation, see [API.md](./docs/API.md)

## Component Documentation

Key components are organized as follows:

- `src/components/`
  - `WorkersList.tsx`: Main worker listing component
  - `WorkerCard.tsx`: Individual worker display
  - `SearchFilters.tsx`: Search and filtering interface
  - `BookingForm.tsx`: Service booking form
  - `WorkerProfile.tsx`: Detailed worker profile view

For detailed component documentation, see [COMPONENTS.md](./docs/COMPONENTS.md)

## Testing

End-to-end tests are written using Cypress. Run tests with:

```bash
npm run test:e2e
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.