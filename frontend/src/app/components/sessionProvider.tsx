"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SessionContext = createContext<string | null>(null);

export function useSession() {
  return useContext(SessionContext);
}

export default function SessionProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: string | undefined;
}) {
  const [session, setSession] = useState<string | null>(initialSession || null);

  useEffect(() => {
    if (!session) {
      fetch("/api/set-session")
        .then((res) => res.json())
        .then(() => {
          // Vi sätter inte session-token här eftersom den är httpOnly
          // Istället kan vi sätta en state som indikerar att sessionen är skapad
          setSession("created");
        });
    }
  }, [session]);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
