"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import ChatForm from "./components/ChatForm";
import Message from "./components/Message";
import SlideOver from "./components/SlideOver";
import EmptyState from "./components/EmptyState";
import QueuedSpinner from "./components/QueuedSpinner";
import CallToAction from "./components/CallToAction";
import Dropdown from "./components/Dropdown";
import { Cog6ToothIcon, CodeBracketIcon } from "@heroicons/react/20/solid";
import { useCompletion } from "ai/react";
import { Toaster, toast } from "react-hot-toast";
import { LlamaTemplate, Llama3Template } from "../src/prompt_template";
import { Turnstile } from "@marsidev/react-turnstile";

import { countTokens } from "./src/tokenizer.js";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const MODELS = [
  {
    id: "meta/meta-llama-3.1-405b-instruct",
    name: "Meta Llama 3.1 405B",
    shortened: "405B",
    emoji: "🦙",
    description: "The most accurate, powerful next generation Llama.",
    new: true,
  },
  {
    id: "meta/meta-llama-3-70b-instruct",
    name: "Meta Llama 3 70B",
    shortened: "70B",
    emoji: "🦙",
    description: "The strong, flexible medium-size Llama.",
    new: true,
  },
  {
    id: "meta/meta-llama-3-8b-instruct",
    name: "Meta Llama 3 8B",
    shortened: "8B",
    emoji: "🦙",
    description: "The fastest and cheapest Llama.",
    new: true,
  },
  {
    id: "meta/llama-2-70b-chat",
    name: "Meta Llama 2 70B",
    shortened: "70B",
    emoji: "🦙",
    description: "The most accurate, powerful Llama 2",
  },
  {
    id: "meta/llama-2-13b-chat",
    name: "Meta Llama 2 13B",
    shortened: "13B",
    emoji: "🦙",
    description: "Faster and cheaper Llama 2 at the expense of accuracy.",
  },
  {
    id: "meta/llama-2-7b-chat",
    name: "Meta Llama 2 7B",
    shortened: "7B",
    emoji: "🦙",
    description: "The smallest, fastest Llama 2 chat model.",
  },
];

const llamaTemplate = LlamaTemplate();
const llama3Template = Llama3Template();

const generatePrompt = (template, systemPrompt, messages) => {
  const chat = messages.map((message) => ({
    role: message.isUser ? "user" : "assistant",
    content: message.text,
  }));

  return template([
    {
      role: "system",
      content: systemPrompt,
    },
    ...chat,
  ]);
};

