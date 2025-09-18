import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("idsoon");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [tab, setTab] = useState("not-follow-back");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [resFollowers, resFollowing] = await Promise.all([
        fetch(`/api/followers?username=${username}`),
        fetch(`/api/following?username=${username}`),
      ]);

      const dataFollowers = await resFollowers.json();
      const dataFollowing = await resFollowing.json();

      if (!resFollowers.ok) throw new Error(dataFollowers.error || "Failed to fetch followers");
      if (!resFollowing.ok) throw new Error(dataFollowing.error || "Failed to fetch following");

      setFollowers(dataFollowers.users || []);
      setFollowing(dataFollowing.users || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const classify = () => {
    const followersSet = new Set(followers.map((u) => u.username));
    const followingSet = new Set(following.map((u) => u.username));

    const theyFollowButYouDont = followers.filter((u) => !followingSet.has(u.username));
    const youFollowButTheyDont = following.filter((u) => !followersSet.has(u.username));
    const mutual = following.filter((u) => followersSet.has(u.username));

    return { theyFollowButYouDont, youFollowButTheyDont, mutual };
  };

  const { theyFollowButYouDont, youFollowButTheyDont, mutual } = classify();

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: 20,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f2fe, #ede9fe)", // soft gradient
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: 20, color: "#111827" }}>
          🌐 Farcaster Follow Checker
        </h1>

        {/* Input Section */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Farcaster username"
            style={{
              flex: 1,
              padding: 10,
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              marginRight: 10,
              background: "#f9fafb",
              color: "#111827",
            }}
          />
          <button
            onClick={fetchData}
            style={{
              padding: "10px 16px",
              background: "#4F46E5",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Check
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <button
            onClick={() => setTab("not-follow-back")}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              background: tab === "not-follow-back" ? "#502a4bff" : "#502a4bff",
              color: "#111827",
            }}
          >
            Not Follow Back
          </button>
          <button
            onClick={() => setTab("mutual")}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              background: tab === "mutual" ? "#5a3e63ff" : "#5a3e63ff",
              color: "#111827",
            }}
          >
            Mutual
          </button>
        </div>

        {/* Error & Loading */}
        {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {/* Content */}
        {tab === "not-follow-back" && (
          <div>
            <h3 style={{ color: "#d97706" }}>🟡 They follow you, but you don’t follow back:</h3>
            <UserList users={theyFollowButYouDont} borderColor="#fbbf24" />

            <h3 style={{ color: "#b91c1c", marginTop: 20 }}>
              🔴 You follow them, but they don’t follow back:
            </h3>
            <UserList users={youFollowButTheyDont} borderColor="#f87171" />
          </div>
        )}

        {tab === "mutual" && (
          <div>
            <h3 style={{ color: "#059669" }}>🟢 Mutual Follows:</h3>
            <UserList users={mutual} borderColor="#34d399" />
          </div>
        )}
      </div>
    </div>
  );
}

function UserList({ users, borderColor }) {
  if (!users || users.length === 0) {
    return <p style={{ color: "#6b7280", marginLeft: 10 }}>No users found</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
      {users.map((u) => (
        <li
          key={u.fid}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 12,
            border: `2px solid ${borderColor}`,
            borderRadius: 10,
            padding: 12,
            background: "#9da2a7ff", // softer than white
            color: "#111827",
            boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          }}
        >
          <img
            src={u.pfp?.url || "/default-avatar.png"}
            alt={u.username}
            width={48}
            height={48}
            style={{ borderRadius: "50%", marginRight: 12 }}
          />
          <div>
            <strong>{u.displayName || u.username}</strong> @{u.username}
            <div style={{ fontSize: 13, color: "#374151" }}>
              Followers: {u.followerCount} | Following: {u.followingCount}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
