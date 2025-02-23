export type HatType = 'white' | 'red' | 'black' | 'yellow' | 'green' | 'blue';
export interface Insight {
    hat: HatType;
    content: string;
}
export interface DiscussionFlow {
    problem: string;
    insights: Insight[];
    currentHat: HatType;
}
