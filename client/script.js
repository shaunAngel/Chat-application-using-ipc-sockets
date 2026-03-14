let socket = null
let username = ""

const loginScreen = document.getElementById("login-screen")
const chatScreen = document.getElementById("chat-screen")

const usernameInput = document.getElementById("usernameInput")
const joinBtn = document.getElementById("joinBtn")

const messageInput = document.getElementById("messageInput")
const sendBtn = document.getElementById("sendBtn")
const emojiToggle = document.getElementById("emojiToggle")
const emojiPanel = document.getElementById("emojiPanel")

const messages = document.getElementById("messages")
const connectionStatus = document.getElementById("connectionStatus")
const chatUser = document.getElementById("chatUser")

joinBtn.onclick = handleJoin
sendBtn.onclick = sendMessage
emojiToggle.onclick = toggleEmojiPanel

usernameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleJoin()
    }
})

messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        if(!emojiPanel.classList.contains("open")){
            sendMessage()
        }
    }
})

document.addEventListener("click", (e) => {
    if(!emojiPanel) return
    if(!emojiPanel.contains(e.target) && e.target !== emojiToggle){
        emojiPanel.classList.remove("open")
        emojiPanel.setAttribute("aria-hidden","true")
    }
})

function handleJoin(){
    username = usernameInput.value.trim()

    if(username === ""){
        usernameInput.focus()
        return
    }

    loginScreen.style.display = "none"
    chatScreen.style.display = "flex"

    chatUser.textContent = username

    connect()
}

function connect(){
    socket = new WebSocket("ws://localhost:8080")

    setStatus("Connecting…", "status")
    sendBtn.disabled = true

    socket.onopen = () => {
        setStatus("Connected", "status connected")
        sendBtn.disabled = false
        addSystemMessage("You joined the room as " + username)
    }

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if(!data || !data.user) return

        const side = data.user === username ? "right" : "left"
        addMessage(data.user, data.text, side)
    }

    socket.onerror = () => {
        setStatus("Error", "status error")
    }

    socket.onclose = () => {
        setStatus("Disconnected", "status")
        sendBtn.disabled = true
        addSystemMessage("Connection closed. Refresh the page to reconnect.")
    }
}

function setStatus(text, className){
    connectionStatus.textContent = text
    connectionStatus.className = className
}

function sendMessage(){
    const text = messageInput.value.trim()

    if(text === "") return
    if(!socket || socket.readyState !== WebSocket.OPEN) return

    const message = {
        user: username,
        text: text
    }

    socket.send(JSON.stringify(message))

    messageInput.value = ""
    messageInput.focus()
}

function toggleEmojiPanel(){
    if(!emojiPanel) return
    const isOpen = emojiPanel.classList.contains("open")
    if(isOpen){
        emojiPanel.classList.remove("open")
        emojiPanel.setAttribute("aria-hidden","true")
    }else{
        emojiPanel.classList.add("open")
        emojiPanel.setAttribute("aria-hidden","false")
        emojiPanel.focus?.()
    }
}

emojiPanel?.addEventListener("click", (e) => {
    const target = e.target
    if(!(target instanceof HTMLElement)) return
    if(target.classList.contains("emoji-item")){
        const emoji = target.textContent || ""
        const start = messageInput.selectionStart || messageInput.value.length
        const end = messageInput.selectionEnd || messageInput.value.length
        const value = messageInput.value
        messageInput.value = value.slice(0, start) + emoji + value.slice(end)
        const newPos = start + emoji.length
        messageInput.setSelectionRange(newPos, newPos)
        messageInput.focus()
    }
})

function addMessage(user, text, side){
    const wrapper = document.createElement("div")
    wrapper.className = "message " + side

    const header = document.createElement("div")
    header.className = "message-header"

    const nameSpan = document.createElement("span")
    nameSpan.className = "message-username"
    nameSpan.textContent = user

    const timeSpan = document.createElement("span")
    timeSpan.className = "message-time"
    timeSpan.textContent = formatTime(new Date())

    header.appendChild(nameSpan)
    header.appendChild(timeSpan)

    const textDiv = document.createElement("div")
    textDiv.className = "message-text"
    textDiv.textContent = text

    wrapper.appendChild(header)
    wrapper.appendChild(textDiv)

    messages.appendChild(wrapper)

    messages.scrollTop = messages.scrollHeight
}

function addSystemMessage(text){
    const div = document.createElement("div")
    div.className = "message system"
    div.textContent = text
    messages.appendChild(div)
    messages.scrollTop = messages.scrollHeight
}

function formatTime(date){
    const h = date.getHours().toString().padStart(2,"0")
    const m = date.getMinutes().toString().padStart(2,"0")
    return h + ":" + m
}