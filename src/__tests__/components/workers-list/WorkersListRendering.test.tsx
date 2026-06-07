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

describe('WorkersList Rendering', () => {
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

  it('renders search filters', () => {
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

    renderComponent();

    expect(screen.getByPlaceholderText('Search by name...')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('displays loading state while fetching workers', () => {
    mockUseWorkers.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isPending: true,
      isLoadingError: false,
      isRefetchError: false,
      refetch: jest.fn(),
      status: 'loading',
      fetchStatus: 'fetching'
    } as any);

    renderComponent();
    expect(screen.getByTestId('workers-loading')).toBeInTheDocument();
  });
});
