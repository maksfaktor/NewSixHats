import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export class LangChainService {
    private model: ChatOpenAI;

    constructor() {
        this.model = new ChatOpenAI({
            temperature: 0.7,
            modelName: 'gpt-4',
        });
    }

    async generateResponse(prompt: string): Promise<string> {
        try {
            const systemMessage = new SystemMessage(
                'Вы - эксперт по методу шести шляп мышления. Ваша задача - помочь проанализировать проблему с разных точек зрения.'
            );

            const humanMessage = new HumanMessage(prompt);

            const response = await this.model.call([systemMessage, humanMessage]);

            return response.content as string;
        } catch (error) {
            console.error('Ошибка при генерации ответа:', error);
            throw error;
        }
    }
}