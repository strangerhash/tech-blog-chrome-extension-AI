const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function summarizeBlog(blogContent) {
  const response = await openai.createCompletion({
    model: "text-davinci-004",
    prompt: `Summarize the following blog: ${blogContent}`,
    max_tokens: 150,
  });
  return response.data.choices[0].text.trim();
}
