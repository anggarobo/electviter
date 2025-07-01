import { createTheme, MantineProvider } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import '@mantine/core/styles.css';
import BasicAppShell from './components/AppShell';
import { PathProvider } from './contexts/path';

export default function App({ children }: PropsWithChildren) {
    const theme = createTheme({
        fontFamily: 'Open Sans, sans-serif',
        primaryColor: 'cyan',
    });

    // useEffect(() => {
    //     const api = window.api
    //     console.log(api)
    // }, [])

    return (
        <MantineProvider theme={theme}>
            <PathProvider>
                <BasicAppShell />
            </PathProvider>
        </MantineProvider>
    )
}