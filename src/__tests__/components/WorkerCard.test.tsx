import { render, screen } from '@testing-library/react';
import { WorkerCard } from '@/components/WorkerCard';
import { WorkerProfile, WorkerCategory } from '@/types/worker';
import { BrowserRouter } from 'react-router-dom';

const mockWorker: WorkerProfile = {
  id: '1',
  userId: 'user1',
  name: 'John Doe',
  category: 'Plumber' as WorkerCategory,
  isVerified: true,
  isPremium: false,
  yearsOfExperience: 5,
  contactPhone: '1234567890',
  contactEmail: 'john@example.com',
  hourlyRate: 50,
  description: 'Professional plumber',
  averageRating: 4.5,
  totalRatings: 10,
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    address: 'New York, NY'
  },
  availability: [],
  profileImageUrl: '/placeholder.svg',
  offersWarranty: false,
  servicePackages: [],
  created_at: new Date().toISOString()
};

describe('WorkerCard', () => {
  it('renders worker information correctly', () => {
    render(
      <BrowserRouter>
        <WorkerCard worker={mockWorker} />
      </BrowserRouter>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Plumber')).toBeInTheDocument();
    expect(screen.getByText('$50/hr')).toBeInTheDocument();
    expect(screen.getByText('5 years experience')).toBeInTheDocument();
  });

  it('displays verified badge when worker is verified', () => {
    render(
      <BrowserRouter>
        <WorkerCard worker={mockWorker} />
      </BrowserRouter>
    );

    expect(screen.getByTestId('verified-badge')).toBeInTheDocument();
  });
});
