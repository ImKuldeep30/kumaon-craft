// AI Chatbot controller connecting to Google Gemini API
// Fallback logic provides instant testing when no API key is specified

export const getAIChatResponse = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content is required',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if real Gemini API Key is configured in environment
    if (apiKey && apiKey !== 'your_gemini_api_key_here' && !apiKey.startsWith('mock_')) {
      // Map chat history to Gemini formats
      const contents = [];
      if (history && Array.isArray(history)) {
        history.forEach((chat) => {
          // Verify format matches user/model requirements
          contents.push({
            role: chat.role === 'ai' ? 'model' : 'user',
            parts: [{ text: chat.content }],
          });
        });
      }

      // Add user message clearly without prepending instructions
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      // Call Google Gemini API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `You are Kumaon Craft Connect AI Assistant, a friendly concierge for Kumaon Craft Connect. Answer questions about crafts, heritage, pricing, shipping, and dashboard usage. Keep responses extremely concise and to-the-point (under 2-3 sentences max). Do not use introductory fluff or wordy explanations.`
              }
            ]
          },
          contents,
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
          },
        }),
      });

      const result = await response.json();

      if (response.ok && result.candidates?.[0]?.content?.parts?.[0]?.text) {
        const textResponse = result.candidates[0].content.parts[0].text.trim();
        return res.status(200).json({
          success: true,
          reply: textResponse,
        });
      } else {
        const errorMsg = result.error?.message || 'Error communicating with Google Gemini API';
        console.error('Gemini API Error:', errorMsg);
        return res.status(502).json({
          success: false,
          message: `Gemini API Error: ${errorMsg}`,
        });
      }
    } else {
      // Fail-safe developer fallback mode
      const query = message.toLowerCase();
      let reply = '';

      if (query.includes('copper') || query.includes('jug') || query.includes('tamta')) {
        reply = 'Traditional Almora Tamta copperware is entirely hand-hammered. For bulk orders, the lead time is typically 2-3 weeks depending on quantity. Minimum order is 20 units.';
      } else if (query.includes('fabric') || query.includes('wool') || query.includes('tweed') || query.includes('shawl')) {
        reply = 'Our woolen tweed fabrics are hand-spun and woven by weavers in Munsyari and Almora. Colored with organic dyes, the fabric minimum order is 15 meters at ₹2,400 per meter.';
      } else if (query.includes('aipan') || query.includes('painting') || query.includes('art')) {
        reply = 'Aipan is a traditional ritualistic art from Kumaon, painted on red-clay bases using white rice paste. Our panels and chowkis are painted by Nainital women artisans. Custom designs are accepted.';
      } else if (query.includes('shipping') || query.includes('delivery') || query.includes('logistics')) {
        reply = 'We handle secure packaging and shipping across India and internationally. Shipping rates are calculated based on bulk package dimensions and destination upon quote approval.';
      } else if (query.includes('register') || query.includes('login') || query.includes('account') || query.includes('signup')) {
        reply = 'Registering is simple! Choose "Wholesale Buyer" to browse and request quotes, or "Artisan / Guild" if you are a seller to publish craft items and manage incoming inquiries.';
      } else if (query.includes('inquiry') || query.includes('quote') || query.includes('dashboard')) {
        reply = 'Artisans can view wholesale inquiries in real-time on the Dashboard table. You can update inquiry statuses to "Quote Sent" or "In Discussion" to start negotiations.';
      } else {
        reply = 'Greetings! I am the Kumaon Craft Connect Assistant. I can help you learn more about our heritage crafts (Copperware, Handloom, Aipan, and Woodcraft), order custom items, and navigate the platform. What details can I provide for you today?';
      }

      // Simulate a small network delay for realistic user loading state feedback
      await new Promise((resolve) => setTimeout(resolve, 800));

      return res.status(200).json({
        success: true,
        reply,
        note: 'Simulated response (Configure GEMINI_API_KEY in backend/.env for live AI queries)',
      });
    }
  } catch (error) {
    console.error('Chat API Handler Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error occurred in chatbot handler: ' + error.message,
    });
  }
};
