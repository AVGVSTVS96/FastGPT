function updateSystemMessage(systemMessage) {
  if (
    systemMessage &&
    (!systemMessageRef || systemMessage !== systemMessageRef.content)
  ) {
    let systemMessageIndex = messages.findIndex((message) => message.role === "system");
    // If the system message exists in array, remove it
    if (systemMessageIndex !== -1) {
      messages.splice(systemMessageIndex, 1);
    }
    systemMessageRef = { role: "system", content: systemMessage };
    messages.push(systemMessageRef);
  }
}

window.onload = function () {
  document.getElementById("chat-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    let userInput = userInputElem.value.trim();
    let systemMessage = document.getElementById("system-message").value.trim();

    updateSystemMessage(systemMessage);

    messages.push({ role: "user", content: userInput });
    addMessageToDiv("user", userInput);
    userInputElem.value = "";

    let messageText = addMessageToDiv("assistant");

    const response = await postRequest();

    handleResponse(response, messageText);
  });
};
