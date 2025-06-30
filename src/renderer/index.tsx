import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from './Layout.tsx'
// import App from './App.tsx'
import './styles.css'
import Sidebar from './components/Sidebar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout>
      <Sidebar />
      {/* <App /> */}
    </Layout>
  </StrictMode>,
)
