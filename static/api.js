async function postRequest() {
    return await fetch("/gpt4", {
      method: "POST",
      body: JSON.stringify({
        messages: messages,
        model_type: modelName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  
  async function handleResponse(response, messageText) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let assistantMessage = "";
  
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        messages.push({
          role: "assistant",
          content: assistantMessage,
        });
        break;
      }
  
      const text = decoder.decode(value);
      assistantMessage += text;
      messageText.innerHTML = window.renderMarkdown(assistantMessage).trim();
      highlightCode(messageText);
      autoScroll();
    }
  }