import { useEffect, useState } from "react";

export default function Serial() {
  const [ports, setPorts] = useState<any[]>([]);
  const [connectedPort, setConnectedPort] = useState<string | null>(null);
  const [receivedData, setReceivedData] = useState<string>("");
  const [command, setCommand] = useState<string>("");
  const [status, setStatus] = useState<string>("Mencari port...");
  console.log({ ports, connectedPort, receivedData, command, status });

  useEffect(() => {
    async function init() {
      try {
        const list = await window.api.serial.listPorts();
        setPorts(list);
        const virtualPort = list.find((p) => p.path === "/tmp/ttyV0");
        if (virtualPort) {
          window.api.serial.connect(virtualPort.path);
          setConnectedPort(virtualPort.path);
          setStatus(`Terhubung ke port ${virtualPort.path}`);

          window.api.serial.onData((data) => {
            setReceivedData(data);
          });
        } else {
          setStatus("Virtual port tidak ditemukan.");
        }
      } catch (err) {
        setStatus("Error: " + (err as Error).message);
      }
    }
    init();
  }, []);

  const sendCommand = () => {
    if (connectedPort && command.trim() !== "") {
      window.api.serial.sendData(command.trim());
      setCommand("");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>SerialPort Test</h1>
      <p>Status: {status}</p>

      <h3>Ports Tersedia:</h3>
      <ul>
        {ports.slice(0, 5).map((port) => (
          <li key={port.path}>{port.path}</li>
        ))}
      </ul>

      <h3>Data diterima:</h3>
      <div
        style={{
          minHeight: 50,
          padding: 10,
          border: "1px solid #ccc",
          marginBottom: 20,
          backgroundColor: "#f9f9f9",
          whiteSpace: "pre-wrap",
        }}
      >
        {receivedData || "Belum ada data"}
      </div>

      <h3>Kirim Perintah:</h3>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendCommand()}
        placeholder="Ketik perintah..."
        style={{ padding: 8, width: "70%", marginRight: 10 }}
      />
      <button onClick={sendCommand} style={{ padding: "8px 16px" }}>
        Kirim
      </button>
    </div>
  );
}
