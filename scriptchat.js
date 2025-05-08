const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler  = document.querySelector(".chatbot-toggler");

let userMessage;
const inputHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing"   ? `<p>${message}</p>` : `<span><img src="icon.avif" alt="Q-Bot Logo" /></span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const handlechat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatInput.value = "";

    const loading = createChatLi("Cooking for the best reply...", "incoming")

    chatbox.appendChild(loading)
    chatbox.scrollTop = chatbox.scrollHeight;

    setTimeout(() => {
        loading.querySelector("p").innerText = "This is a demo text for simulations and testing purposes!"
        chatbox.scrollTop = chatbox.scrollHeight;
    }, 1000);

}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handlechat();
    }    
})

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
sendChatBtn.addEventListener("click",  handlechat)