import { useEffect, useRef, useReducer, useState } from "react";
import Head from "next/head";
import ChatForm from "./components/ChatForm";
import Message from "./components/Message";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [eventSource, setEventSource] = useState(null);

  const [currentMessage, dispatchCurrentMessage] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "append":
          return { ...state, buffer: state.buffer + action.payload };
        case "display":
          return {
            ...state,
            displayed: state.displayed + state.buffer[state.displayed.length],
          };
        case "reset":
          return { buffer: "", displayed: "" };
        default:
          throw new Error();
      }
    },
    { buffer: "", displayed: "" }
  );
  const intervalRef = useRef(null);

  const [error, setError] = useState(null);

  const handleSubmit = async (userMessage) => {
    if (eventSource) {
      eventSource.close();
    }

    const messageHistory = messages;
    if (currentMessage.buffer.length > 0) {
      messageHistory.push({
        text: currentMessage.buffer,
        isUser: false,
      });
    }
    messageHistory.push({
      text: userMessage,
      isUser: true,
    });
    setMessages(messageHistory);

    const messageHistoryPrompt = messageHistory
      .map((message) => {
        if (message.isUser) {
          return `User: ${message.text}`;
        } else {
          return `Assistant: ${message.text}`;
        }
      })
      .join("\n");

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `${messageHistoryPrompt}
Assistant:`,
      }),
    });

    const prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);
  };

  useEffect(() => {
    if (!prediction?.urls?.stream) {
      return;
    }

    const source = new EventSource(prediction.urls.stream);
    source.addEventListener("output", (e) => {
      console.log("output", e);
      dispatchCurrentMessage({ type: "append", payload: e.data });
    });
    source.addEventListener("error", (e) => {
      source.close();
      setError(e.message);
    });
    setEventSource(source);

    dispatchCurrentMessage({ type: "reset" });

    return () => {
      source.close();
      clearInterval(intervalRef.current);
    };
  }, [prediction]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (currentMessage.displayed.length < currentMessage.buffer.length) {
        dispatchCurrentMessage({ type: "display" });
      } else {
        clearInterval(intervalRef.current);
      }
    }, 5);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [currentMessage.buffer, currentMessage.displayed.length]);

  return (
    <div className="container max-w-2xl mx-auto p-5">
      <Head>
        <title>Llama Chat</title>
      </Head>

      <h1 className="py-6 text-center font-bold text-2xl">
        Chat with a{" "}
        <a href="https://replicate.com/a16z-infra/llama13b-v2-chat">Llama</a>
      </h1>

      <ChatForm onSubmit={handleSubmit} />

      {error && <div>{error}</div>}

      <div className="pb-24">
        {messages.map((message, index) => (
          <Message
            key={`message-${index}`}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
        {currentMessage.displayed && currentMessage.displayed.length > 0 && (
          <Message message={currentMessage.displayed} isUser={false} />
        )}
      </div>
    </div>
  );
}
