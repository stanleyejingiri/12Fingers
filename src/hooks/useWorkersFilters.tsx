//src/hooks/useWorkersFilters.tsx - COMPLETE FIXED VERSION
/*
import { useState, useEffect } from "react";
import { SortOption } from "@/types/worker";
import { useUserLocation } from "./useUserLocation";

export const useWorkersFilters = () => {
  const { location: userDetectedLocation } = useUserLocation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxDistance, setMaxDistance] = useState(20);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [page, setPage] = useState(1);
  const [minExperience, setMinExperience] = useState(0);
  const [maxExperience, setMaxExperience] = useState(30);
  const [minRating, setMinRating] = useState(0);
  const [requireCertification, setRequireCertification] = useState(false);
  const [requireWarranty, setRequireWarranty] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Initialize with IP detection OR empty
  const [selectedCountry, setSelectedCountry] = useState<string>(userDetectedLocation?.countryId || "");
  const [selectedState, setSelectedState] = useState<string>(userDetectedLocation?.stateId || "");
  const [selectedCity, setSelectedCity] = useState<string>(userDetectedLocation?.cityId || "");

  // Sync with IP detection when it loads
  useEffect(() => {
    if (userDetectedLocation?.countryId && !selectedCountry) {
      console.log('🔄 [useWorkersFilters] Syncing with IP detection:', userDetectedLocation);
      setSelectedCountry(userDetectedLocation.countryId);
      setSelectedState(userDetectedLocation.stateId || "");
      setSelectedCity(userDetectedLocation.cityId || "");
    }
  }, [userDetectedLocation, selectedCountry]);

  // Wrapped setters with cascading logic
  const handleSetSelectedCountry = (value: string) => {
    console.log('🔄 [useWorkersFilters] Manual country change:', value);
    setSelectedCountry(value);
    if (value === "all" || !value) {
      setSelectedState("");
      setSelectedCity("");
    } else {
      setSelectedState("");
      setSelectedCity("");
    }
  };

  const handleSetSelectedState = (value: string) => {
    console.log('🔄 [useWorkersFilters] Manual state change:', value);
    setSelectedState(value);
    if (value === "all" || !value) {
      setSelectedCity("");
    }
  };

  const handleSetSelectedCity = (value: string) => {
    console.log('🔄 [useWorkersFilters] Manual city change:', value);
    setSelectedCity(value);
  };

  return {
    filters: {
      searchTerm,
      selectedCategory,
      minPrice,
      maxPrice,
      maxDistance,
      sortBy,
      page,
      minExperience,
      maxExperience,
      minRating,
      requireCertification,
      requireWarranty,
      viewMode,
      selectedCountry,  
      selectedState,    
      selectedCity,     
    },
    setters: {
      setSearchTerm,
      setSelectedCategory,
      setMinPrice,
      setMaxPrice,
      setMaxDistance,
      setSortBy,
      setPage,
      setMinExperience,
      setMaxExperience,
      setMinRating,
      setRequireCertification,
      setRequireWarranty,
      setViewMode,
      setSelectedCountry: handleSetSelectedCountry,
      setSelectedState: handleSetSelectedState,
      setSelectedCity: handleSetSelectedCity,
    }
  };
};
*/
// src/hooks/useWorkersFilters.tsx - COMPLETE FIXED VERSION
import { useState, useEffect } from "react";
import { SortOption } from "@/types/worker";
import { useUserLocation } from "./useUserLocation";

export const useWorkersFilters = () => {
  const { location: userDetectedLocation } = useUserLocation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxDistance, setMaxDistance] = useState(20);
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [page, setPage] = useState(1);
  const [minExperience, setMinExperience] = useState(0);
  const [maxExperience, setMaxExperience] = useState(30);
  const [minRating, setMinRating] = useState(0);
  const [requireCertification, setRequireCertification] = useState(false);
  const [requireWarranty, setRequireWarranty] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Helper: Get initial country from localStorage (returning user) or detection (first visit)
  const getInitialCountry = (): string => {
    const saved = localStorage.getItem('userPreferredCountry');
    if (saved && saved !== "all") {
      console.log('📍 [useWorkersFilters] Using saved country:', saved);
      return saved;
    }
    if (userDetectedLocation?.countryId) {
      console.log('📍 [useWorkersFilters] Using detected country:', userDetectedLocation.countryId);
      return userDetectedLocation.countryId;
    }
    console.log('📍 [useWorkersFilters] No country detected, showing all countries');
    return "";
  };

  const [selectedCountry, setSelectedCountry] = useState<string>(getInitialCountry());
  const [selectedState, setSelectedState] = useState<string>(userDetectedLocation?.stateId || "");
  const [selectedCity, setSelectedCity] = useState<string>(userDetectedLocation?.cityId || "");

  // Save to localStorage when user manually changes country
  const handleSetSelectedCountry = (value: string) => {
    console.log('🔄 [useWorkersFilters] Manual country change:', value);
    setSelectedCountry(value);
    if (value && value !== "all") {
      localStorage.setItem('userPreferredCountry', value);
    } else if (value === "all") {
      localStorage.removeItem('userPreferredCountry');
    }
    // Reset dependent filters
    setSelectedState("");
    setSelectedCity("");
  };

  const handleSetSelectedState = (value: string) => {
    console.log('🔄 [useWorkersFilters] Manual state change:', value);
    setSelectedState(value);
    if (value === "all" || !value) {
      setSelectedCity("");
    }
  };

  const handleSetSelectedCity = (value: string) => {
    console.log('🔄 [useWorkersFilters] Manual city change:', value);
    setSelectedCity(value);
  };

  return {
    filters: {
      searchTerm,
      selectedCategory,
      minPrice,
      maxPrice,
      maxDistance,
      sortBy,
      page,
      minExperience,
      maxExperience,
      minRating,
      requireCertification,
      requireWarranty,
      viewMode,
      selectedCountry,  
      selectedState,    
      selectedCity,     
    },
    setters: {
      setSearchTerm,
      setSelectedCategory,
      setMinPrice,
      setMaxPrice,
      setMaxDistance,
      setSortBy,
      setPage,
      setMinExperience,
      setMaxExperience,
      setMinRating,
      setRequireCertification,
      setRequireWarranty,
      setViewMode,
      setSelectedCountry: handleSetSelectedCountry,
      setSelectedState: handleSetSelectedState,
      setSelectedCity: handleSetSelectedCity,
    }
  };
};
