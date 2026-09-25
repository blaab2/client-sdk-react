import { ChatMessage } from './useVapiChat';
import { AssistantOverrides } from '../utils/vapiChatClient';

export type VapiMode = 'voice' | 'chat' | 'hybrid';
export interface UseVapiWidgetOptions {
    mode: VapiMode;
    publicKey: string;
    assistantId?: string;
    assistant?: any;
    assistantOverrides?: AssistantOverrides;
    apiUrl?: string;
    firstChatMessage?: string;
    voiceAutoReconnect?: boolean;
    voiceReconnectStorage?: 'session' | 'cookies';
    reconnectStorageKey?: string;
    onCallStart?: () => void;
    onCallEnd?: () => void;
    onMessage?: (message: any) => void;
    onError?: (error: Error) => void;
}
export declare const useVapiWidget: ({ mode, publicKey, assistantId, assistant, assistantOverrides, apiUrl, firstChatMessage, voiceAutoReconnect, voiceReconnectStorage, reconnectStorageKey, onCallStart, onCallEnd, onMessage, onError, }: UseVapiWidgetOptions) => {
    mode: VapiMode;
    activeMode: "voice" | "chat" | null;
    conversation: ChatMessage[];
    voice: {
        isAvailable: boolean;
        toggleCall: ({ force }?: {
            force?: boolean;
        }) => Promise<void>;
        isCallActive: boolean;
        isSpeaking: boolean;
        volumeLevel: number;
        connectionStatus: "disconnected" | "connecting" | "connected";
        isMuted: boolean;
        startCall: () => Promise<void>;
        endCall: (opts?: {
            force?: boolean;
        }) => Promise<void>;
        toggleMute: () => void;
        reconnect: () => Promise<void>;
        clearStoredCall: () => void;
    };
    chat: {
        isAvailable: boolean;
        sendMessage: (text: string, sessionEnd?: boolean) => Promise<void>;
        handleInput: (value: string) => void;
        messages: ChatMessage[];
        isTyping: boolean;
        isLoading: boolean;
        sessionId?: string;
        clearMessages: () => void;
        isEnabled: boolean;
    };
    clearConversation: () => void;
    isUserTyping: boolean;
};
//# sourceMappingURL=useVapiWidget.d.ts.map