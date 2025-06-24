import { useEffect, useState } from 'react'
import './App.css'
import SysInfo from './components/SysInfo'

function App() {
  const [statistic, setStatistic] = useState<Statistics | undefined>(undefined)

  useEffect(() => {
    const unsub = window.electron.subscribeStatistics((data) => {
      setStatistic(data);
    })
    return unsub;
  }, [])

  return (
    <SysInfo info={statistic} />
  )
}

export default App
