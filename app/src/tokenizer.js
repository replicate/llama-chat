import llamaTokenizer from "llama-tokenizer-js";

export const countTokens = (text) => {
    return llamaTokenizer.encode(text).length;
};
