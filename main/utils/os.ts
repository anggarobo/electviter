import os from "os";

const homePath: Record<OsPlatform["platform"], string> = {
  win32: "c:\\",
  linux: "/home",
  darwin: "/Users",
};

const platform: OsPlatform = {
  platform: process.platform as OsPlatform["platform"],
  isMac: process.platform === "darwin",
  isWindows: process.platform === "win32",
  isLinux: process.platform === "linux",
  username: os.userInfo().username,
  homepath: homePath[process.platform as OsPlatform["platform"]] ?? "/",
};

export default { ...platform };
