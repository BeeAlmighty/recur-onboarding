// src/types/index.ts

/**
 * Core Customer data collected from the onboarding form
 */
export interface Customer {
  name: string;
  phone: string;
  dob: string; // Formatted as "Month-Day"
  consent: boolean;
  registrationDate?: string;
}

/**
 * Response structure from the n8n 'check-customer' webhook
 */
export interface LoyaltyCheckResponse {
  exists: boolean;
  formattedNumber?: string;
  firstName?: string; // Add this
  greeting?: string; // Add this
}

/**
 * Props for the StepOne component
 */
export interface StepOneProps {
  onRegistered: () => void;
  onNotRegistered: (phone: string) => void;
}

/**
 * Props for the StepTwo component
 */
export interface StepTwoProps {
  phone: string;
}

/**
 * Standard API Error structure
 */
export interface ApiError {
  message: string;
  status?: number;
}
