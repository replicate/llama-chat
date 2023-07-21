import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import ChatForm from "./components/ChatForm";
import Message from "./components/Message";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [streamingChunks, setStreamingChunks] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (userMessage) => {
    const messageHistory = messages;
    if (streamingChunks.length > 0) {
      messageHistory.push({
        text: streamingChunks.join(""),
        isUser: false
      });
    }
    messageHistory.push({
      text: userMessage,
      isUser: true
    });

    setMessages(messageHistory);

    const messageHistoryPrompt = messageHistory.map((message) => {
      if (message.isUser) {
        return `User: ${message.text}`;
      } else {
        return `Assistant: ${message.text}`;
      }
    }).join("\n");

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

    console.log({ response });
    const prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    setStreamingChunks([]);

    const eventSource = new EventSource(prediction.urls.stream);
    eventSource.addEventListener("open", (e) => {
      console.log("open", e);
    });
    eventSource.addEventListener("message", (e) => {
      console.log("message", e);
      setStreamingChunks(m => [...m, e.data]);
    });
    eventSource.addEventListener("error", (e) => {
      eventSource.close();
    });
  };

  useEffect(() => {
    if (prediction?.status === "succeeded") {
      setMessages(m => [...m, {
        text: prediction.output.join(""),
        isUser: false
      }]);
      setPrediction(null);
    }
  }, [prediction]);

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
          <Fragment key={index}>
            <Message message={message.text} isUser={message.isUser} />
          </Fragment>
        ))}
        {prediction && streamingChunks && (
          <>
            <Message message={streamingChunks} isUser={false} />
            {/* <p className="py-3 text-sm opacity-50">status: {prediction.status}</p> */}
          </>
        )}
      </div>
    </div>
  );
}
