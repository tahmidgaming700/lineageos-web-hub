import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const assistantRouter = Router();

assistantRouter.post('/', async (req: Request, res: Response) => {
  const { prompt, context } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt parameter' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({
      reply: 'ROM Assistant is available in offline reference mode. Check the Installation Guides and Device Wiki links for verified instructions.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are ROM Assistant, a senior Android engineer and firmware expert for LineageOS Web Hub.
You assist users with understanding Android custom ROMs, LineageOS official builds, Generic System Images (GSI), recovery environments (TWRP, OrangeFox, Lineage Recovery), and flashing safety.
Critical rules:
1. NEVER invent or fabricate nonexistent firmware version strings, download URLs, or checksums.
2. Architecture matching (e.g., ARM64 CPU) does NOT guarantee that a GSI will boot without vendor interface (HAL/VNDK) support.
3. Warn users that bootloader unlocking wipes all userdata and that flashing the wrong partition can brick their device.
4. If a user asks how to flash a GSI, emphasize using "fastbootd" (fastboot reboot fastboot) for devices with Dynamic Partitions, not bootloader fastboot.
5. Provide clear, step-by-step, actionable advice.`;

    const userMessage = `${context ? `Device/Context metadata:\n${context}\n\n` : ''}User Question: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const reply = response.text || 'No response generated.';
    res.json({ reply });
  } catch (err: any) {
    console.warn('Gemini Assistant fallback error:', err);
    res.json({
      reply: 'Unable to reach the assistant service at this moment. Please consult the LineageOS Wiki (wiki.lineageos.org) and device community forums for guidance.',
    });
  }
});
