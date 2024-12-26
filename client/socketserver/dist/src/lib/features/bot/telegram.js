"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpdates = exports.sendTelegramMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const sendTelegramMessage = (chatId, message) => __awaiter(void 0, void 0, void 0, function* () {
    const token = process.env.NEXT_PUBLIC_TELEGRAM_TOKEN_API;
    console.log(token);
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    try {
        yield axios_1.default.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
        });
    }
    catch (error) {
        console.error('Error during sending message to Telegram', error);
    }
});
exports.sendTelegramMessage = sendTelegramMessage;
const getUpdates = () => __awaiter(void 0, void 0, void 0, function* () {
    const token = process.env.NEXT_PUBLIC_TELEGRAM_TOKEN_API;
    const url = `https://api.telegram.org/bot${token}/getUpdates`;
    try {
        const response = yield axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        console.log('Error during getting updates', error);
    }
});
exports.getUpdates = getUpdates;
