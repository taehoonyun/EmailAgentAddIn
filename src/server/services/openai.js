const fetch = require('node-fetch');
const store = require('../config/store');

/**
 * Call OpenAI API to analyze text with GPT
 * @param {string} prompt - The prompt to send to OpenAI
 * @returns {Promise<string>} The generated response
 * @throws {Error} If API call fails
 */
async function analyzeText(prompt) {
  const apiKey = store.get('apiKey');
  
  if (!apiKey) {
    throw new Error('API key is not set. Please enter your API key in the settings page.');
  }
  
  // Call OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a professional email assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Error occurred during OpenAI API call.');
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

module.exports = {
  analyzeText
}; 