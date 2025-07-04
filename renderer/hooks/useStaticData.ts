import { useEffect, useState } from "react";

export default function useStaticData() {
  const [staticData, setStaticData] = useState<Omit<
    Statistics,
    "cpuUsage"
  > | null>(null);

  useEffect(() => {
    (async () => {
      setStaticData(await window.electron.getStaticData());
    })();
  }, []);

  return staticData;
}
