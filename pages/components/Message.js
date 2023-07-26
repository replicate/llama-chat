import { Fragment } from "react";

const Message = ({ message, isUser }) => {
  let containerClass = "";
  if (isUser) {
    containerClass = "";
  }

  console.log({ message });

  if (Array.isArray(message)) {
    message = message.join("");
  }

  return (
    <div className="">
      <ul className="divide-y divide-gray-300">
        {message &&
          message.split("\n").map((text, index) => (
            <li key={index} className="flex gap-x-4 py-5 border-b">
              <div className="text-2xl"> {isUser ? "👤" : "🦙"}</div>

              <div className="min-w-0">
                <p className="mt-1">{text}</p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Message;
