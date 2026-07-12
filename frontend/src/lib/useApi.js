import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { api, attachAuthInterceptor } from "./api.js";

// Wires the Clerk session token into every axios request, exactly once.
export const useApi = () => {
  const { getToken } = useAuth();
  const attached = useRef(false);

  useEffect(() => {
    if (!attached.current) {
      attachAuthInterceptor(getToken);
      attached.current = true;
    }
  }, [getToken]);

  return api;
};
