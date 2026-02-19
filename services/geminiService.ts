import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, GenerationResponse } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRecipesFromIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  if (ingredients.length === 0) return [];

  const modelId = "gemini-3-flash-preview";
  
  const prompt = `
    Sen uzman bir Türk şefisin.
    
    KULLANICININ ELİNDEKİ MALZEMELER: ${ingredients.join(', ')}

    GÖREVİN:
    Bu malzemeleri kullanarak yapülabilecek EN AZ 10 (ON) ADET tarif önerisi sun.
    
    ÖNEMLİ KURAL - DAĞILIM ŞU ŞEKİLDE OLMALI:
    1. En az 3 adet "Çorba" veya "Başlangıç".
    2. En az 3 adet "Ana Yemek".
    3. En az 3 adet "Tatlı".
    4. Geri kalanı "Salata", "Ara Sıcak" veya "Hamur İşi" olabilir.
    
    Toplamda 10-12 arası tarif üretmelisin.

    KURALLAR:
    - Kaynak olarak "Nefis Yemek Tarifleri", "Yemek.com" gibi popüler siteleri referans al.
    - Asla URL (link) üretme.
    - Tarifler Türk damak tadına uygun olsun.
    - Kullanıcının elinde olmayan ana malzemeleri 'missingIngredients' alanında belirt.

    ÇIKTI FORMATI (JSON):
    - title: Yemeğin adı.
    - description: Kısa açıklama.
    - ingredients: Tüm malzemeler.
    - missingIngredients: Eksik malzemeler.
    - instructions: Yapılış adımları.
    - prepTime: Süre.
    - difficulty: Zorluk.
    - calories: Kalori.
    - sourceName: Kaynak site adı.
    - recipeCategory: Tam olarak şu değerlerden biri olmalı: "Başlangıç & Çorba", "Ana Yemek", "Tatlı", "Diğer".
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  ingredients: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  missingIngredients: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  instructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  prepTime: { type: Type.STRING },
                  difficulty: { type: Type.STRING, enum: ['Kolay', 'Orta', 'Zor'] },
                  calories: { type: Type.STRING },
                  sourceName: { type: Type.STRING },
                  recipeCategory: { type: Type.STRING, enum: ["Başlangıç & Çorba", "Ana Yemek", "Tatlı", "Diğer"] }
                },
                required: ['title', 'description', 'ingredients', 'missingIngredients', 'instructions', 'prepTime', 'difficulty', 'sourceName', 'recipeCategory']
              }
            }
          }
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("No response from Gemini");
    }

    const parsedData = JSON.parse(textResponse) as GenerationResponse;
    
    return parsedData.recipes.map((r, index) => ({
      ...r,
      id: r.id || `recipe-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw error;
  }
};