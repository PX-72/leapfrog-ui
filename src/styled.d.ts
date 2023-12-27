// This extends the DefaultTheme type for styled components.  
// It is required to be able to provide typed theme (see /src/index.tsx).

// Import original module declarations.
import 'styled-components';

// Extend original module declarations.
declare module 'styled-components' {
    export interface DefaultTheme {
        fontColor: string;
        backgroundColor: string;
        separatorBorder: string;
        selectedBackgroundColor: string;

        button: {
            color: string;
            hoverColor: string;
            background: string;
            dangerBackground: string;
            hoverBackground: string;
            dangerHoverBackground: string;
        };

        panel: {
            backgroundColor: string;
            darkerBackgroundColor: string;
            borderRadius: string;
            padding: string;
            margin: string;
        };

        scrollbar: {
            backgroundColor: string;
            thumbColor: string;
            thumbHoverColor: string;
        };
    }
}
