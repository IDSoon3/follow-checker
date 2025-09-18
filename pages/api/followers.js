// pages/api/followers.js
export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username diperlukan" });
  }

  try {
    const apiKey = process.env.API_KEY || "98606444-A94B-4C65-8C05-593F48DB94B5";

    // 1. Ambil FID dari username
    const userRes = await fetch(
      `https://api.warpcast.com/v2/user-by-username?username=${username}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    const userData = await userRes.json();

    if (!userRes.ok || !userData.result?.user) {
      return res.status(404).json({ error: "User tidak ditemukan", raw: userData });
    }

    const fid = userData.result.user.fid;

    // 2. Ambil followers (endpoint baru)
    const followersRes = await fetch(
      `https://api.warpcast.com/v2/followers?fid=${fid}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    const followersData = await followersRes.json();

    if (!followersRes.ok) {
      return res
        .status(followersRes.status)
        .json({ error: followersData.message || "Gagal ambil followers", raw: followersData });
    }

    return res.status(200).json({ users: followersData.result.users });
  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
}
