require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateAIInsights(data) {

  const prompt = `
Tu es un assistant financier intelligent.

Voici les données utilisateur :

${JSON.stringify(data, null, 2)}

Analyse :
- les dépenses
- les habitudes
- les produits fréquents

Donne 3 conseils :
- économies
- santé
- optimisation

Réponse courte, claire, en français.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Tu es un coach financier et consommation." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  });

  return response.choices[0].message.content;
}

module.exports = { generateAIInsights };