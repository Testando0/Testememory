// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Método não permitido' } });
  }

  // Pegando a chave do Groq (Llama)
  const apiKey = process.env.GROK_API_KEY ? process.env.GROK_API_KEY.trim() : null;

  if (!apiKey) {
    return res.status(500).json({ error: { message: 'Variável GROK_API_KEY não configurada no Vercel.' } });
  }

  try {
    const { messages, temperature } = req.body;

    // URL da Groq para usar o modelo Llama 3
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // O modelo Llama mais potente e gratuito
        messages: messages,
        temperature: temperature || 0.7,
        stream: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: { 
          message: data.error?.message || `Erro na Groq: ${response.statusText}` 
        } 
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: { message: `Falha no Servidor: ${error.message}` } });
  }
}
