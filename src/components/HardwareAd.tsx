import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HardwareAd {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  link: string;
  contactInfo: string;
  detailedDescription: string;
}

const hardwareAds: HardwareAd[] = [
  {
    id: "1",
    title: "Professional Tool Set",
    description: "Complete set of professional-grade tools for any job",
    detailedDescription: "This comprehensive professional tool set includes everything you need for both basic repairs and complex projects. Features high-quality steel construction, ergonomic handles, and a lifetime warranty.",
    imageUrl: "/placeholder.svg",
    price: 299.99,
    link: "https://example.com/toolset",
    contactInfo: "sales@toolset.com | +1 (555) 123-4567"
  },
  {
    id: "2",
    title: "Power Drill Kit",
    description: "High-performance cordless drill with accessories",
    detailedDescription: "Professional-grade 20V cordless drill with variable speed control, LED work light, and a complete set of drill bits. Includes two batteries, charger, and carrying case.",
    imageUrl: "/placeholder.svg",
    price: 199.99,
    link: "https://example.com/powerdrill",
    contactInfo: "support@powertools.com | +1 (555) 987-6543"
  }
];

export const HardwareAd = () => {
  const [selectedAd, setSelectedAd] = React.useState<HardwareAd | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {hardwareAds.map((ad) => (
          <Card key={ad.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg">{ad.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={ad.imageUrl} 
                alt={ad.title} 
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <p className="text-sm text-muted-foreground">{ad.description}</p>
              <p className="text-lg font-bold mt-2">${ad.price}</p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => setSelectedAd(ad)}
              >
                Learn More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedAd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>{selectedAd.title}</CardTitle>
              <Button 
                variant="ghost" 
                className="absolute top-2 right-2"
                onClick={() => setSelectedAd(null)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <img 
                src={selectedAd.imageUrl} 
                alt={selectedAd.title} 
                className="w-full h-64 object-cover rounded-md"
              />
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p>{selectedAd.detailedDescription}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Price</h3>
                <p className="text-xl font-bold">${selectedAd.price}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <p>{selectedAd.contactInfo}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedAd(null)}>
                Close
              </Button>
              <Button asChild>
                <a href={selectedAd.link} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};
