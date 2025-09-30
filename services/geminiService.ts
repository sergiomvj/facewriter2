import { GoogleGenAI, Type } from "@google/genai";
import { GrammarSuggestion, TextModificationAction, ArticleGenerationParams, GeneratedArticle, SeoSuggestion, Language } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `You are FaceWriter Assistant, an expert writing copilot. 
Your goal is to help users create high-quality content. 
Be concise, helpful, and provide actionable suggestions. 
You can generate ideas, summarize text, rewrite paragraphs, check for facts, and optimize content for SEO. 
When asked to generate content, provide it directly without conversational fluff.`;

const grammarSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      original: { type: Type.STRING, description: 'The original text snippet with the error.' },
      suggestion: { type: Type.STRING, description: 'The corrected version of the text snippet.' },
      explanation: { type: Type.STRING, description: 'A brief explanation of the grammatical error and the correction.' },
    },
    required: ['original', 'suggestion', 'explanation'],
  },
};

const articleSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A compelling, SEO-friendly title for the article.' },
        content: { type: Type.STRING, description: 'The full content of the article, formatted in Markdown. It should include headings, paragraphs, and lists where appropriate.' }
    },
    required: ['title', 'content']
};

const seoSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        area: { type: Type.STRING, description: 'The area of SEO analysis (e.g., Title, Meta Description, Keyword Density, Readability, Internal Links).'},
        suggestion: { type: Type.STRING, description: 'A concrete suggestion for improvement.'},
        severity: { type: Type.STRING, description: 'The severity of the issue (high, medium, or low).'}
      },
      required: ['area', 'suggestion', 'severity'],
    },
};

export async function runGemini(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        return `Failed to get response from AI. Details: ${error.message}`;
    }
    return "An unexpected error occurred while contacting the AI service.";
  }
}


export async function checkGrammar(text: string): Promise<GrammarSuggestion[]> {
  try {
    const prompt = `Analyze the following text for grammatical errors, spelling mistakes, and style issues. Identify the original text with the error, provide a correction, and a brief explanation for each issue found. If no issues are found, return an empty array. Text to analyze: "${text}"`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: grammarSchema,
        },
    });
    const jsonText = response.text.trim();
    return jsonText ? JSON.parse(jsonText) : [];
  } catch (error) {
      console.error("Grammar Check API Error:", error);
      throw new Error(error instanceof Error ? `Failed to check grammar. Details: ${error.message}`: "An unexpected error occurred during grammar check.");
  }
}

export async function modifyText(text: string, action: TextModificationAction): Promise<string> {
    let prompt = '';
    switch (action) {
        case 'expand': prompt = `Expand the following text, making it more detailed and descriptive, while maintaining the original tone. Return only the expanded text:\n\n"${text}"`; break;
        case 'shorten': prompt = `Shorten the following text, making it more concise and to the point, while preserving the key message. Return only the shortened text:\n\n"${text}"`; break;
        case 'rewrite': prompt = `Rewrite the following text to improve its clarity, style, and engagement. Offer a fresh perspective without losing the core meaning. Return only the rewritten text:\n\n"${text}"`; break;
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { systemInstruction: SYSTEM_INSTRUCTION }
        });
        return response.text;
    } catch (error) {
        console.error(`Text Modification API Error (${action}):`, error);
        throw new Error(error instanceof Error ? `Failed to ${action} text. Details: ${error.message}`: `An unexpected error occurred during text ${action}.`);
    }
}

