//src/components/booking/payment/paymentMethodsConfig.tsx
import { CreditCard, Wallet } from "lucide-react";

export const paymentMethods = [
  {
    id: "card",
    value: "card",
    label: "Card",
    tooltipContent: "Securely pay with your credit or debit card",
    icon: <CreditCard className="mb-2 h-6 w-6" />,
  },
  {
    id: "paypal",
    value: "paypal",
    label: "PayPal",
    tooltipContent: "Pay securely using your PayPal account",
    icon: (
      <svg className="mb-2 h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5 8.5h-2.5a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2h-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 16.5h-1.5a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2h-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "wallet",
    value: "wallet",
    label: "Wallet",
    tooltipContent: "Pay using your available wallet balance",
    icon: <Wallet className="mb-2 h-6 w-6" />,
  },
];
