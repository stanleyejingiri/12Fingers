import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Help() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Help & FAQ</h1>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I book a service?</AccordionTrigger>
              <AccordionContent>
                Browse through our list of skilled workers, view their profiles, and click the "Book Now" 
                button. Select your preferred date and time, provide any necessary details, and confirm 
                your booking.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do payments work?</AccordionTrigger>
              <AccordionContent>
                Payments are processed securely through our platform. You'll be charged after the service 
                is completed and you've confirmed your satisfaction with the work.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I cancel a booking?</AccordionTrigger>
              <AccordionContent>
                Yes, you can cancel a booking up to 24 hours before the scheduled time without any penalty. 
                Later cancellations may incur a fee.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How do I become a service provider?</AccordionTrigger>
              <AccordionContent>
                Sign up as a service provider, complete your profile with relevant experience and 
                certifications, and start receiving booking requests once approved.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What if I have an issue with a service?</AccordionTrigger>
              <AccordionContent>
                Contact our support team immediately through the support form. We'll help resolve any 
                issues between you and the service provider.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
