import { HttpAgent, Identity } from "@dfinity/agent";
import { ReactNode, createContext, useEffect, useState } from "react";

import { AuthClient } from "@dfinity/auth-client";
import { AuthContextType } from "../types/auth-context.type";
import { createAgent } from "@dfinity/utils";

// Identity provider URL
const IDENTITY_PROVIDER = `${import.meta.env.VITE_IC_HOST}/?canisterId=${
  import.meta.env.VITE_CANISTER_ID_II
}#authorize`;

// Create a context for authentication
export const AuthContext = createContext<Partial<AuthContextType>>({});

// AuthProvider component that provides authentication functionality to its children
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // State variables
  const [authClient, setAuthClient] = useState<AuthClient | undefined>();
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);
  const [agent, setAgent] = useState<HttpAgent | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
    undefined
  );
  const [hasLoggedIn, setHasLoggedIn] = useState<boolean>(false);

  // Initialize the auth client on component mount
  useEffect(() => {
    AuthClient.create({
      idleOptions: {
        disableDefaultIdleCallback: true,
        disableIdle: true,
      },
    }).then(async (client) => {
      const isAuthenticated = await client.isAuthenticated();
      setAuthClient(client);
      setIsAuthenticated(isAuthenticated);
    });
  }, []);

  // Function to handle login
  const login = () => {
    if (!authClient) return;
    authClient.login({
      identityProvider: IDENTITY_PROVIDER,
      onSuccess: async () => {
        // Save the identity
        const identity = authClient.getIdentity();
        setIdentity(identity);

        // Create an agent
        const agent = await createAgent({
          identity,
          host: import.meta.env.VITE_IC_HOST,
        });
        if (import.meta.env.MODE === "development") {
          await agent.fetchRootKey();
        }
        setAgent(agent);

        setIsAuthenticated(true);
        setHasLoggedIn(true);
      },
    });
  };

  // Function to handle logout
  const logout = () => {
    authClient?.logout();
    // setActor(undefined);
    setIdentity(undefined);
    setIsAuthenticated(false);
  };

  // Provide the auth context to children
  return (
    <AuthContext.Provider
      value={{
        authClient,
        identity,
        agent,
        isAuthenticated,
        hasLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
