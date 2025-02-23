import { INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType, IExecuteFunctions } from 'n8n-workflow';
import { HatPromptGenerator } from './prompts/hatPrompts';
import { LangChainService } from './services/langchainService';
import { MemoryManager } from './utils/memoryManager';
import { HatType, DiscussionFlow } from './types';

export class SixHatsNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Шесть шляп мышления',
        name: 'sixHats',
        group: ['transform'],
        version: 1,
        description: 'Узел для анализа проблем методом шести шляп мышления',
        defaults: {
            name: 'Шесть шляп',
        },
        inputs: [{
            displayName: 'Input',
            type: NodeConnectionType.Main,
        }],
        outputs: [{
            displayName: 'Output',
            type: NodeConnectionType.Main,
        }],
        properties: [
            {
                displayName: 'Проблема',
                name: 'problem',
                type: 'string',
                default: '',
                required: true,
                description: 'Описание проблемы для анализа',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const problem = this.getNodeParameter('problem', 0) as string;

        const langChainService = new LangChainService();
        const promptGenerator = new HatPromptGenerator();
        const memoryManager = new MemoryManager();

        const discussionFlow: DiscussionFlow = {
            problem,
            insights: [],
            currentHat: 'blue',
        };

        try {
            // Начинаем с синей шляпы для организации процесса
            const blueHatPrompt = promptGenerator.generatePrompt('blue', problem);
            const blueHatResponse = await langChainService.generateResponse(blueHatPrompt);
            discussionFlow.insights.push({
                hat: 'blue',
                content: blueHatResponse,
            });

            // Последовательность шляп
            const hats: HatType[] = ['white', 'red', 'black', 'yellow', 'green', 'blue'];

            for (const hat of hats) {
                const prompt = promptGenerator.generatePrompt(hat, problem);
                const response = await langChainService.generateResponse(prompt);

                discussionFlow.insights.push({
                    hat,
                    content: response,
                });

                memoryManager.saveProgress(discussionFlow);
            }

            // Финальный анализ синей шляпой
            const finalBlueHatPrompt = promptGenerator.generateSummaryPrompt(discussionFlow);
            const summary = await langChainService.generateResponse(finalBlueHatPrompt);

            return [[
                {
                    json: {
                        flow: discussionFlow,
                        summary,
                    },
                },
            ]];
        } catch (error) {
            memoryManager.saveError(error);
            throw error;
        }
    }
}