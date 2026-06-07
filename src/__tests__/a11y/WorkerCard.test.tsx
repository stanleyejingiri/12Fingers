import { render } from '@testing-library/react';
import { WorkerCard } from '@/components/WorkerCard';
import { testA11y } from '@/utils/a11y';
import { BrowserRouter } from 'react-router-dom';
import { WorkerCategory } from '@/types/worker';

const mockWorker = {
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

describe('WorkerCard Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <BrowserRouter>
        <WorkerCard worker={mockWorker} />
      </BrowserRouter>
    );
    
    await testA11y(container);
  });

  it('should have proper ARIA labels and roles', () => {
    const { getByRole, getByLabelText } = render(
      <BrowserRouter>
        <WorkerCard worker={mockWorker} />
      </BrowserRouter>
    );

    expect(getByRole('article')).toBeInTheDocument();
    expect(getByRole('button', { name: /book now/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /view comments/i })).toBeInTheDocument();
  });

  it('should be keyboard navigable', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <WorkerCard worker={mockWorker} />
      </BrowserRouter>
    );

    const bookButton = getByRole('button', { name: /book now/i });
    bookButton.focus();
    expect(document.activeElement).toBe(bookButton);
  });
});
