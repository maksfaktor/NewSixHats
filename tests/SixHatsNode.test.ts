import { SixHatsNode } from '../src/SixHatsNode';
import { HatPromptGenerator } from '../src/prompts/hatPrompts';
import { LangChainService } from '../src/services/langchainService';
import { NodeConnectionType } from 'n8n-workflow';

describe('SixHatsNode', () => {
    let node: SixHatsNode;

    beforeEach(() => {
        node = new SixHatsNode();
    });

    test('должен иметь корректное описание', () => {
        expect(node.description.displayName).toBe('Шесть шляп мышления');
        expect(node.description.name).toBe('sixHats');
    });

    test('должен иметь правильную конфигурацию входов/выходов', () => {
        const { inputs, outputs } = node.description;

        expect(inputs).toHaveLength(1);
        expect(inputs[0]).toEqual({
            displayName: 'Input',
            type: NodeConnectionType.Main,
        });

        expect(outputs).toHaveLength(1);
        expect(outputs[0]).toEqual({
            displayName: 'Output',
            type: NodeConnectionType.Main,
        });
    });

    test('должен иметь необходимые свойства', () => {
        const properties = node.description.properties;
        expect(properties).toContainEqual(
            expect.objectContaining({
                name: 'problem',
                type: 'string',
                required: true,
            })
        );
    });
});

describe('HatPromptGenerator', () => {
    let generator: HatPromptGenerator;

    beforeEach(() => {
        generator = new HatPromptGenerator();
    });

    test('должен генерировать промпты для всех шляп', () => {
        const problem = 'тестовая проблема';
        const hats = ['white', 'red', 'black', 'yellow', 'green', 'blue'] as const;

        hats.forEach(hat => {
            const prompt = generator.generatePrompt(hat, problem);
            expect(prompt).toContain(problem);
            expect(prompt.length).toBeGreaterThan(0);
        });
    });

    test('должен генерировать итоговый промпт', () => {
        const flow = {
            problem: 'тестовая проблема',
            insights: [],
            currentHat: 'blue' as const
        };

        const summaryPrompt = generator.generateSummaryPrompt(flow);
        expect(summaryPrompt).toContain('итоги обсуждения');
        expect(summaryPrompt).toContain('Факты и информация');
    });
});

describe('LangChainService', () => {
    let service: LangChainService;

    beforeEach(() => {
        service = new LangChainService();
    });

    test('должен быть создан с правильными настройками', () => {
        expect(service).toBeDefined();
    });

    // Мокаем внешние вызовы API для тестов
    test('должен обрабатывать ошибки при генерации ответа', async () => {
        const mockError = new Error('API Error');
        jest.spyOn(service['model'], 'call').mockRejectedValue(mockError);

        await expect(service.generateResponse('test prompt')).rejects.toThrow('API Error');
    });
});