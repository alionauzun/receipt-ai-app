//ce fichier contient la logique pour créer des embeddings à partir de texte en utilisant l'API OpenAI. Il exporte une fonction createEmbedding qui prend du texte en entrée et retourne l'embedding correspondant.Embeddings sont des représentations vectorielles de texte qui permettent de mesurer la similarité entre différents textes. Ils sont utilisés pour des tâches comme la recherche de produits similaires, la classification, etc.
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function createEmbedding(text) {

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });

  return response.data[0].embedding;

}

module.exports = { createEmbedding };