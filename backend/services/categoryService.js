const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const allowedCategories = [
  "boissons",
  "vesselerie",
  "utensiles",
  "meubles",
  "décoration",
  "électronique",
  "informatique",
  "gaming",
  "jouets",
  "livres",
  "papeterie",
  "cosmétiques",
  "parfums",
  "soins",
  "santé",
  "bien-être",
  "jardinage",
  "bricolage",
  "outillage",
  "automobile",
  "bicyclette",
  "moto",
  "sports",
  "loisirs",
  "musique",
  "films",
  "jeux vidéo",
  "vêtements",
  "chaussures",
  "accessoires",
  "alimentation",
  "entretien",
  "snacks",
  "hygiène",
  "legumes",
  "fruits",
  "frais",
  "poissonnerie",
  "boucherie",
  "boulangerie",
  "charcuterie",
  "fromagerie",
  "pâtisserie",
  "produits laitiers",
  "glaces",
  "plats préparés",
  "sauces",
  "épicerie",
  "fruits secs",
  "huile",
  "pâtes",
  "riz",
  "conserves",
  "viennoisserie",
  "alcools",
  "confiserie",
  "surgelés",
  "bébé",
  "animaux",
  "autre",
];

async function classifyCategory(productName) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Tu classes les produits de supermarché dans une seule catégorie. Réponds avec un seul mot parmi : boissons, alimentation, entretien, snacks, hygiène, frais, surgelés, bébé, animaux, autre.",
        },
        {
          role: "user",
          content: `Produit : ${productName}`,
        },
      ],
      temperature: 0,
    });

    const category = response.choices[0].message.content
      .trim()
      .toLowerCase();

    if (!allowedCategories.includes(category)) {
      return "autre";
    }

    return category;
  } catch (error) {
    console.error("CATEGORY AI ERROR:", error.message);
    return "autre";
  }
}

module.exports = { classifyCategory };