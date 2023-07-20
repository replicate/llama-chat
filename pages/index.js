import { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import ChatForm from "./components/ChatForm";
import Message from "./components/Message";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = e.target.prompt.value;

    const messageHistory = [...messages, {
      text: userMessage,
      isUser: true
    }]

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
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
  };

  useEffect(() => {
    if (prediction?.status === "succeeded") {
      setMessages([...messages, {
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
        {prediction && (
          <>
            {prediction.output && (
              <Message message={prediction.output} isUser={false} />
            )}
            <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
          </>
        )}
      </div>
    </div>
  );
}
