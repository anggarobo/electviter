import { Button, Flex, Select, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

export default function SerialPort() {
  const [receivedData, setReceivedData] = useState<string>("");
  const [command, setCommand] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [status, setStatus] = useState<string>("Connecting...");
  const [ports, setPorts] = useState<any>(undefined);
  // console.log({ receivedData, ports, status, command });

  const getPorts = async () => {
    const port = await window.api.serial.listPorts();
    if (port) setStatus("Connected");
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
    // const intervalId = setInterval(() => {
    //   window.api.serial.sendData("Ping from Renderer!\n");
    // }, 5000);

    // Cleanup saat komponen di-unmount
    return () => {
      // clearInterval(intervalId);
      // window.api.serial.disconnect();
      // setStatus("Terputus dari TCP.");
    };
  }, []);

  const onSend: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (command.trim() !== "") {
      window.api.serial.sendData({
        data: command.trim(),
        path: path,
      });
      setCommand("");
    }
  };

  console.log({ ports });

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>SerialPort Test</h1>
      {ports ? (
        <div>
          <p>Ports:</p>
          <ul>
            {ports?.output?.map((item: { path: string; source: string }) => (
              <li key={item?.path}>{item?.path} connected!</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>{status}</p>
      )}

      <h3>Received Data:</h3>
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
        {receivedData || "Empty!"}
      </div>

      <h3>Send a Command:</h3>
      <form onSubmit={onSend} style={{ width: "70%" }}>
        <Flex gap="md" direction="column">
          <Flex gap="md">
            <TextInput
              label="Command"
              placeholder="Input Command"
              onChange={(e) => setCommand(e.target.value)}
              flex={1}
              withAsterisk
            />
            <Select
              label="Port"
              placeholder="Select Port"
              data={["/tmp/ttyV1", "/tmp/ttyV3"]}
              onChange={(p) => setPath(p || "")}
              withAsterisk
            />
          </Flex>
          <Button disabled={path == ""} w="100" type="submit">
            Send
          </Button>
        </Flex>
      </form>
    </div>
  );
}
