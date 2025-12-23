// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Método não permitido' } });
  }

  // Pega a chave e remove qualquer espaço acidental que o Vercel possa ter incluído
  const apiKey = process.env.GROK_API_KEY ? process.env.GROK_API_KEY.trim() : null;

  if (!apiKey) {
    return res.status(500).json({ error: { message: 'Variável GROK_API_KEY não encontrada no Vercel.' } });
  }

  try {
    const { messages, temperature } = req.body;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}` // O erro "Incorrect API key" costuma ser aqui
      },
      body: JSON.stringify({
        // Trocando para 'grok-2' que é o modelo estável atual
        model: "grok-2", 
        messages: messages,
        temperature: temperature || 0.7,
        stream: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Se a xAI retornar erro, enviamos o detalhe real para o seu chat
      return res.status(response.status).json({ 
        error: { 
          message: data.error?.message || `Erro da xAI: ${response.statusText}` 
        } 
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: { message: `Falha no Servidor: ${error.message}` } });
  }
}
