// // src/hooks/useOnboarding.ts
// import { useState } from "react";
// import { medMateApi } from "../api/client";

// export const useOnboarding = () => {
//   const [view, setView] = useState<"CHECK" | "REGISTER" | "ALREADY_IN">(
//     "CHECK",
//   );
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleCheckPhone = async (phone: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { exists } = await medMateApi.checkLoyalty(phone);
//       if (exists) setView("ALREADY_IN");
//       else setView("REGISTER");
//     } catch (err) {
//       setError("Could not verify status. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { view, setView, loading, error, handleCheckPhone };
// };
