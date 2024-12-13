import axios from 'axios';
export const chatSession = {
  // const axios = require('axios');
  method: 'POST',
  url: 'https://chatgpt-42.p.rapidapi.com/gpt4',
  headers: {
    'x-rapidapi-key': process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    messages: [
      {
        role: 'user',
        content: 'hi'
      }
    ],
    web_access: false
  }
};
// try {
// 	const response = await axios.request(options);
// 	console.log(response.data);
// } catch (error) {
// 	console.error(error);

