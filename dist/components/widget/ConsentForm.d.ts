import { default as React } from 'react';
import { WidgetLabels } from '../types';

interface ColorScheme {
    baseColor: string;
    accentColor: string;
    ctaButtonColor: string;
    ctaButtonTextColor: string;
}
interface StyleConfig {
    size: 'tiny' | 'compact' | 'full';
    radius: 'none' | 'small' | 'medium' | 'large';
    theme: 'light' | 'dark';
}
export interface ConsentFormProps {
    consentTitle?: string;
    consentContent: string;
    onAccept: () => void;
    onCancel: () => void;
    colors: ColorScheme;
    styles: StyleConfig;
    radius: 'none' | 'small' | 'medium' | 'large';
    labels: Pick<WidgetLabels, 'consentAccept' | 'consentCancel'>;
}
declare const ConsentForm: React.FC<ConsentFormProps>;
export default ConsentForm;
//# sourceMappingURL=ConsentForm.d.ts.map