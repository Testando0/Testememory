// api/chat.js
export default async function handler(req, res) {
  // Apenas aceita requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  // Pega a chave das Variáveis de Ambiente do Vercel
  const apiKey = process.env.GROK_API_KEY;

  // Verifica se a chave existe
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'ERRO: A variável GROK_API_KEY não foi configurada no Vercel.' } });
  }

  try {
    const { messages, model, stream, temperature } = req.body;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages,
        model: model || "grok-beta",
        stream: stream || false,
        temperature: temperature || 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Se a API da xAI der erro, repassa o erro mantendo a estrutura
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Erro no servidor:", error);
    // Retorna erro formatado corretamente
    return res.status(500).json({ error: { message: `Erro interno do servidor: ${error.message}` } });
  }
}
