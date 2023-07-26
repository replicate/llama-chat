const Message = ({ message, isUser }) => {

  console.log({ message });

  if (Array.isArray(message)) {
    message = message.join("");
  }

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
    </div>
  );
};

export default Message;
