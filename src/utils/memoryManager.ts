import { DiscussionFlow } from '../types';
import * as fs from 'fs';

export class MemoryManager {
    private readonly todoPath = 'todo.md';

    saveProgress(flow: DiscussionFlow): void {
        const timestamp = new Date().toISOString();
        const progress = `
[${timestamp}] Прогресс обсуждения
Текущая шляпа: ${flow.currentHat}
Количество собранных мнений: ${flow.insights.length}
Следующий шаг: ${this.getNextStep(flow)}
`;

        fs.appendFileSync(this.todoPath, progress);
    }

    saveError(error: any): void {
        const timestamp = new Date().toISOString();
        const errorLog = `
[${timestamp}] Произошла ошибка
${error.message}
Стек: ${error.stack}
`;

        fs.appendFileSync(this.todoPath, errorLog);
    }

    private getNextStep(flow: DiscussionFlow): string {
        const hats = ['white', 'red', 'black', 'yellow', 'green', 'blue'];
        const currentIndex = hats.indexOf(flow.currentHat);
        return currentIndex < hats.length - 1 ? 
            `Переход к ${hats[currentIndex + 1]} шляпе` : 
            'Формирование итогового решения';
    }
}
