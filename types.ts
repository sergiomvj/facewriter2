export interface FileTreeNode {
  name: string;
  type: 'folder' | 'file';
  children?: FileTreeNode[];
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
}

export interface GrammarSuggestion {
  original: string;
  suggestion: string;
  explanation: string;
}

export type TextModificationAction = 'expand' | 'shorten' | 'rewrite';

export type ContentType = 'Blog Post' | 'Tutorial' | 'Press Release' | 'Product Description' | 'Newsletter';

export type NarrativeTune = 'Formal' | 'Casual' | 'Humorous' | 'Professional' | 'Inspirational' | 'Technical' | 'Empathetic';

export interface ArticleGenerationParams {
  goal: string;
  audience: string;
  contentType: ContentType;
  narrativeTune: NarrativeTune;
  keywords: string;
  language: Language;
}

export interface GeneratedArticle {
  title: string;
  content: string;
}

export type Destination = 'Article Blog' | 'Youtube Script' | 'Instagram Post' | 'Facebook Post' | 'X Post' | 'Linkedin Post';

export interface SeoSuggestion {
  area: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
}

export type ImageProvider = 'Unsplash' | 'Pixabay' | 'Pexels';

export type Language = 'English' | 'Portuguese' | 'Spanish';

export type LLMProvider = 'Gemini' | 'OpenAI' | 'Anthropic';

export interface AppSettings {
  llmProvider: LLMProvider;
  geminiApiKey: string;
  unsplashApiKey: string;
  imageProviders: ImageProvider[];
}

export type Theme = 'dark' | 'light';