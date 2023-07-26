import { useRef, useEffect } from "react";

const Message = ({ message, isUser }) => {
  const bottomEl = useRef(null);

  const scrollToBottom = () => {
    bottomEl?.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log({ message });

  if (Array.isArray(message)) {
    message = message.join("");
  }

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className=" border-b">
      <ul className="">
        {message &&
          message.split("\n").map((text, index) => (
            <li key={index} className="flex gap-x-4 py-5">
              <div className="text-2xl"> {isUser ? "👤" : "🦙"}</div>

              <div className="min-w-0">
                <p className="mt-1">{text}</p>
              </div>
            </li>
          ))}
      </ul>
      <div ref={bottomEl}></div>
    </div>
  );
};

export default Message;
