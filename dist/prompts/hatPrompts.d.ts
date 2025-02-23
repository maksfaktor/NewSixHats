import { HatType } from '../types';
export declare class HatPromptGenerator {
    private readonly prompts;
    generatePrompt(hat: HatType, problem: string): string;
    generateSummaryPrompt(flow: any): string;
}
