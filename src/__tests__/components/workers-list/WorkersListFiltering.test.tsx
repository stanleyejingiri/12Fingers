import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkersList } from '@/components/WorkersList';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWorkers } from '@/hooks/useWorkers';
import { useLocation } from '@/hooks/useLocation';
import { WorkerProfile } from '@/types/worker';

jest.mock('@/hooks/useWorkers');
jest.mock('@/hooks/useLocation');

const mockUseWorkers = useWorkers as jest.MockedFunction<typeof useWorkers>;
const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <WorkersList />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('WorkersList Filtering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue({
      userLocation: null,
      detectedCountry: { code: '', name: '' },
      loading: false,
      error: null,
      calculateDistance: jest.fn(),
      filterWorkersByDistance: jest.fn(),
      detectCountry: jest.fn().mockResolvedValue(null)
    });
  });

  it('filters workers based on search term', async () => {
    const mockWorkers: WorkerProfile[] = [
      {
        id: '1',
        userId: 'user1',
        name: 'John Doe',
        category: 'Plumber',
        isVerified: true,
        yearsOfExperience: 5,
        contactPhone: '123-456-7890',
        contactEmail: 'john@example.com',
        availability: [],
        profileImageUrl: '/placeholder.svg',
        offersWarranty: false,
        averageRating: 4.5,
        totalRatings: 10,
        hourlyRate: 50,
        description: '',
        created_at: new Date().toISOString(),
        servicePackages: [],
        location: { latitude: 0, longitude: 0, country: 'US' }
      },
      {
        id: '2',
        userId: 'user2',
        name: 'Jane Smith',
        category: 'Electrician',
        isVerified: true,
        yearsOfExperience: 3,
        contactPhone: '123-456-7891',
        contactEmail: 'jane@example.com',
        availability: [],
        profileImageUrl: '/placeholder.svg',
        offersWarranty: false,
        averageRating: 4.0,
        totalRatings: 8,
        hourlyRate: 45,
        description: '',
        created_at: new Date().toISOString(),
        servicePackages: [],
        location: { latitude: 0, longitude: 0, country: 'CA' }
      }
    ];

    mockUseWorkers.mockReturnValue({
      data: mockWorkers,
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      refetch: jest.fn(),
      status: 'success',
      fetchStatus: 'idle'
    } as any);

    renderComponent();

    const searchInput = screen.getByPlaceholderText('Search by name...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('filters workers by category', async () => {
    const mockWorkers: WorkerProfile[] = [
      {
        id: '1',
        userId: 'user1',
        name: 'John Doe',
        category: 'Plumber',
        isVerified: true,
        yearsOfExperience: 5,
        contactPhone: '123-456-7890',
        contactEmail: 'john@example.com',
        availability: [],
        profileImageUrl: '/placeholder.svg',
        offersWarranty: false,
        averageRating: 4.5,
        totalRatings: 10,
        hourlyRate: 50,
        description: '',
        created_at: new Date().toISOString(),
        servicePackages: [],
        location: { latitude: 0, longitude: 0, country: 'US' }
      }
    ];

    mockUseWorkers.mockReturnValue({
      data: mockWorkers,
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      refetch: jest.fn(),
      status: 'success',
      fetchStatus: 'idle'
    } as any);

    renderComponent();

    const categorySelect = screen.getByRole('combobox', { name: /category/i });
    fireEvent.change(categorySelect, { target: { value: 'Plumber' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('filters workers by price range', async () => {
    const mockWorkers: WorkerProfile[] = [
      {
        id: '1',
        userId: 'user1',
        name: 'John Doe',
        category: 'Plumber',
        isVerified: true,
        yearsOfExperience: 5,
        contactPhone: '123-456-7890',
        contactEmail: 'john@example.com',
        availability: [],
        profileImageUrl: '/placeholder.svg',
        offersWarranty: false,
        averageRating: 4.5,
        totalRatings: 10,
        hourlyRate: 50,
        description: '',
        created_at: new Date().toISOString(),
        servicePackages: [],
        location: { latitude: 0, longitude: 0, country: 'US' }
      }
    ];

    mockUseWorkers.mockReturnValue({
      data: mockWorkers,
      isLoading: false,
      error: null,
      isError: false,
      isPending: false,
      isLoadingError: false,
      isRefetchError: false,
      refetch: jest.fn(),
      status: 'success',
      fetchStatus: 'idle'
    } as any);

    renderComponent();

    const minPriceInput = screen.getByPlaceholderText('Min');
    const maxPriceInput = screen.getByPlaceholderText('Max');
    
    fireEvent.change(minPriceInput, { target: { value: '40' } });
    fireEvent.change(maxPriceInput, { target: { value: '60' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
