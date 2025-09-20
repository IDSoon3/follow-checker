import { useState, useEffect } from "react";
import Head from "next/head";
import { sdk } from "@farcaster/miniapp-sdk";

export default function Home() {
  const [username, setUsername] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [selectedTab, setSelectedTab] = useState("theyDontFollowBack");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Mini App ready + auto login user
  useEffect(() => {
    sdk.actions.ready();

    async function fetchUser() {
      try {
        const res = await sdk.actions.signIn();
        console.log("SignIn response:", res);

        if (res?.user?.username) {
          setUsername(res.user.username);
        }
      } catch (err) {
        console.error("Farcaster login failed:", err);
      }
    }

    fetchUser();
  }, []);

  const fetchData = async () => {
    if (!username) return;
    setLoading(true);
    setError("");

    try {
      const [followersRes, followingRes] = await Promise.all([
        fetch(`/api/followers?username=${username}`),
        fetch(`/api/following?username=${username}`),
      ]);

      const followersData = await followersRes.json();
      const followingData = await followingRes.json();

      if (followersRes.ok && followingRes.ok) {
        setFollowers(followersData.users || []);
        setFollowing(followingData.users || []);
      } else {
        setError(
          followersData.error || followingData.error || "Failed to fetch data"
        );
      }
    } catch (err) {
      setError("Server error occurred");
    }

    setLoading(false);
  };

  const notFollowBack = following.filter(
    (u) => !followers.some((f) => f.fid === u.fid)
  );
  const theyDontFollowBack = followers.filter(
    (u) => !following.some((f) => f.fid === u.fid)
  );
  const mutuals = followers.filter((u) =>
    following.some((f) => f.fid === u.fid)
  );

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        background: darkMode ? "#111827" : "#ffffff",
        color: darkMode ? "#f9fafb" : "#111827",
        minHeight: "100vh",
      }}
    >
      <Head>
        <title>Farcaster Follow Checker</title>
        <meta
          name="description"
          content="Check who doesn’t follow back or who is mutual on Farcaster"
        />
        <meta property="og:title" content="Farcaster Follow Checker" />
        <meta
          property="og:description"
          content="Check who doesn’t follow back or who is mutual on Farcaster"
        />
        <meta property="og:image" content="/preview.png" />
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="/preview.png" />
        <meta name="fc:frame:button:1" content="Check Now" />
        <meta name="fc:frame:post_url" content="/api/check" />
      </Head>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#7c3aed",
            }}
          >
            Farcaster Follow Checker
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: "8px 12px",
              background: darkMode ? "#f9fafb" : "#111827",
              color: darkMode ? "#111827" : "#f9fafb",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div style={{ display: "flex", marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 14px",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              marginRight: 8,
              background: darkMode ? "#1f2937" : "#ffffff",
              color: darkMode ? "#f9fafb" : "#111827",
            }}
          />
          <button
            onClick={fetchData}
            style={{
              padding: "10px 16px",
              background: "#7c3aed",
              color: "#fff",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            Check
          </button>
        </div>

        {loading && <p>Loading data...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <TabButton
            label={`They Don’t Follow Back (${notFollowBack.length})`}
            active={selectedTab === "theyDontFollowBack"}
            onClick={() => setSelectedTab("theyDontFollowBack")}
            darkMode={darkMode}
          />
          <TabButton
            label={`You Don’t Follow Back (${theyDontFollowBack.length})`}
            active={selectedTab === "notFollowBack"}
            onClick={() => setSelectedTab("notFollowBack")}
            darkMode={darkMode}
          />
          <TabButton
            label={`Mutual (${mutuals.length})`}
            active={selectedTab === "mutual"}
            onClick={() => setSelectedTab("mutual")}
            darkMode={darkMode}
          />
        </div>

        {selectedTab === "theyDontFollowBack" && (
          <UserList
            users={notFollowBack}
            borderColor="#f43f5e"
            darkMode={darkMode}
          />
        )}
        {selectedTab === "notFollowBack" && (
          <UserList
            users={theyDontFollowBack}
            borderColor="#f59e0b"
            darkMode={darkMode}
          />
        )}
        {selectedTab === "mutual" && (
          <UserList users={mutuals} borderColor="#10b981" darkMode={darkMode} />
        )}
      </main>
    </div>
  );
}

function TabButton({ label, active, onClick, darkMode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "10px",
        background: active ? "#7c3aed" : darkMode ? "#1f2937" : "#f3f4f6",
        color: active ? "#fff" : darkMode ? "#f9fafb" : "#111827",
        borderRadius: 8,
        border: "1px solid #d1d5db",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function UserList({ users, borderColor, darkMode }) {
  if (!users || users.length === 0) {
    return (
      <p
        style={{
          color: darkMode ? "#9ca3af" : "#6b7280",
          marginLeft: 10,
        }}
      >
        No users found
      </p>
    );
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
      {users.map((u) => (
        <li
          key={u.fid}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            border: `2px solid ${borderColor}`,
            borderRadius: 10,
            padding: 12,
            background: darkMode ? "#1f2937" : "#f9fafb",
            color: darkMode ? "#f9fafb" : "#111827",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={u.pfp?.url || "/default-avatar.png"}
              alt={u.username}
              width={48}
              height={48}
              style={{ borderRadius: "50%", marginRight: 12 }}
            />
            <div>
              <strong>{u.displayName || u.username}</strong> @{u.username}
              <div
                style={{
                  fontSize: 13,
                  color: darkMode ? "#d1d5db" : "#374151",
                }}
              >
                Followers: {u.followerCount} | Following: {u.followingCount}
              </div>
            </div>
          </div>
          <a
            href={u.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "6px 10px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: "6px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Visit Profile
          </a>
        </li>
      ))}
    </ul>
  );
}
