import express from 'express';
import path from 'path';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

// Lazy initialize AI client to avoid crashing on startup if key is missing
let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Assistant API
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message } = req.body;
      const aiClient = getAI();
      
      const chat = aiClient.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: `你是一个中国移动政企业务运维支撑系统的智能助手（政企项目）。
你的目标是帮助运维人员快速定位问题、查询业务信息。
当前系统包含以下功能模块：
1. IMS固话查询：查询固话业务状态和配置。
2. 团单管理：管理集团订单和交付任务。
3. 投诉支撑：处理客户投诉，提供故障诊断。
4. 质差远程处置：针对网络质差执行远程设备操作（如重启）。

你可以回答关于这些业务的问题，提供操作建议。请用专业、简洁、且有帮助的中文回答。`,
        },
      });

      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Catch-all for SPA. In Express 5 use *all for better matching
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in ${isProduction ? 'production' : 'development'} mode on port ${PORT}`);
  });
}

startServer();
