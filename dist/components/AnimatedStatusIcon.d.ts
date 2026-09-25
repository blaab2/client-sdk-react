import { default as React } from 'react';

export interface AnimatedStatusIconProps {
    /** Size of the icon in pixels */
    size?: number;
    /** Connection status */
    connectionStatus?: 'disconnected' | 'connecting' | 'connected';
    /** Whether a call is active */
    isCallActive?: boolean;
    /** Whether the assistant is speaking */
    isSpeaking?: boolean;
    /** Whether the assistant is typing */
    isTyping?: boolean;
    /** Whether there's an error */
    isError?: boolean;
    /** Volume level (0-1) for volume-responsive animations */
    volumeLevel?: number;
    /** Base color for inactive bars */
    baseColor?: string;
    /** Override animation type */
    animationType?: 'spin' | 'pulse' | 'sequential' | 'wave' | 'none' | 'scale' | 'rotate-fade';
    /** Override animation speed in milliseconds */
    animationSpeed?: number;
    /** Override colors for bars */
    colors?: string | string[];
    /** Number of bars (default: 17) */
    barCount?: number;
    /** Bar width ratio (0-1) */
    barWidthRatio?: number;
    /** Bar height ratio (0-1) */
    barHeightRatio?: number;
    /** Custom class name */
    className?: string;
}
declare const AnimatedStatusIcon: React.FC<AnimatedStatusIconProps>;
export default AnimatedStatusIcon;
//# sourceMappingURL=AnimatedStatusIcon.d.ts.map