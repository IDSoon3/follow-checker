// pages/api/followers.js
import axios from "axios";

export default async function handler(req, res) {
  const { username } = req.query;
  const apiKey = process.env.API_KEY;


  if (!username) {
    return res.status(400).json({ error: "Username diperlukan" });
  }

  try {
    // Ganti dengan API nyata sesuai platform yang mau kamu cek
    const response = await axios.get(`https://api.example.com/${username}/followers`);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Gagal mengambil data followers" });
  }
}