export async function generateArticle(params: ArticleGenerationParams): Promise<GeneratedArticle> {
    const { goal, audience, contentType, narrativeTune, keywords, language } = params;
    const prompt = `Generate a complete article in ${language} based on the following brief. The article must be well-structured, engaging, and written in Markdown format.\n\n**Language of Output:** ${language}\n**Content Type:** ${contentType}\n**Primary Goal:** ${goal}\n**Target Audience:** ${audience}\n**Narrative Tune:** ${narrativeTune}\n**Keywords to include:** ${keywords || 'none'}\n\nPlease generate a compelling title and a well-written article body that fulfills these requirements. The entire output, including the title and content, must be in ${language}.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: articleSchema
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Article Generation API Error:", error);
        throw new Error(error instanceof Error ? `Failed to generate article. Details: ${error.message}` : "An unexpected error occurred during article generation.");
    }
}

export async function generateSeoTitle(data: { goal: string; content: string }): Promise<string> {
  const prompt = `Based on the following article goal and content, generate a compelling and SEO-friendly title. The title should be concise, attention-grabbing, and relevant to the content. Return only the title, with no extra text or quotation marks.\n\n**Goal:** ${data.goal}\n\n**Content Snippet:**\n${data.content.substring(0, 500)}...`;
  try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { systemInstruction: "You are an expert SEO copywriter specializing in creating high-click-through-rate titles." }
      });
      return response.text.trim().replace(/^"|"$/g, ''); // Remove potential quotes
  } catch (error) {
      console.error("SEO Title Generation API Error:", error);
      throw new Error(error instanceof Error ? `Failed to generate SEO title. Details: ${error.message}` : "An unexpected error occurred during title generation.");
  }
}

export async function fetchTrends(query: string): Promise<string> {
  const prompt = `Provide a summary of the latest Google search trends related to "${query}". Include key topics, rising queries, and potential content angles. Format the response clearly with headings.`;
  try {
    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt,
       config: { tools: [{googleSearch: {}}] },
    });
    return response.text;
  } catch(error) {
    console.error("Trends Fetching API Error:", error);
    throw new Error(error instanceof Error ? `Failed to fetch trends. Details: ${error.message}` : "An unexpected error occurred while fetching trends.");
  }
}

export async function summarizeForImagePrompt(text: string): Promise<string> {
    const prompt = `Based on the following text, create a concise, visually descriptive prompt for an image generation AI. The prompt should capture the essence of the text in a single, powerful sentence, focusing on objects, atmosphere, and style. Text: "${text}"`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { systemInstruction: "You are a creative assistant that distills text into image prompts." }
        });
        return response.text;
    } catch (error) {
        console.error("Image Prompt Summary API Error:", error);
        throw new Error("Failed to create image prompt.");
    }
}

export async function generateImage(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `cinematic, high detail, professional photograph: ${prompt}`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '16:9'
            },
        });
        return response.generatedImages[0].image.imageBytes;
    } catch (error) {
        console.error("Image Generation API Error:", error);
        throw new Error(error instanceof Error ? `Failed to generate image. Details: ${error.message}`: "An unexpected error occurred during image generation.");
    }
}

export async function analyzeSeo(article: { title: string; content: string; goal: string; client: string; }): Promise<SeoSuggestion[]> {
    const prompt = `Analyze the following article for SEO best practices. Provide suggestions for improvement in these areas: Title, Meta Description, Keyword Usage (based on goal and content), Readability, and Internal/External Linking strategy. Article Title: "${article.title}". Article Goal: "${article.goal}". Content: "${article.content}"`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: seoSchema,
            },
        });
        const jsonText = response.text.trim();
        return jsonText ? JSON.parse(jsonText) : [];
    } catch (error) {
        console.error("SEO Analysis API Error:", error);
        throw new Error(error instanceof Error ? `Failed to analyze SEO. Details: ${error.message}`: "An unexpected error occurred during SEO analysis.");
    }
}

export async function generateImageDescription(imagePrompt: string): Promise<string> {
    const prompt = `Based on the following artistic image prompt, distill it into a short, concise description of 2-5 keywords suitable for searching on a stock photo website. Focus on the main subject and key attributes. Return only the keywords, separated by commas. Artistic prompt: "${imagePrompt}"`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { systemInstruction: "You are a helpful assistant that creates search queries for stock photo websites." }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Image Description Generation API Error:", error);
        throw new Error("Failed to generate image description.");
    }
}

export async function translateText(text: string, language: Language): Promise<string> {
    const prompt = `Translate the following text to ${language}. Provide only the translated text, without any introductory phrases, comments, or explanations. Preserve the original Markdown formatting.\n\nText to translate:\n"""\n${text}\n"""`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Translation API Error:", error);
        throw new Error(error instanceof Error ? `Failed to translate text. Details: ${error.message}`: "An unexpected error occurred during translation.");
    }
}