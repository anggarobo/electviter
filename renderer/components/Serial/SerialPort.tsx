import { useEffect, useState } from "react";

export default function SerialPort() {
  const [receivedData, setReceivedData] = useState<string>("");
  const [command, setCommand] = useState<string>("");
  const [status, setStatus] = useState<string>("Menghubungkan...");
  const [ports, setPorts] = useState<any[]>([]);
  // console.log({ receivedData, ports, status, command });

  const getPorts = async () => {
    const port = await window.api.serial.listPorts();
    setPorts(port);
  };

  useEffect(() => {
    getPorts();
    // Connect ke TCP
    // window.api.serial.connect("127.0.0.1", 5000);

    window.api.serial.listPorts().then((port) => console.log(port));
    window.api.serial.onPortListChanged((info) => {
      console.log(info);
    });

    // Listen data masuk
    window.api.serial.onData(({ path, data }) => {
      console.log(`[${path}] received`, data);
      setReceivedData((prev) => prev + data + "\n");
    });

    // Listen data masuk
    window.api.serial.onStatus((stat) => {
      console.log({ status: stat });
      setStatus(stat);
    });

    // Kirim data tiap 5 detik
    const intervalId = setInterval(() => {
      window.api.serial.sendData("Ping from Renderer!\n");
    }, 5000);

    // Cleanup saat komponen di-unmount
    return () => {
      clearInterval(intervalId);
      // window.api.serial.disconnect();
      // setStatus("Terputus dari TCP.");
    };
  }, []);

  const sendCommand = () => {
    if (command.trim() !== "") {
      window.api.serial.sendData(command.trim());
      setCommand("");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>SerialPort Test</h1>
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
