import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini client for backend (uses GEMINI_API_KEY from env)
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenAI({ apiKey });
};

export interface PredictionResult {
  gender: 'Boy' | 'Girl' | 'Unclear';
  confidence: number;
  reasoning: string;
  tips: string[];
}

/**
 * Analyze ultrasound image using Gemini AI (backend only)
 * @param base64Image - Base64 encoded image string (without data:image/jpeg;base64, prefix)
 * @returns Prediction result with gender, confidence, reasoning, and tips
 */
export async function analyzeUltrasound(base64Image: string): Promise<PredictionResult> {
  try {
    const ai = getGeminiClient();
    const model = 'gemini-3-pro-preview'; // Vision model for image analysis

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: `You are an expert in the 'Nub Theory' of fetal gender prediction based on 12-week ultrasound scans.

            Analyze this ultrasound image carefully. Focus on the genital tubercle (the 'nub').
            - If the angle of the nub is greater than 30 degrees relative to the spine, it is typically predicted as a BOY.
            - If the nub is parallel to the spine or at an angle less than 10 degrees, it is typically predicted as a GIRL.
            - If the nub is not clearly visible, or you cannot determine the angle with reasonable confidence, return 'Unclear'.

            Provide a prediction, a percentage confidence score (be honest if the image is blurry or the nub is not visible), and a warm, friendly explanation suitable for an expectant mother. Also provide 2-3 short tips for getting a better scan next time if this one was unclear, or general pregnancy tips if it was clear.

            Return the result in JSON format.`
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gender: { type: Type.STRING, enum: ['Boy', 'Girl', 'Unclear'] },
            confidence: { type: Type.NUMBER, description: "Confidence percentage 0-100" },
            reasoning: { type: Type.STRING, description: "A warm, friendly explanation of the visual findings." },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['gender', 'confidence', 'reasoning', 'tips']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as PredictionResult;

  } catch (error) {
    console.error("Gemini AI analysis failed:", error);

    // Return unclear result on error - will trigger manual review
    return {
      gender: 'Unclear',
      confidence: 0,
      reasoning: "We couldn't process the image automatically. Our team will review it manually and send you the results within 2 hours.",
      tips: [
        "Ensure the image is not blurry",
        "Upload a direct side profile view",
        "12-14 week scans work best for Nub Theory"
      ]
    };
  }
}

/**
 * Convert image buffer to base64 string (helper function)
 * @param buffer - Image file buffer
 * @returns Base64 string without data URL prefix
 */
export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

/**
 * Convert base64 data URL to plain base64 string
 * @param dataUrl - Data URL (e.g., "data:image/jpeg;base64,/9j/4AAQ...")
 * @returns Plain base64 string
 */
export function extractBase64FromDataUrl(dataUrl: string): string {
  const matches = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
  return matches ? matches[1] : dataUrl;
}
