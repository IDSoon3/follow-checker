import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function useFarcasterLogin() {
  const [fid, setFid] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function init() {
      try {
        await sdk.actions.ready();
        const user = await sdk.wallet.getUser();
        if (user) {
          setFid(user.fid);
          setUsername(user.username || "");
        }
      } catch (e) {
        console.warn("Farcaster login failed, fallback to manual input.");
      }
    }
    init();
  }, []);

  return { fid, username, setUsername };
}
