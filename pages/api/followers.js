import axios from "axios";

export default async function handler(req, res) {
  const { username } = req.query;
  const apiKey = "98606444-A94B-4C65-8C05-593F48DB94B5"; // API Key kamu

  if (!username) {
    return res.status(400).json({ error: "Username diperlukan" });
  }

  try {
    // 1. Cari user by username dulu
    const userRes = await axios.get(
      `https://api.neynar.com/v2/farcaster/user/by-username?username=${username}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    const fid = userRes.data.result.user.fid;

    // 2. Ambil daftar followers
    const followersRes = await axios.get(
      `https://api.neynar.com/v2/farcaster/user/followers?fid=${fid}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    const followers = followersRes.data.users.map(u => ({
      username: u.username
    }));

    res.status(200).json(followers);
  } catch (error) {
    console.error("Error followers:", error.response?.data || error.message);
    res.status(500).json({ error: "Gagal mengambil data followers" });
  }
}
