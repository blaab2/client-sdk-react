export interface StoredCallData {
    webCallUrl: string;
    id?: string;
    artifactPlan?: {
        videoRecordingEnabled?: boolean;
    };
    assistant?: {
        voice?: {
            provider?: string;
        };
    };
    callOptions?: any;
    timestamp: number;
}
export type StorageType = 'session' | 'cookies';
export declare const storeCallData: (reconnectStorageKey: string, call: any, callOptions?: any, storageType?: StorageType) => void;
export declare const getStoredCallData: (reconnectStorageKey: string, storageType?: StorageType) => StoredCallData | null;
export declare const clearStoredCall: (reconnectStorageKey: string, storageType?: StorageType) => void;
export declare const areCallOptionsEqual: (options1: any, options2: any) => boolean;
//# sourceMappingURL=vapiCallStorage.d.ts.map