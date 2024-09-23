// Your OpenAI API Key (Note: Avoid exposing this key in production)
const OPEN_API_KEY='sk-eoTUaS_gECDUdWEQMRmYIpJFpUqz0mW8sZ69O9ZgvpT3BlbkFJVX1Wlj9wYQoI1aA9e8g32qGwsaAAM5-PPwikjh2mQA'

// Function to fetch a random technical blog from Dev.to API
async function fetchTechBlog() {
  try {
    // Fetch a random blog from Dev.to (you can use other sources)
    let response = await fetch('https://dev.to/api/articles');
    let articles = await response.json();

    let randomArticle = articles[Math.floor(Math.random() * articles.length)];

    // Get the blog content (summary part)
    let blogContentResponse = await fetch(randomArticle.url);
    let blogContent = await blogContentResponse.text();

    // Send the blog content to OpenAI to summarize
    let summary = await summarizeWithOpenAI(blogContent);

    // Display the summarized blog in the extension's popup
    document.getElementById('content').innerHTML = `
      <h3>${randomArticle.title}</h3>
      <p>${summary}</p>
      <a href="${randomArticle.url}" target="_blank">Read Full Article</a>
    `;
  } catch (error) {
    document.getElementById('content').textContent = 'Error fetching or summarizing the blog.';
    console.error(error);
  }
}

async function summarizeWithOpenAI(content) {
    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPEN_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // You can change the model based on your needs
          prompt: `Summarize the following content: ${content}`,
          max_tokens: 150
        })
      });
  
      const data = await response.json();
  
      // Check if data and choices exist
      if (!data || !data.choices || data.choices.length === 0) {
        console.error('Invalid response from OpenAI:', data);
        return 'Failed to summarize the content. No valid choices returned.';
      }
  
      // Return the first summary
      return data.choices[0].text.trim();
    } catch (error) {
      console.error('Error summarizing the content:', error);
      return 'Failed to summarize the content due to an error.'+error;
    }
  }
  

// Fetch and summarize blog when the extension popup opens
fetchTechBlog();
