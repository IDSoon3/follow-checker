import { useState, useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function useFarcasterLogin() {
  const [isReady, setIsReady] = useState(false);
  const [fid, setFid] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const user = await sdk.context.getUser();
        if (user) {
          setFid(user.fid);
          setUserData(user);
        }
      } catch (err) {
        console.error("Farcaster login failed:", err);
      } finally {
        setIsReady(true);
      }
    }
    init();
  }, []);

  return { isReady, fid, userData };
}
