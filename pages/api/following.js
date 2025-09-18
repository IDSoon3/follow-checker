// pages/api/following.js
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

    // 2. Ambil following (endpoint baru)
    const followingRes = await fetch(
      `https://api.warpcast.com/v2/following?fid=${fid}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    const followingData = await followingRes.json();

    if (!followingRes.ok) {
      return res
        .status(followingRes.status)
        .json({ error: followingData.message || "Gagal ambil following", raw: followingData });
    }

    return res.status(200).json({ users: followingData.result.users });
  } catch (err) {
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
}
