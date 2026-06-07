import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { WorkersListControls } from "@/components/workers/WorkersListControls";
import { useLocation } from "@/hooks/useLocation";
import { SortOption } from "@/types/worker";

jest.mock("@/hooks/useLocation");

const mockLocationHook = {
  userLocation: null,
  detectedCountry: { code: '', name: '' },
  loading: false,
  error: null,
  calculateDistance: jest.fn(),
  filterWorkersByDistance: jest.fn(),
  detectCountry: jest.fn(),
};

const defaultProps = {
  sortBy: 'rating' as SortOption,
  onSortChange: jest.fn(),
  viewMode: 'grid' as const,
  onViewModeChange: jest.fn(),
};

describe("WorkersListControls", () => {
  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue(mockLocationHook);
  });

  it("renders without crashing", () => {
    render(<WorkersListControls {...defaultProps} />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });

  it("displays location error message when error is present", () => {
    mockLocationHook.error = "Unable to detect location.";
    (useLocation as jest.Mock).mockReturnValue(mockLocationHook);
    
    render(<WorkersListControls {...defaultProps} />);
    
    expect(screen.getByText("Unable to detect location.")).toBeInTheDocument();
    expect(screen.getByText("Enable location services to see workers in your area and get better recommendations.")).toBeInTheDocument();
  });

  it("closes the location error message when close button is clicked", () => {
    mockLocationHook.error = "Unable to detect location.";
    (useLocation as jest.Mock).mockReturnValue(mockLocationHook);
    
    render(<WorkersListControls {...defaultProps} />);
    
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    
    expect(screen.queryByText("Unable to detect location.")).not.toBeInTheDocument();
  });
});