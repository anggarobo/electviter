import { createTheme, MantineProvider } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import '@mantine/core/styles.css';

export default function Layout({ children }: PropsWithChildren) {
    const theme = createTheme({
        fontFamily: 'Open Sans, sans-serif',
        primaryColor: 'cyan',
    });

    return (
        <MantineProvider theme={theme}>
            {children}
        </MantineProvider>
    )
}