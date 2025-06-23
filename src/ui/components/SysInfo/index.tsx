export default function SysInfo({ info }: { info?: Statistics }) {
    if (!info) {
        return <div className="system-info-container">Loading...</div>;
    }

    return (
        <div className="system-info-container">
      <h2 className="title">🖥️ System Monitor</h2>
      <div className="info-grid">
        <div className="card">
          <h3>CPU Usage</h3>
          <p>{info.cpuUsage.toFixed(2)}%</p>
        </div>
        <div className="card">
          <h3>CPU Model</h3>
          <p>{info.cpuModel}</p>
        </div>
        <div className="card">
          <h3>RAM Usage</h3>
          <p>Total: {info.memory.total}</p>
          <p>Used: {info.memory.used}</p>
          <p>Free:  {info.memory.free}</p>
        </div>
        <div className="card">
          <h3>Storage Usage</h3>
          <p>Total: {info.storage.total}</p>
          <p>Used: {info.storage.used}</p>
          <p>Free:  {info.storage.free}</p>
        </div>
        <div className="card">
          <h3>Architecture</h3>
          <p>{info.arch}</p>
        </div>
        <div className="card">
          <h3>Platform</h3>
          <p>{info.platform}</p>
        </div>
        <div className="card">
          <h3>Uptime</h3>
          <p>{info.uptime}</p>
        </div>
      </div>
    </div>
    )
}