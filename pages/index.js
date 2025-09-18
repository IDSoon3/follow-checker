import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (type) => {
    if (!username) {
      setError("Masukkan username dulu!");
      return;
    }
    setLoading(true);
    setError("");
    setData([]);

    try {
      const res = await axios.get(`/api/${type}?username=${username}`);
      setData(res.data);
    } catch (err) {
      setError("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Follow Back Checker</h1>

      <input
        type="text"
        placeholder="Masukkan username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
      />

      <button onClick={() => fetchData("following")} style={{ marginRight: "8px" }}>
        Cek Following
      </button>
      <button onClick={() => fetchData("followers")}>Cek Followers</button>

      {loading && <p>Sedang mengambil data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {Array.isArray(data) &&
          data.map((item, i) => (
            <li key={i}>{item.username || JSON.stringify(item)}</li>
          ))}
      </ul>
    </div>
  );
}
