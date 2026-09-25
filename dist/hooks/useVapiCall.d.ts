import { StorageType } from '../utils/vapiCallStorage';

export interface VapiCallState {
    isCallActive: boolean;
    isSpeaking: boolean;
    volumeLevel: number;
    connectionStatus: 'disconnected' | 'connecting' | 'connected';
    isMuted: boolean;
}
export interface VapiCallHandlers {
    startCall: () => Promise<void>;
    endCall: (opts?: {
        force?: boolean;
    }) => Promise<void>;
    toggleCall: (opts?: {
        force?: boolean;
    }) => Promise<void>;
    toggleMute: () => void;
    reconnect: () => Promise<void>;
    clearStoredCall: () => void;
}
export interface UseVapiCallOptions {
    publicKey: string;
    callOptions: any;
    apiUrl?: string;
    enabled?: boolean;
    voiceAutoReconnect?: boolean;
    voiceReconnectStorage?: StorageType;
    reconnectStorageKey?: string;
    onCallStart?: () => void;
    onCallEnd?: () => void;
    onMessage?: (message: any) => void;
    onError?: (error: Error) => void;
    onTranscript?: (transcript: {
        role: string;
        text: string;
        timestamp: Date;
    }) => void;
}
export declare const useVapiCall: ({ publicKey, callOptions, apiUrl, enabled, voiceAutoReconnect, voiceReconnectStorage, reconnectStorageKey, onCallStart, onCallEnd, onMessage, onError, onTranscript, }: UseVapiCallOptions) => VapiCallState & VapiCallHandlers;
//# sourceMappingURL=useVapiCall.d.ts.map