import { AssistantOverrides, VapiChatClient } from '../utils/vapiChatClient';

export interface ChatMessage {
    id?: string;
    sessionId?: string;
    role: 'user' | 'assistant' | 'tool';
    content: string;
    timestamp: Date;
}
export interface VapiChatState {
    messages: ChatMessage[];
    isTyping: boolean;
    isLoading: boolean;
    sessionId?: string;
}
export interface VapiChatHandlers {
    sendMessage: (text: string, sessionEnd?: boolean) => Promise<void>;
    clearMessages: () => void;
}
export interface UseVapiChatOptions {
    enabled?: boolean;
    publicKey?: string;
    assistantId?: string;
    assistantOverrides?: AssistantOverrides;
    apiUrl?: string;
    sessionId?: string;
    firstChatMessage?: string;
    onMessage?: (message: ChatMessage) => void;
    onError?: (error: Error) => void;
}
export declare const validateChatInput: (text: string, enabled: boolean, publicKey?: string, assistantId?: string, client?: VapiChatClient | null) => void;
export declare const createUserMessage: (text: string) => ChatMessage;
export declare const createAssistantMessage: (content: string) => ChatMessage;
export declare const resetAssistantMessageTracking: (currentAssistantMessageRef: React.MutableRefObject<string>, assistantMessageIndexRef: React.MutableRefObject<number | null>) => void;
export declare const preallocateAssistantMessage: (assistantMessageIndexRef: React.MutableRefObject<number | null>, setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => void;
export declare const handleStreamError: (error: Error, setIsTyping: (typing: boolean) => void, assistantMessageIndexRef: React.MutableRefObject<number | null>, onError?: (error: Error) => void) => void;
export declare const handleStreamChunk: (chunk: any, sessionId: string | undefined, setSessionId: (id: string | undefined) => void, currentAssistantMessageRef: React.MutableRefObject<string>, assistantMessageIndexRef: React.MutableRefObject<number | null>, setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => void;
export declare const handleStreamComplete: (setIsTyping: (typing: boolean) => void, assistantMessageIndexRef: React.MutableRefObject<number | null>, currentAssistantMessageRef: React.MutableRefObject<string>, onMessage?: (message: ChatMessage) => void) => void;
export declare const useVapiChat: ({ enabled, publicKey, assistantId, assistantOverrides, apiUrl, sessionId: initialSessionId, firstChatMessage, onMessage, onError, }: UseVapiChatOptions) => VapiChatState & VapiChatHandlers & {
    isEnabled: boolean;
};
//# sourceMappingURL=useVapiChat.d.ts.map