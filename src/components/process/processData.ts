import {
  User,
  CreditCard,
  BadgeCheck,
  Mail,
  Play,
  Award,
} from "lucide-react";

export const processSteps = [
  {
    id: "01",
    icon: User,
    title: "Register",
    description: "Create your account",
  },
  {
    id: "02",
    icon: CreditCard,
    title: "Payment",
    description: "Complete payment",
  },
  {
    id: "03",
    icon: BadgeCheck,
    title: "Verification",
    description: "Admin approval",
  },
  {
    id: "04",
    icon: Mail,
    title: "Credentials",
    description: "Get login details",
  },
  {
    id: "05",
    icon: Play,
    title: "Learn",
    description: "Start internship",
  },
  {
    id: "06",
    icon: Award,
    title: "Certificate",
    description: "Receive certificate",
  },
];