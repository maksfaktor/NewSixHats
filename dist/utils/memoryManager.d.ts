import { DiscussionFlow } from '../types';
export declare class MemoryManager {
    private readonly todoPath;
    saveProgress(flow: DiscussionFlow): void;
    saveError(error: any): void;
    private getNextStep;
}
