const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function enrichProduct(productName) {
  try {
    const prompt = `
Tu analyses un produit de supermarché et tu retournes uniquement un JSON valide.

Produit : "${productName}"

Retourne exactement :
{
  "category": "une catégorie principale parmi boissons, alimentation, entretien, snacks, hygiène, frais, surgelés, bébé, animaux, autre",
  "subcategory": "une sous-catégorie courte",
  "tags": ["tag1", "tag2", "tag3"],
  "unit_type": "litre | kg | unit | unknown",
  "health_flag": "healthy | neutral | ultra_processed | sugary | unknown"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Tu es un classificateur de produits. Tu réponds uniquement en JSON valide.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    const raw = response.choices[0].message.content.trim();
    return JSON.parse(raw);
  } catch (error) {
    console.error("PRODUCT ENRICHMENT ERROR:", error.message);

    return {
      category: "autre",
      subcategory: "unknown",
      tags: [],
      unit_type: "unknown",
      health_flag: "unknown",
    };
  }
}

module.exports = { enrichProduct };