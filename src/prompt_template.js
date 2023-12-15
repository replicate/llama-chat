export const MistralTemplate = () => {
  return function (chat) {
    let parts = ["<s>"];
    for (let i = 0; i < chat.length; i++) {
      let turn = chat[i];

      if (turn.role === "user") {
        parts.push("[INST] " + turn.content + " [/INST]");
      }

      if (turn.role === "assistant") {
        parts.push(turn.content);
        parts.push("</s> ");
      }
    }

    return parts.join("");
  };
};
