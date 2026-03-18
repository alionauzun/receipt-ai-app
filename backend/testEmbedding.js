require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function test() {

  try {

    console.log("🔄 Testing embedding...");

    const response = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: "yaourt grec"
    });

    console.log("✅ Embedding:");
    console.log(response.data[0].embedding);

  } catch (err) {
    console.error("❌ ERROR:");
    console.error(err);
  }

}

test();