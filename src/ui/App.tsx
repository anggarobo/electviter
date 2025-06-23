import { useEffect, useState } from 'react'
import './App.css'
import SysInfo from './components/SysInfo'

function App() {
  const [statistic, setStatistic] = useState<Statistics | undefined>(undefined)

  useEffect(() => {
    window.electron.subscribeStatistics((data) => {
      setStatistic(data)
    })
  }, [])

  return (
    <SysInfo info={statistic} />
  )
}

export default App
