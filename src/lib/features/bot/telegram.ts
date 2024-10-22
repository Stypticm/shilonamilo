import axios from 'axios';

export const sendTelegramMessage = async (chatId: string, message: string) => {
  const token = process.env.NEXT_PUBLIC_TELEGRAM_TOKEN_API;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    });
  } catch (error) {
    console.error('Error during sending message to Telegram', error);
  }
};

export const getUpdates = async () => {
  const token = process.env.NEXT_PUBLIC_TELEGRAM_TOKEN_API;
  const url = `https://api.telegram.org/bot${token}/getUpdates`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log('Error during getting updates', error);
  }
};
