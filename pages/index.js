import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [username, setUsername] = useState("idsoon"); // default isi farcaster kamu
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [notFollowBack, setNotFollowBack] = useState([]);
  const [youDontFollowBack, setYouDontFollowBack] = useState([]);

  const checkFollow = async () => {
    try {
      const followersRes = await axios.get(`/api/followers?username=${username}`);
      const followingRes = await axios.get(`/api/following?username=${username}`);

      const followersList = followersRes.data.map(f => f.username);
      const followingList = followingRes.data.map(f => f.username);

      setFollowers(followersList);
      setFollowing(followingList);

      // orang yang kamu follow tapi ga follow balik
      const notFollowBackList = followingList.filter(u => !followersList.includes(u));
      setNotFollowBack(notFollowBackList);

      // orang yang follow kamu tapi ga kamu follow balik
      const youDontFollowBackList = followersList.filter(u => !followingList.includes(u));
      setYouDontFollowBack(youDontFollowBackList);

    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Follow Back Checker</h1>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Masukkan username"
        style={{ marginRight: "1rem" }}
      />
      <button onClick={checkFollow}>Cek</button>

      <h2>Yang kamu follow tapi tidak follow balik:</h2>
      <ul>
        {notFollowBack.map(u => <li key={u}>{u}</li>)}
      </ul>

      <h2>Yang follow kamu tapi tidak kamu follow balik:</h2>
      <ul>
        {youDontFollowBack.map(u => <li key={u}>{u}</li>)}
      </ul>
    </div>
  );
}
