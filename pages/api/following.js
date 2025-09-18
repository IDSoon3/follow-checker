export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username diperlukan" });
  }

  try {
    // 1. Ambil FID dari username
    const userRes = await fetch(`https://api.warpcast.com/v2/user-by-username?username=${username}`);
    const userData = await userRes.json();
    if (!userRes.ok || !userData.result?.user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }
    const fid = userData.result.user.fid;

    // 2. Ambil following list
    const followingRes = await fetch(`https://api.warpcast.com/v2/following?fid=${fid}&limit=100`);
    const followingData = await followingRes.json();

    if (!followingRes.ok) {
      return res.status(500).json({ error: "Gagal mengambil data following" });
    }

    // 3. Ringkas data
    const users = (followingData.result?.users || []).map((u) => ({
      fid: u.fid,
      username: u.username,
      displayName: u.displayName,
      pfp: u.pfp,
      followerCount: u.followerCount,
      followingCount: u.followingCount,
      profileUrl: `https://warpcast.com/${u.username}`,
    }));

    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
