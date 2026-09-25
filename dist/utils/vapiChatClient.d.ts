export interface AssistantOverrides {
    variableValues?: {
        [key: string]: string;
    };
}
export interface VapiChatMessage {
    input: string | Array<{
        role: string;
        content: string;
    }>;
    assistantId: string;
    assistantOverrides?: AssistantOverrides;
    sessionId?: string;
    stream?: boolean;
    sessionEnd?: boolean;
}
export interface VapiChatStreamChunk {
    id?: string;
    path?: string;
    delta?: string;
    sessionId?: string;
    output?: string;
    [key: string]: any;
}
export interface VapiChatClientOptions {
    apiUrl?: string;
    publicKey: string;
}
export type StreamCallback = (chunk: VapiChatStreamChunk) => void;
export type ErrorCallback = (error: Error) => void;
export type CompleteCallback = () => void;
export declare class VapiChatClient {
    private apiUrl;
    private publicKey;
    private abortController;
    constructor(options: VapiChatClientOptions);
    streamChat(message: VapiChatMessage, onChunk: StreamCallback, onError?: ErrorCallback, onComplete?: CompleteCallback): Promise<() => void>;
    abort(): void;
}
export declare function extractContentFromPath(chunk: VapiChatStreamChunk): string | null;
//# sourceMappingURL=vapiChatClient.d.ts.map