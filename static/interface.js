const chatMessagesDiv = document.getElementById("chat-messages");
const userInputElem = document.getElementById("user-input");
const settingsButton = document.getElementById("settings-toggle");
const settingsDropdown = document.querySelector(".settings-dropdown");
const modelToggle = document.getElementById("model-toggle");
const modelLabel = document.getElementById("model-label");

// State variables
let modelName = modelToggle.checked ? "gpt-4" : "gpt-3.5-turbo";
let messages = [];
let systemMessageRef = null;
let autoScrollState = true;

// Event listener functions
function handleModelToggle() {
  if (modelToggle.checked) {
    modelLabel.textContent = "GPT-4";
    modelName = "gpt-4";
  } else {
    modelLabel.textContent = "GPT-3.5";
    modelName = "gpt-3.5-turbo";
  }
}

// function closeDropdown(event) {
//   const clickInsideDropdown = settingsDropdown.contains(event.target);
//   const clickOnSettingsButton = settingsButton.contains(event.target);
  
//   if (!clickInsideDropdown && !clickOnSettingsButton) {
//     settingsDropdown.style.display = "none";
//   } else if (clickOnSettingsButton) {
//     toggleDropdownDisplay();
//   }
// }

// function toggleDropdownDisplay() {
//   settingsDropdown.style.display =
//     settingsDropdown.style.display === "block" ? "none" : "block";
// }

function handleInputKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    document.getElementById("submitBtn").click();
  }
}

function autoScroll() {
  if (autoScrollState) {
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
  }
}

// Event listeners for functions above
modelToggle.addEventListener("change", handleModelToggle);
// document.addEventListener("click", closeDropdown);
document.getElementById("user-input").addEventListener("keydown", handleInputKeydown);

document;
chatMessagesDiv.addEventListener("scroll", function () {
  const isAtBottom =
    chatMessagesDiv.scrollHeight - chatMessagesDiv.clientHeight <=
    chatMessagesDiv.scrollTop + 1;

  autoScrollState = isAtBottom;
});

window.renderMarkdown = function (content) {
  const md = new markdownit();
  return md.render(content);
};

function highlightCode(element) {
  const codeElements = element.querySelectorAll("pre code");
  codeElements.forEach((codeElement) => {
    hljs.highlightElement(codeElement);
  });
}

function addMessageToDiv(role, content = "") {
  let messageDiv = document.createElement("div");
  messageDiv.className =
    role === "user" ? "message user-message" : "message assistant-message";

  let messageText = document.createElement("p");
  messageDiv.appendChild(messageText);

  if (content) {
    let renderedContent = window.renderMarkdown(content).trim();
    messageText.innerHTML = renderedContent;
    highlightCode(messageDiv);
  }

  chatMessagesDiv.appendChild(messageDiv);
  autoScroll();

  return messageText;
}