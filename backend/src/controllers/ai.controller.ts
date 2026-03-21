import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

// Fallback logic if OpenAI API isn't present
export const chat = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, context } = req.body;
    
    // Attempting to use OpenAI if key is present
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (apiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: `You are a helpful AI assistant for an LMS. Context: ${context || 'General query'}` },
            { role: 'user', content: message }
          ]
        })
      });
      
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        res.json({ reply: data.choices[0].message.content });
        return;
      }
    }

    // Fallback if no API key or failed request
    const mockReply = `(Mock AI) You asked: "${message}". Context: ${context}. To see real AI responses, add OPENAI_API_KEY to the .env file.`;
    res.json({ reply: mockReply });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
