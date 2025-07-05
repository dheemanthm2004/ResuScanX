const axios = require('axios');

class AIProviders {
  constructor() {
    this.providers = [
      { name: 'Gemini-1', key: process.env.GEMINI_API_KEY, type: 'gemini' },
      { name: 'Gemini-2', key: process.env.GEMINI_API_KEY_new, type: 'gemini' },
      { name: 'Mistral', key: process.env.MISTRAL_API_KEY, type: 'mistral' },
      { name: 'Cohere', key: process.env.COHERE_API_KEY, type: 'cohere' },
      { name: 'OpenRouter', key: process.env.OPEN_ROUTER_API_KEY, type: 'openrouter' }
    ];
    this.currentIndex = 0;
  }

  getNext() {
    if (this.currentIndex >= this.providers.length) return null;
    return this.providers[this.currentIndex++];
  }

  reset() {
    this.currentIndex = 0;
  }

  async callGemini(prompt, apiKey) {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' }, timeout: 20000 }
    );
    return response.data.candidates[0].content.parts[0].text;
  }

  async callMistral(prompt, apiKey) {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3
      },
      {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 20000
      }
    );
    return response.data.choices[0].message.content;
  }

  async callCohere(prompt, apiKey) {
    const response = await axios.post(
      'https://api.cohere.ai/v1/generate',
      {
        model: 'command-light',
        prompt: prompt,
        max_tokens: 800,
        temperature: 0.3
      },
      {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 20000
      }
    );
    return response.data.generations[0].text;
  }

  async callOpenRouter(prompt, apiKey) {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3
      },
      {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 20000
      }
    );
    return response.data.choices[0].message.content;
  }

  async call(type, prompt, apiKey) {
    switch (type) {
      case 'gemini': return await this.callGemini(prompt, apiKey);
      case 'mistral': return await this.callMistral(prompt, apiKey);
      case 'cohere': return await this.callCohere(prompt, apiKey);
      case 'openrouter': return await this.callOpenRouter(prompt, apiKey);
      default: throw new Error(`Unknown provider type: ${type}`);
    }
  }
}

module.exports = AIProviders;