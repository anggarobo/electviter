# 🚀 ELECVITER

This project is a personal exploration of building a desktop application using a modern stack consisting of **Electron**, **Vite**, **React**, and **TypeScript**. The goal is to understand how these technologies integrate and work together to create a cross-platform desktop app.


## 🛠️ Tech Stack

| Technology          | Description |
|---------------------|-------------|
| **Electron**        | Framework for building desktop apps using JavaScript, HTML, and CSS |
| **Vite**            | The Build Tool to provide a faster and leaner development for the Web |
| **React**           | Component-based UI library |
| **TypeScript**      | Strongly-typed superset of JavaScript |
| **pnpm**            | Fast and disk space-efficient JavaScript package manager |



## 📁 Project Structure

```bash
electviter/
├── src/
│   ├── electron/
│   │   ├── main.ts         
│   │   └── tsconfig.json   
│   └── ui/                 
│       ├── assets/
│       ├── components/ 
│       ├── App.css         
│       ├── App.tsx         
│       ├── index.css       
│       ├── main.tsx        
│       └── vite-env.d.ts   
├── electron-builder.json   
├── index.html              
├── tsconfig.app.json       
├── tsconfig.json
├── tsconfig.node.json
├── package.json
└── README.md               
```



## 🚀 Getting Started

Install dependencies using pnpm:

```bash
pnpm install
```

Start the react-app in development mode:

```bash
pnpm run dev:react
```


Start the electron-app in development mode:

```bash
pnpm run dev:electron
```


## 📦 Building & Packaging

To package the application into a distributable format (e.g., .msi, .AppImage, .dmg, etc.):

Mac

```bash
pnpm run dist:mac
```


Linux

```bash
pnpm run dist:linux
```

Windows

```bash
pnpm run dist:win
```

## 📚 References

* [Vite Documentation](https://vite.dev/guide/)
* [Electron Main Process API](https://www.electronjs.org/docs/latest/api/app)
* [TypeScript Documentation](https://www.typescriptlang.org/docs/)
* [React Documentation](https://react.dev/)
* [pnpm Documentation](https://pnpm.js.org/docs/)



## ✍️ Personal Notes
This project helped me gain a deeper understanding of how modern front-end tools can be combined with Electron to create powerful desktop applications. Using pnpm significantly improved installation speed and reduced node_modules size through symlinks and content-addressable storage.






