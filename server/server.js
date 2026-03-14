const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 8080 })

console.log("WebSocket server running on port 8080")

wss.on("connection", (ws) => {

  console.log("client connected")

  ws.on("message", (data) => {
    let msg
    try {
      msg = JSON.parse(data.toString())
    } catch (e) {
      console.error("Received invalid JSON:", e)
      return
    }

    if (!msg || typeof msg.user !== "string" || typeof msg.text !== "string") {
      console.warn("Ignoring malformed message:", msg)
      return
    }

    console.log(msg.user + ": " + msg.text)

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg))
      }
    })
  })

  ws.on("close", () => {
    console.log("client disconnected")
  })

  ws.on("error", (err) => {
    console.error("WebSocket error:", err)
  })

})