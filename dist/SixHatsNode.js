"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SixHatsNode = void 0;
const hatPrompts_1 = require("./prompts/hatPrompts");
const langchainService_1 = require("./services/langchainService");
const memoryManager_1 = require("./utils/memoryManager");
class SixHatsNode {
    constructor() {
        this.description = {
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
                    type: "main" /* NodeConnectionType.Main */,
                }],
            outputs: [{
                    displayName: 'Output',
                    type: "main" /* NodeConnectionType.Main */,
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
    }
    async execute() {
        const problem = this.getNodeParameter('problem', 0);
        const langChainService = new langchainService_1.LangChainService();
        const promptGenerator = new hatPrompts_1.HatPromptGenerator();
        const memoryManager = new memoryManager_1.MemoryManager();
        const discussionFlow = {
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
            const hats = ['white', 'red', 'black', 'yellow', 'green', 'blue'];
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
        }
        catch (error) {
            memoryManager.saveError(error);
            throw error;
        }
    }
}
exports.SixHatsNode = SixHatsNode;
