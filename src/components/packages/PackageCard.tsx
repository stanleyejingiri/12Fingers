//src/components/packages/PackageCard.tsx
/*
import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServicePackage } from "@/types/worker";

interface PackageCardProps {
  pkg: ServicePackage;
  isSelected: boolean;
  onSelect: (pkg: ServicePackage) => void;
}

export const PackageCard = ({ pkg, isSelected, onSelect }: PackageCardProps) => {
  console.log("PackageCard - Rendering package:", pkg);

  return (
    <Card 
      className={`flex flex-col relative transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      } ${
        pkg.tier === 'premium' ? 'border-primary' : ''
      }`}
      onClick={() => onSelect(pkg)}
    >
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          {pkg.name}
          {pkg.tier === 'premium' && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              Popular
            </span>
          )}
        </CardTitle>
        <p className="text-3xl font-bold">${pkg.price}</p>
        <p className="text-sm text-muted-foreground">{pkg.description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {pkg.features && pkg.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full text-sm"
          variant={isSelected ? 'default' : 'outline'}
          onClick={() => onSelect(pkg)}
        >
          {isSelected ? 'Selected' : 'Select Package'}
        </Button>
      </CardFooter>
    </Card>
  );
};
*/
// src/components/packages/PackageCard.tsx
import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServicePackage } from "@/types/worker";

interface PackageCardProps {
  pkg: ServicePackage;
  isSelected: boolean;
  onSelect: (pkg: ServicePackage) => void;
}

export const PackageCard = ({ pkg, isSelected, onSelect }: PackageCardProps) => {
  // 🔴 Convert features to array if it's a string
  const featuresList = React.useMemo(() => {
    if (!pkg.features) return [];
    if (Array.isArray(pkg.features)) return pkg.features;
    return pkg.features.split(',').map(f => f.trim());
  }, [pkg.features]);

  console.log("PackageCard - Rendering package:", pkg);

  return (
    <Card 
      className={`flex flex-col relative transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      } ${
        pkg.tier === 'premium' ? 'border-primary' : ''
      }`}
      onClick={() => onSelect(pkg)}
    >
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          {pkg.name}
          {pkg.tier === 'premium' && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
              Popular
            </span>
          )}
        </CardTitle>
        <p className="text-3xl font-bold">${pkg.price}</p>
        <p className="text-sm text-muted-foreground">{pkg.description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {featuresList.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full text-sm"
          variant={isSelected ? 'default' : 'outline'}
          onClick={() => onSelect(pkg)}
        >
          {isSelected ? 'Selected' : 'Select Package'}
        </Button>
      </CardFooter>
    </Card>
  );
};
