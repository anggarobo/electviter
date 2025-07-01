import { createTheme, MantineProvider } from '@mantine/core';
import { useEffect, type PropsWithChildren } from 'react';
import '@mantine/core/styles.css';
import BasicAppShell from './components/AppShell';

export default function Layout({ children }: PropsWithChildren) {
    const theme = createTheme({
        fontFamily: 'Open Sans, sans-serif',
        primaryColor: 'cyan',
    });

    useEffect(() => {
        const api = window.api
        console.log(api)
    }, [])

    return (
        <MantineProvider theme={theme}>
            <BasicAppShell>
                {children}
            </BasicAppShell>
        </MantineProvider>
    )
}