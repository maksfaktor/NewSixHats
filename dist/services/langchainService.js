"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangChainService = void 0;
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
class LangChainService {
    constructor() {
        this.model = new openai_1.ChatOpenAI({
            temperature: 0.7,
            modelName: 'gpt-4',
        });
    }
    async generateResponse(prompt) {
        try {
            const systemMessage = new messages_1.SystemMessage('Вы - эксперт по методу шести шляп мышления. Ваша задача - помочь проанализировать проблему с разных точек зрения.');
            const humanMessage = new messages_1.HumanMessage(prompt);
            const response = await this.model.call([systemMessage, humanMessage]);
            return response.content;
        }
        catch (error) {
            console.error('Ошибка при генерации ответа:', error);
            throw error;
        }
    }
}
exports.LangChainService = LangChainService;
