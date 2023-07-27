import { useEffect, useRef, useReducer, useState } from "react";
import Head from "next/head";
import ChatForm from "./components/ChatForm";
import Message from "./components/Message";
import SlideOver from "./components/SlideOver";
import EmptyState from "./components/EmptyState";
import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import LoadingChatLine from "./components/LoadingChatLine";

function approximateTokenCount(text) {
  return Math.ceil(text.length * 0.4);
}

export default function Home() {
  const MAX_TOKENS = 4096;
  const bottomRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);

  const [prediction, setPrediction] = useState(null);
  const [eventSource, setEventSource] = useState(null);
  const [open, setOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant. You do not respond as 'User' or pretend to be 'User'. You only respond once as Assistant."
  );
  const [temp, setTemp] = useState(0.75);
  const [loading, setLoading] = useState(false);

  const [currentMessage, setCurrentMessage] = useState("");

  const [error, setError] = useState(null);

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    setOpen(false);
    setSystemPrompt(event.target.systemPrompt.value);
  };

  const handleSubmit = async (userMessage) => {
    setLoading(true);

    const SNIP = "<!-- snip -->";

    if (eventSource) {
      eventSource.close();
    }

    const messageHistory = [...messages];
    if (currentMessage.length > 0) {
      messageHistory.push({
        text: currentMessage,
        isUser: false,
      });
    }
    messageHistory.push({
      text: userMessage,
      isUser: true,
    });

    console.log(messageHistory);

    const generatePrompt = (messages) => {
      return messages
        .map((message) =>
          message.isUser
            ? `User: ${message.text}`
            : `Assistant: ${message.text}`
        )
        .join("\n");
    };

    // Generate initial prompt and calculate tokens
    let prompt = `${generatePrompt(messageHistory)}\nAssistant: `;

    // Check if we exceed max tokens and truncate the message history if so.
    while (approximateTokenCount(prompt) > MAX_TOKENS) {
      if (messageHistory.length < 3) {
        setError(
          "Your message is too long. Please try again with a shorter message."
        );

        return;
      }

      // Remove the third message from history, keeping the original exchange.
      messageHistory.splice(1, 2);

      // Recreate the prompt
      prompt = `${SNIP}\n${generatePrompt(messageHistory)}\nAssistant: `;
    }

    setMessages(messageHistory);

    console.log("temp is ", temp);

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `${prompt}
Assistant:`,
        systemPrompt: systemPrompt,
        temperature: parseFloat(temp),
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

    setCurrentMessage("");

    const source = new EventSource(prediction.urls.stream);
    source.addEventListener("output", (e) => {
      console.log("output", e);
      setLoading(false);
      setCurrentMessage((m) => m + e.data);
    });
    source.addEventListener("error", (e) => {
      console.log("error", e);
      source.close();
      setError(e.message);
    });
    source.addEventListener("done", (e) => {
      console.log("done", e);
      source.close();
    });
    setEventSource(source);

    return () => {
      source.close();
    };
  }, [prediction]);

  useEffect(() => {
    if (messages?.length > 0 || currentMessage?.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentMessage]);

  return (
    <>
      <Head>
        <title>Llama Chat</title>

        <meta property="og:image" content="/og.png" />
        <meta property="og:description" content="Chat with Llama 2" />
        <meta property="twitter:image" content="/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦙</text></svg>"
        />
      </Head>
      <nav className="flex w-full justify-end p-3">
        <a
          className="rounded-md mr-3 inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          href="https://replicate.com/replicate/llama-2-70b-chat?utm_source=project&utm_campaign=llamachat"
        >
          Run Llama
        </a>
        <button
          type="button"
          className="rounded-md inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => setOpen(true)}
        >
          <Cog6ToothIcon
            className="h-5 w-5 text-gray-500 group-hover:text-gray-900"
            aria-hidden="true"
          />{" "}
        </button>
      </nav>

      <main className="max-w-2xl pb-5 px-4 mx-auto">
        <h1 className="text-center font-bold text-2xl">
          Chat with a{" "}
          <a href="https://replicate.com/replicate/llama-2-70b-chat?utm_source=project&utm_compaign=llamachat">
            Llama
          </a>
        </h1>

        {messages.length == 0 && <EmptyState />}

        <SlideOver
          open={open}
          setOpen={setOpen}
          systemPrompt={systemPrompt}
          handleSubmit={handleSettingsSubmit}
          temp={temp}
          setTemp={setTemp}
        />

        <ChatForm
          prompt={prompt}
          setPrompt={setPrompt}
          onSubmit={handleSubmit}
        />

        {error && <div>{error}</div>}

        <article className="pb-24">
          {messages.map((message, index) => (
            <Message
              key={`message-${index}`}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
          {loading && <LoadingChatLine />}
          {currentMessage && currentMessage.length > 0 && (
            <Message message={currentMessage} isUser={false} />
          )}
          <div ref={bottomRef} />
        </article>
      </main>
    </>
  );
}
