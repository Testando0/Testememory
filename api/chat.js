export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Limpa a chave da Groq vinda das variáveis de ambiente
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
        model: "gemma2-9b-it", // Ajustado para o modelo solicitado
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error("Erro na Groq:", data);
        return res.status(response.status).json({ error: "offline" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro no Servidor:", error);
    return res.status(500).json({ error: "offline" });
  }
}
