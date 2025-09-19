// pages/api/frame.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    // Contoh response frame Farcaster
    return res.status(200).json({
      type: "frame",
      title: "Follow Checker",
      imageUrl: "https://follow-checker.vercel.app/image.png",
      buttons: [
        {
          label: "Check Follows",
          action: {
            type: "launch",
            url: "https://follow-checker.vercel.app/",
          },
        },
      ],
    });
  } catch (err) {
    console.error("Frame error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
