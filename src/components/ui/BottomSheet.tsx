// src/components/ui/BottomSheet.tsx
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showAdvancedFilters?: boolean;
  onAdvancedFiltersClick?: () => void;
}

export const BottomSheet = ({
  isOpen,
  onClose,
  title = "Search Filters",
  children,
  showAdvancedFilters = false,
  onAdvancedFiltersClick,
}: BottomSheetProps) => {
  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto max-w-2xl",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Draggable handle */}
        <div className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full mb-2" />

        {/* Sheet content */}
        <div className="bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>

          {/* Footer with Advanced Filters link */}
          {showAdvancedFilters && onAdvancedFiltersClick && (
            <div className="border-t p-4">
              <button
                onClick={onAdvancedFiltersClick}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium w-full text-center py-2"
              >
                + Advanced Filters
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={onClose}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
