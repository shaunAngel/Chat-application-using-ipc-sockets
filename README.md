## Realtime Chat over WebSockets (IPC-style)

This project is a **minimal, professional realtime chat application** built with:

- **Node.js** + **`ws`** for the WebSocket server
- **Vanilla HTML/CSS/JS** for the browser client

It demonstrates how to use **WebSockets as an inter‑process communication (IPC) mechanism** between a browser (client process) and a Node.js server process.

---

### Architecture

- **Server (`server/server.js`)**
  - Starts a WebSocket server on port **8080** using the `ws` library.
  - Accepts connections from multiple clients.
  - For every message received:
    - Parses the JSON payload `{ user: string, text: string }`.
    - Logs it to the server console.
    - Broadcasts it to all connected clients (simple pub/sub pattern).
  - Handles invalid JSON and basic error cases gracefully.

- **Client (`client/`)**
  - `index.html` defines:
    - A **login screen** where a user picks a username.
    - A **chat screen** with:
      - Top bar showing the app name, current user, and connection status.
      - Scrollable message list.
      - Input bar with text field and **Send** button.
  - `style.css` provides a **modern dark UI**:
    - Glassmorphism card for login.
    - Rounded chat window with message bubbles.
    - Responsive layout that works well on smaller screens.
  - `script.js` implements client behavior:
    - Connects to `ws://localhost:8080` after the user joins.
    - Uses the username from the login screen for all outgoing messages.
    - Sends messages as JSON over the WebSocket.
    - Renders incoming messages as left/right aligned bubbles depending on sender.
    - Shows connection state (Connecting / Connected / Disconnected / Error).
    - Supports **Enter to join** and **Enter to send** for efficient keyboard use.

---

### IPC Aspect – Why this is an IPC-style Chat

Although this runs over TCP and HTTP infrastructure, the **browser and the Node.js server are separate processes** that communicate via **WebSockets**, which:

- Provide a **full‑duplex channel** between processes.
- Allow both sides to **push** messages at any time (not just request/response).
- Use a simple **message protocol** (JSON payloads in this case).

In that sense, the WebSocket connection functions as a **long‑lived IPC channel** between:

- A **client process** (browser JavaScript runtime), and
- A **server process** (Node.js + `ws`).

This is conceptually similar to other IPC mechanisms (named pipes, Unix sockets, shared memory, etc.), but implemented on top of WebSocket framing and running across the network.

---

### Getting Started

#### 1. Install dependencies

From the project root:

```bash
npm install
```

This will install the `ws` package used by the server.

#### 2. Run the WebSocket server

From the project root:

```bash
node server/server.js
```

You should see:

```text
WebSocket server running on port 8080
```

#### 3. Serve the client

From the `client` folder, you can use any static file server. For example:

```bash
npx serve
```

Then open the printed URL (often `http://localhost:3000` or similar) in your browser.

---

### Usage

1. Open the client in the browser.
2. Enter a **username** and click **“Join chat”** (or press Enter).
3. Start typing messages in the input field and press **Enter** or click **Send**.
4. Open the client in another browser tab or another machine pointing to the same server to see **multi‑user realtime chat**.

Messages from:

- **You** appear on the **right** with your username and timestamp.
- **Others** appear on the **left**.

Connection state is always visible in the top‑right status pill.

---

### Extending the Project

Ideas for further, IPC-related improvements:

- Add **rooms/channels** (room id in the message payload).
- Add **user presence** and **“user joined / left”** notifications.
- Introduce a **message type field** (`type: "chat" | "system" | "typing" | ...`) in the JSON payload.
- Persist chat history with a database and send the last N messages on connect.

This codebase intentionally stays small and readable so it can serve as a clear reference for **WebSocket‑based IPC chat**.

# Chat-application-using-ipc-sockets