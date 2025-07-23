# Electron Serialport with Socat

This project demonstrates how to use **Electron** in conjunction with **serialport** to communicate with a serial device via TCP using **socat**. The application opens a serial port and sends/receives data through it. **Socat** acts as a bridge to map the serial communication to a TCP port.

## Prerequisites

Before running this application, ensure the following:

- **socat** is installed and configured to create a TCP bridge to the serial port.
- **screen** is installed to interact with the virtual serial port.

### Installing `socat`

- **Linux (Debian/Ubuntu)**:
  ```bash
  sudo apt-get install socat
  ```
- macOS (via Homebrew):

  ```bash
  brew install socat
  ```

- Windows: Download the Windows binary from socat's website, or use Cygwin to install it.

### Installing `screen`

- On Linux (Debian/Ubuntu):

  ```bash
  sudo apt-get install screen
  ```

- On macOS (via Homebrew):

  ```bash
  brew install screen
  ```

- On Windows:
  - You can use Windows Subsystem for Linux (WSL) and follow the Linux instructions, or
  - Use Cygwin to install screen, or
  - Install a terminal emulator like Git Bash that includes screen.

Once screen is installed, you can use it to interact with the virtual serial ports created by socat.

## Getting Started

1. Clone the Repository

   Clone the project repository to your local machine.

   ```bash
   git clone https://github.com/anggarobo/electviter.git
   cd electviter
   ```

2. Install Dependencies

   Install the necessary Node.js dependencies.

   ```bash
   pnpm install
   ```

   This will install Electron and serialport required for the application to work.

3. Configure socat for Virtual Serial Ports

   For this setup, we will use **socat** to create two virtual serial ports, `/tmp/ttyV0` and `/tmp/ttyV1`. These two virtual ports will be linked together, so any data sent to one will be received on the other.

   Run the following command in `Terminal 1` to create the virtual serial ports:

   ```bash
   socat -d -d PTY,link=/tmp/ttyV0,raw,echo=0 PTY,link=/tmp/ttyV1,raw,echo=0
   ```

   Explanation:

   - PTY,link=/tmp/ttyV0,raw,echo=0: Creates the first virtual serial port /tmp/ttyV0.

   - PTY,link=/tmp/ttyV1,raw,echo=0: Creates the second virtual serial port /tmp/ttyV1.

   - -d -d: Enables debug output, which helps you monitor the connection between the two ports.

4. Use screen to Connect to the Virtual Port

   Once the virtual serial ports are created, open a `second terminal` and use the screen command to connect to /tmp/ttyV0 (or whichever port you prefer):

   ```bash
   screen /tmp/ttyV0 9600
   ```

   Explanation:
  
   - /tmp/ttyV0: The virtual serial port to connect to.
   - 9600: Baud rate for serial communication. Adjust if needed.
  
   After running this command, you can interact with the virtual port via the screen session. Any data sent to /tmp/ttyV1 will be visible in this terminal.

5. Running the Electron Application

   Now, you’re ready to run the Electron application. To start the development server using pnpm, execute the following command:
  
   ```
   pnpm run dev
   ```
  
   Explanation:
  
   This will start the Electron application in development mode.
  
   You will see some logs in the terminal, and the Electron app window will open.
  
   In the terminal running pnpm run dev, you’ll also see logs indicating that the app is sending data to the serial port (/tmp/ttyV0) every few seconds.

6. Observe the Messages in screen

   While the Electron app is running, it will send messages to /tmp/ttyV0 in regular intervals. In the terminal where you're running screen with /tmp/ttyV0, you should start seeing the messages being printed at regular intervals.
  
   For example, the terminal may show:
  
   ```bash
   [SerialHelper] Data masuk: {message}
   [SerialHelper] Data masuk: {message}
   [SerialHelper] Data masuk: {message}
   ```

   This confirms that the Electron app is successfully sending data to the virtual serial port and you can observe the communication in real time.

7. Exiting screen

   To exit screen, press Ctrl + A, then press K, and confirm with "Yes" to terminate the session.
