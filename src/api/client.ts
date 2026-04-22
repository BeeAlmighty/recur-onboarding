// src/api/client.ts
const N8N_BASE_URL = "https://n8n.geotech.agency/webhook";

export interface CheckResponse {
  exists: boolean;
  firstName?: string;
  greeting?: string;
  formattedNumber?: string;
}

export interface RegisterResponse {
  success: boolean;
  firstName?: string;
  greeting?: string;
}

export const recurClient = {
  /**
   * Checks if a phone number exists in Airtable via n8n
   */
  checkCustomer: async (phone: string): Promise<CheckResponse> => {
    try {
      const response = await fetch(`${N8N_BASE_URL}/verify-customer-recur`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawNumber: phone, countryCode: "+234" }),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return { ...data, success: true };
      // return await response.json();
    } catch (error) {
      console.error("API Error (checkCustomer):", error);
      throw error;
    }
  },

  /**
   * Registers a new customer in Airtable via n8n
   */
  registerCustomer: async (payload: {
    phone: string;
    name: string;
    dob: string;
    consent: boolean;
  }): Promise<RegisterResponse> => {
    try {
      const response = await fetch(`${N8N_BASE_URL}/register-customer-recur`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Registration failed");
      const data = await response.json();
      return { ...data, success: true };
    } catch (error) {
      console.error("API Error (registerCustomer):", error);
      throw error;
    }
  },
};
