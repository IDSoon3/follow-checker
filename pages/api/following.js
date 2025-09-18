// pages/api/following.js
import axios from "axios";

export default async function handler(req, res) {
  const { username } = req.query;
  const apiKey = process.env.API_KEY;


  if (!username) {
    return res.status(400).json({ error: "Username diperlukan" });
  }

  try {
    // Contoh: ambil data dari API Farcaster / Twitter dsb
    const response = await axios.get(`https://api.example.com/${username}/following`);

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
}
