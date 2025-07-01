import { createContext, useContext, useState, type PropsWithChildren } from "react"

interface OsPath {
    path: string,
    setPath: React.Dispatch<React.SetStateAction<string>>
}

const initContext: OsPath = {
    path: '/home/angga',
    setPath: () => {}
}

const PathContext = createContext(initContext)
export const usePathContext = () => useContext(PathContext)
export function PathProvider({children}: PropsWithChildren) {
    const [path, setPath] = useState(initContext.path)

    return (
        <PathContext.Provider value={{ path, setPath }} >
            {children}
        </PathContext.Provider>
    )
}