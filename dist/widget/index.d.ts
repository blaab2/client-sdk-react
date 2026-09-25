import { default as React } from 'react';

export interface WidgetConfig {
    container: string | HTMLElement;
    component: keyof typeof COMPONENTS;
    props?: any;
}
declare const COMPONENTS: {
    VapiWidget: React.FC<import('..').VapiWidgetProps>;
};
declare class WidgetLoader {
    private root;
    private container;
    constructor(config: WidgetConfig);
    destroy(): void;
}
declare global {
    interface Window {
        WidgetLoader: typeof WidgetLoader;
    }
}
export default WidgetLoader;
//# sourceMappingURL=index.d.ts.map