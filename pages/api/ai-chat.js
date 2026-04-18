/**
 * AI智能客服 API - Ollama minimax-m2.7:cloud
 */
import { v4 as uuidv4 } from 'uuid';

const OLLAMA_URL = process.env.OLLAMA_URL || 'https://thermal-obtain-pressing-relates.trycloudflare.com';
const MODEL = process.env.AI_MODEL || 'qwen3-vl:8b';

// 内存存储对话
const conversations = {};

export default async function handler(req, res) {
  const { method } = req;
  
  if (method === 'POST') {
    const { message, conversationId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // 创建新对话ID
    const convId = conversationId || uuidv4();
    if (!conversations[convId]) {
      conversations[convId] = [];
    }
    
    // 添加用户消息到历史
    conversations[convId].push({ role: 'user', content: message });
    
    try {
      // 调用 Ollama API
      const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: conversations[convId],
          stream: false,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }
      
      const data = await response.json();
      const reply = data.message?.content || 'Sorry, I could not generate a response.';
      
      // 添加助手回复到历史
      conversations[convId].push({ role: 'assistant', content: reply });
      
      return res.status(200).json({ 
        reply, 
        conversationId: convId,
        history: conversations[convId]
      });
    } catch (error) {
      console.error('AI Chat Error:', error);
      
      // 回退到预设回复
      const fallbackReplies = [
        "Thank you for your inquiry. Our biomass pellet machines are high-quality and energy-efficient.",
        "For more details about our products, please visit our product page.",
        "We offer competitive prices and worldwide shipping. Contact us for a quote.",
        "Our technical team can provide professional solution recommendations."
      ];
      
      const reply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      conversations[convId].push({ role: 'assistant', content: reply });
      
      return res.status(200).json({ 
        reply, 
        conversationId: convId,
        history: conversations[convId],
        fallback: true,
        error: error.message
      });
    }
  }
  
  if (method === 'GET') {
    return res.status(200).json({ 
      status: 'ok',
      model: MODEL
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}