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
        // Atualizado para o modelo Gemma 2 do Google
        model: "gemma2-9b-it", 
        messages: messages,
        // 0.8 dá um toque extra de naturalidade e criatividade
        temperature: 0.8 
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error("Erro na API Groq:", data);
        return res.status(response.status).json({ error: "offline" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no Servidor:", error);
    return res.status(500).json({ error: "offline" });
  }
}
