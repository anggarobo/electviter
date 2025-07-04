import { useEffect, useMemo, useState } from "react";
import "./App.css";
import useStatistics from "./hooks/useStatistics";
import useStaticData from "./hooks/useStaticData";
import { Chart } from "./components/Charts";
// import Header from "./components/Header";
import ChartItem from "./components/Charts/Item";
import useFile from "./hooks/useFile";

function App() {
  const staticData = useStaticData();
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<ViewChangeEvent>("CPU");
  // const { onOpenFile, onSaveFile } = useFile()

  const cpuUsages = useMemo(
    () => statistics.map((stat) => stat.cpuUsage),
    [statistics],
  );

  const ramUsages = useMemo(
    () => statistics.map((stat) => stat.memory.usage),
    [statistics],
  );

  const storageUsages = useMemo(
    () => statistics.map((stat) => stat.storage.usage),
    [statistics],
  );

  const activeUsages = useMemo(() => {
    switch (activeView) {
      case "CPU":
        return cpuUsages;
      case "RAM":
        return ramUsages;
      case "STORAGE":
        return storageUsages;
    }
  }, [activeView, cpuUsages, ramUsages, storageUsages]);

  useEffect(() => {
    return window.electron.subscribeChangeView((view) => setActiveView(view));
  }, []);

  console.log(statistics);

  return (
    <div className="App">
      {/* <Header /> */}
      <div className="main">
        <div>
          <ChartItem
            onClick={() => setActiveView("CPU")}
            title="CPU"
            view="CPU"
            subTitle={staticData?.cpuModel ?? ""}
            data={cpuUsages}
          />
          <ChartItem
            onClick={() => setActiveView("RAM")}
            title="RAM"
            view="RAM"
            subTitle={
              Math.floor((staticData?.memory?.total || 0) / 1024) + " GB"
            }
            data={ramUsages}
          />
          <ChartItem
            onClick={() => setActiveView("STORAGE")}
            title="STORAGE"
            view="STORAGE"
            // subTitle={(staticData?.storage.total.toString() ?? "") + " GB"}
            subTitle={
              Math.floor((staticData?.storage?.total || 0) / 1_000_000_000) +
              " GB"
            }
            data={storageUsages}
          />
        </div>
        <div className="mainGrid">
          <Chart
            selectedView={activeView}
            data={activeUsages}
            maxDataPoints={10}
          />
        </div>
      </div>

      <br />
      <br />
      <br />
      {/* <button onClick={onOpenFile} id="openFileBtn">Open File</button>
      <button onClick={onSaveFile} id="saveFileBtn">Save File</button>
      <pre id="fileContent"></pre> */}
    </div>
  );
}

export default App;