const metricsReducer = (state, action) => {
  switch (action.type) {
    case "START":
      return { startedAt: new Date() };
    case "FIRST_MESSAGE":
      return { ...state, firstMessageAt: new Date() };
    case "COMPLETE":
      return { ...state, completedAt: new Date() };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
};

export default function HomePage() {
  const MAX_TOKENS = 8192;
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(false);

  // Cloudflare Turnstile
  const [didPassChallenge, setDidPassChallenge] = useState(false);
  const [turnstileStatus, setTurnstileStatus] = useState("pending"); // 'pending', 'passed', 'failed'
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [turnstileIdempotencyKey, setTurnstileIdempotencyKey] = useState(() => {
    // Check if running in a browser environment
    if (typeof window !== "undefined") {
      return (
        sessionStorage.getItem("turnstileIdempotencyKey") || crypto.randomUUID()
      );
    }
    return crypto.randomUUID(); // Fallback if not in browser
  });

  // Save the idempotency key to session storage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "turnstileIdempotencyKey",
        turnstileIdempotencyKey
      );
    }
  }, [turnstileIdempotencyKey]);

  const turnstileRef = useRef(null);

  const handleTurnstileSuccess = () => {
    setTurnstileStatus("passed");
    setTurnstileToken(turnstileRef.current.getResponse());
    setDidPassChallenge(true);
  };

  const handleTurnstileError = () => {
    setTurnstileStatus("failed");
  };

  const handleTurnstileExpire = () => {
    setTurnstileStatus("expired");
  };

  const retryTurnstile = () => {
    setTurnstileStatus("pending");
    turnstileRef.current?.reset();
  };

  //   Llama params
  const [model, setModel] = useState(MODELS[0]); // default to 405B
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant."
  );
  const [temp, setTemp] = useState(0.75);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(800);

  //  Llava params
  const [image, setImage] = useState(null);

  // Salmonn params
  const [audio, setAudio] = useState(null);

  const [metrics, dispatch] = useReducer(metricsReducer, {
    startedAt: null,
    firstMessageAt: null,
    completedAt: null,
  });

  const { complete, completion, setInput, input } = useCompletion({
    api: "/api",
    body: {
      model: model.id,
      systemPrompt: systemPrompt,
      temperature: parseFloat(temp),
      topP: parseFloat(topP),
      maxTokens: parseInt(maxTokens),
      image: image,
      audio: audio,
      token: turnstileToken,
      idempotencyKey: turnstileIdempotencyKey,
    },
    onError: (e) => {
      const errorText = e.toString();
      console.error(`Error converted to text: ${errorText}`);
      setError(e);
    },
    onResponse: (response) => {
      setStarting(false);
      setError(null);
      dispatch({ type: "FIRST_MESSAGE" });
    },
    onFinish: () => {
      dispatch({ type: "COMPLETE" });
    },
  });

  const handleFileUpload = (file) => {
    if (file) {
      // determine if file is image or audio
      if (
        ["audio/mpeg", "audio/wav", "audio/ogg"].includes(
          file.originalFile.mime
        )
      ) {
        setAudio(file.fileUrl);
        setModel(MODELS[4]);
        toast.success(
          "You uploaded an audio file, so you're now speaking with Salmonn."
        );
      } else if (["image/jpeg", "image/png"].includes(file.originalFile.mime)) {
        setImage(file.fileUrl);
        setModel(MODELS[3]);
        toast.success(
          "You uploaded an image, so you're now speaking with Llava."
        );
      } else {
        toast.error(
          `Sorry, we don't support that file type (${file.originalFile.mime}) yet. Feel free to push a PR to add support for it!`
        );
      }
    }
  };

  const setAndSubmitPrompt = (newPrompt) => {
    handleSubmit(newPrompt);
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    setOpen(false);
    setSystemPrompt(event.target.systemPrompt.value);
  };

  const handleSubmit = async (userMessage) => {
    setStarting(true);
    const SNIP = "<!-- snip -->";

    const messageHistory = [...messages];
    if (completion.length > 0) {
      messageHistory.push({
        text: completion,
        isUser: false,
      });
    }
    messageHistory.push({
      text: userMessage,
      isUser: true,
    });

    // Generate initial prompt and calculate tokens
    let prompt = `${generatePrompt(
      model.name.includes("Llama 3") ? llama3Template : llamaTemplate,
      systemPrompt,
      messageHistory
    )}\n`;

    console.log(prompt);

    // Check if we exceed max tokens and truncate the message history if so.
    while (countTokens(prompt) > MAX_TOKENS) {
      if (messageHistory.length < 3) {
        setError(
          "Your message is too long. Please try again with a shorter message."
        );

        return;
      }

      // Remove the third message from history, keeping the original exchange.
      messageHistory.splice(1, 2);

      // Recreate the prompt
      prompt = `${SNIP}\n${generatePrompt(
        llamaTemplate,
        systemPrompt,
        messageHistory
      )}\n`;
    }

    setMessages(messageHistory);

    dispatch({ type: "START" });

    complete(prompt);
  };

  useEffect(() => {
    if (messages?.length > 0 || completion?.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, completion]);

  return (
    <>
      {turnstileStatus === "failed" && (
        <dialog className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-0 m-0 w-full h-full z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 m-auto">
            <p>
              Uh oh, we had trouble figuring out if you&apos;re human... Please
              try again.
            </p>
            <button
              className="bg-black mt-2 hover:bg-gray-800 text-white rounded-md inline-block px-5 py-3"
              onClick={() => retryTurnstile()}
            >
              Retry
            </button>
          </div>
        </dialog>
      )}

      <CallToAction />
      <nav className="sm:pt-8 pt-4 px-4 sm:px-12 flex items-center">
        <div className="pr-3 font-semibold text-gray-500">Chat with</div>
        <div className="font-semibold text-gray-500 sm:text-center">
          <Dropdown models={MODELS} selectedModel={model} setModel={setModel} />
        </div>
        <div className="flex-grow"></div>
        <div className="justify-end">
          <a
            className="inline-flex items-center px-3 py-2 mr-3 text-sm font-semibold text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            href="https://github.com/replicate/chat"
          >
            <CodeBracketIcon
              className="w-5 h-5 text-gray-500 sm:mr-2 group-hover:text-gray-900"
              aria-hidden="true"
            />{" "}
            <span className="hidden sm:inline">Clone on GitHub</span>
          </a>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => setOpen(true)}
          >
            <Cog6ToothIcon
              className="w-5 h-5 text-gray-500 sm:mr-2 group-hover:text-gray-900"
              aria-hidden="true"
            />{" "}
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </nav>

      <Toaster position="top-left" reverseOrder={false} />

      <main className="max-w-2xl pb-5 mx-auto mt-8 sm:px-4">
        <div className="text-center"></div>

        <SlideOver
          open={open}
          setOpen={setOpen}
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          handleSubmit={handleSettingsSubmit}
          temp={temp}
          setTemp={setTemp}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          topP={topP}
          setTopP={setTopP}
          models={MODELS}
          size={model}
          setSize={setModel}
        />

        <ChatForm
          prompt={input}
          setPrompt={setInput}
          onSubmit={handleSubmit}
          handleFileUpload={handleFileUpload}
          completion={completion}
          metrics={metrics}
          disabled={!didPassChallenge}
        />

        {error && <div className="text-red-500">{error.toString()}</div>}

        <article className="pb-24">
          {!didPassChallenge ? (
            <div className="my-12">
              <p className="mb-2 animate-pulse">Checking if you are human...</p>
              <Turnstile
                id="turnstile-widget"
                ref={turnstileRef}
                options={{
                  theme: "light",
                }}
                siteKey={TURNSTILE_SITE_KEY}
                onSuccess={handleTurnstileSuccess}
                onError={handleTurnstileError}
                onExpire={handleTurnstileExpire}
              />
            </div>
          ) : (
            <EmptyState setPrompt={setAndSubmitPrompt} setOpen={setOpen} />
          )}

          {messages.map((message, index) => (
            <Message
              key={`message-${index}`}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
          <Message message={completion} isUser={false} />

          {starting && <QueuedSpinner />}

          <div ref={bottomRef} />
        </article>
      </main>
    </>
  );
}
