export const LlamaTemplate = (defaultSystemPrompt = "") => {
    return function (chat) {
        let systemPrompt = defaultSystemPrompt;

        let parts = [];
        for (let turn of chat) {
            if (turn.role === "system") {
                systemPrompt = turn.content;
                continue;
            }

            if (turn.role === "user") {
                if (systemPrompt !== "") {
                    parts.push("<s>[INST] <<SYS>>\n" + systemPrompt + "\n<</SYS>>\n\n" + turn.content + " [/INST]");
                    systemPrompt = "";
                } else {
                    parts.push("<s>[INST] " + turn.content + " [/INST]");
                }
            }

            if (turn.role === "assistant") {
                parts.push(" " + turn.content + " </s>");
            }
        }

        return parts.join("");
    };
};
