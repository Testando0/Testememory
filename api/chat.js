export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Garante que a chave API esteja limpa e disponível
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
        model: "gemma2-9b-it", // Modelo do Google otimizado
        messages: messages,
        temperature: 0.8,      // Melhora a fluidez da fala
        max_tokens: 2048
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error("Erro da Groq:", data);
        return res.status(response.status).json({ error: "offline" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no servidor:", error);
    return res.status(500).json({ error: "offline" });
  }
}
