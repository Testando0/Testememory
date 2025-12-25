export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.GROK_API_KEY ? process.env.GROK_API_KEY.trim() : null;

  try {
    const { messages } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gemma2-9b-it",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();
    
    // Se a Groq responder com erro, enviamos o seu erro padrão
    if (!response.ok) {
        console.error("Erro Groq:", data);
        return res.status(response.status).json({ error: "offline" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro Servidor:", error);
    return res.status(500).json({ error: "offline" });
  }
}
