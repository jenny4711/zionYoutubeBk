const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require('openai');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const createChatWithGoogle = async (prompt, lang) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  //------------------------------------------------------------------------------------------------
  const result = await model.generateContentStream(`Summarize the following into two sentences at the 12th grade level: ${prompt}  `);
  
  let text = '';
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    console.log(chunkText);
    text += chunkText;
  }
  console.log(text,'text!')                                                                                                                                                                

  return text;
};

const translateResult = async (story, lang) => {
  console.log(lang,'story');
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `Please translate this ${story} into ${lang}.  ` },
      ],
    });
    console.log(response.choices[0].message.content,'length!!!!!!!!');
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error creating chat completion:', error);
  }
};

module.exports = { createChatWithGoogle, translateResult };
