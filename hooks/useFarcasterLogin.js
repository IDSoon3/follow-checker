import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function useFarcasterUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        // Mark app as ready (fix splash screen stuck issue)
        sdk.actions.ready();

        // Get connected Farcaster user
        const res = await sdk.actions.signIn();
        if (res?.fid) {
          setUser(res);
        }
      } catch (err) {
        console.error("Farcaster login error:", err);
      }
    }

    init();
  }, []);

  return user;
}
