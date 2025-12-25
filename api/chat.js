export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Garante que a chave da API esteja limpa
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
        max_tokens: 2048, // Aumentado para suportar respostas maiores sem cortar
        top_p: 1,
        stream: false
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error("Erro na API Groq:", data);
        return res.status(response.status).json({ error: "offline" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro de conexão no servidor:", error);
    return res.status(500).json({ error: "offline" });
  }
}
