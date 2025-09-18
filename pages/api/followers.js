// pages/api/followers.js
export default async function handler(req, res) {
  const apiKey = process.env.API_KEY; // API Key dari Vercel/GitHub Environment
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username diperlukan" });
  }

  try {
    // 🔹 Step 1: Ambil user info dari username
    const userRes = await fetch(`https://api.farcaster.xyz/v1/users?username=${username}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const userData = await userRes.json();

    if (!userRes.ok || !userData.users || userData.users.length === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    const fid = userData.users[0].fid; // ambil FID user

    // 🔹 Step 2: Ambil followers user berdasarkan FID
    const followersRes = await fetch(`https://api.farcaster.xyz/v1/user-followers?fid=${fid}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const followersData = await followersRes.json();

    if (!followersRes.ok) {
      return res.status(500).json({ error: "Gagal mengambil followers", detail: followersData });
    }

    return res.status(200).json(followersData);
  } catch (error) {
    console.error("Error followers:", error.message);
    return res.status(500).json({ error: "Gagal mengambil data followers" });
  }
}
