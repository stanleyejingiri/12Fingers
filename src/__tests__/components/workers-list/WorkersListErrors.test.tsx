import { render, screen } from '@testing-library/react';
import { WorkersList } from '@/components/WorkersList';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWorkers } from '@/hooks/useWorkers';
import { useLocation } from '@/hooks/useLocation';

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

describe('WorkersList Error Handling', () => {
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

  it('displays error message when worker fetch fails', () => {
    const error = new Error('Failed to fetch workers');
    mockUseWorkers.mockReturnValue({
      data: undefined,
      isLoading: false,
      error,
      isError: true,
      isPending: false,
      isLoadingError: true,
      isRefetchError: false,
      refetch: jest.fn(),
      status: 'error',
      fetchStatus: 'idle'
    } as any);

    renderComponent();
    expect(screen.getByText(/Failed to fetch workers/i)).toBeInTheDocument();
  });

  it('handles location errors gracefully', () => {
    mockUseWorkers.mockReturnValue({
      data: [],
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

    mockUseLocation.mockReturnValue({
      userLocation: null,
      detectedCountry: { code: '', name: '' },
      loading: false,
      error: 'Location access denied',
      calculateDistance: jest.fn(),
      filterWorkersByDistance: jest.fn(),
      detectCountry: jest.fn().mockResolvedValue(null)
    });

    renderComponent();
    expect(screen.getByText(/Location access denied/i)).toBeInTheDocument();
  });
});