// Ce fichier prend les données résumées et demande à l’IA de générer :

// conseils économies
// conseils consommation
// observations utiles

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAdvancedInsights(analysis) {
  try {
    const prompt = `
Tu es un assistant intelligent qui analyse les habitudes de consommation d’un utilisateur.

Voici les données utilisateur :
${JSON.stringify(analysis, null, 2)}

Ta mission :
1. Identifier les catégories où l'utilisateur dépense le plus
2. Identifier les produits les plus fréquents
3. Repérer des opportunités d’économies
4. Donner des conseils simples et utiles

Réponds en français.
Retourne exactement un JSON avec cette structure :
{
  "summary": "résumé global",
  "insights": [
    "insight 1",
    "insight 2",
    "insight 3"
  ],
  "recommendations": [
    "recommandation 1",
    "recommandation 2",
    "recommandation 3"
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Tu es un analyste financier et consommation. Tu réponds uniquement en JSON valide.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const raw = response.choices[0].message.content.trim();

    return JSON.parse(raw);
  } catch (error) {
    console.error("AI INSIGHT ERROR:", error.message);

    return {
      summary: "Impossible de générer les insights avancés pour le moment.",
      insights: [],
      recommendations: [],
    };
  }
}

module.exports = { generateAdvancedInsights };