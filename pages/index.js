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

const VERSIONS = [
  {
    name: "Llama 2 7B",
    version: "4b0970478e6123a0437561282904683f32a9ed0307205dc5db2b5609d6a2ceff",
  },
  {
    name: "Llama 2 13B",
    version: "d5da4236b006f967ceb7da037be9cfc3924b20d21fed88e1e94f19d56e2d3111",
  },
  {
    name: "Llama 2 70B",
    version: "2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
  },
];

export default function Home() {
  const MAX_TOKENS = 4096;
  const bottomRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [eventSource, setEventSource] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [error, setError] = useState(null);

  //   Llama params
  const [size, setSize] = useState(VERSIONS[2]); // default to 13B
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant. You do not respond as 'User' or pretend to be 'User'. You only respond once as Assistant."
  );
  const [temp, setTemp] = useState(0.75);
  const [topP, setTopP] = useState(1);
  const [maxTokens, setMaxTokens] = useState(800);

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
        version: size.version,
        prompt: `${prompt}
Assistant:`,
        systemPrompt: systemPrompt,
        temperature: parseFloat(temp),
        topP: parseFloat(topP),
        maxTokens: parseInt(maxTokens),
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
          href="https://github.com/replicate/chat"
        >
          Clone
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
        <div className="text-center mt-2">
          <button
            className="hover:underline text-sm text-gray-500"
            onClick={() => setOpen(true)}
          >
            {size.name}
          </button>
        </div>

        {messages.length == 0 && (
          <EmptyState setPrompt={setPrompt} setOpen={setOpen} />
        )}

        <SlideOver
          open={open}
          setOpen={setOpen}
          systemPrompt={systemPrompt}
          handleSubmit={handleSettingsSubmit}
          temp={temp}
          setTemp={setTemp}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          topP={topP}
          setTopP={setTopP}
          versions={VERSIONS}
          size={size}
          setSize={setSize}
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
          {loading ? (
            <LoadingChatLine />
          ) : (
            <Message message={currentMessage} isUser={false} />
          )}
          <div ref={bottomRef} />
        </article>
      </main>
    </>
  );
}
