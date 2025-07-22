import { useEffect, useState } from "react";

export default function VirtualTcp() {
  const [receivedData, setReceivedData] = useState<string>("");
  const [command, setCommand] = useState<string>("");
  const [status, setStatus] = useState<string>("Menghubungkan...");
  console.log(receivedData);

  useEffect(() => {
    // Connect ke TCP
    window.api.virtualTcp.connect("127.0.0.1", 5000);
    setStatus("Terhubung ke TCP 127.0.0.1:5000");

    // Listen data masuk
    window.api.virtualTcp.onData((data) => {
      setReceivedData((prev) => prev + data + "\n");
    });

    // Kirim data tiap 3 detik
    const intervalId = setInterval(() => {
      window.api.virtualTcp.sendData("Ping from Electron!");
    }, 3000);

    // Cleanup saat komponen di-unmount
    return () => {
      clearInterval(intervalId);
      window.api.virtualTcp.disconnect();
      setStatus("Terputus dari TCP.");
    };
  }, []);

  const sendCommand = () => {
    if (command.trim() !== "") {
      window.api.virtualTcp.sendData(command.trim());
      setCommand("");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>SerialPort TCP Test</h1>
      <p>Status: {status}</p>

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
