const Message = ({ message, isUser }) => {
  let containerClass = "bg-gray-50";
  if (isUser) {
    containerClass = "bg-gray-100";
  }

  if (Array.isArray(message)) {
    message = message.join("");
  }

  if (!message || message === "") {
    return null;
  }

  return (
    <div className={`flex gap-x-4 mb-2 ${containerClass} rounded-lg py-5 px-5`}>
      {isUser ? (
        <span className="text-2xl" title="user">
          🥸
        </span>
      ) : (
        <span className="text-2xl" title="AI">
          🦙
        </span>
      )}

      <div className="flex flex-col flex-1 gap-y-4 mt-1">
        {message.split("\n").map(
          (text, index) =>
            text.length > 0 && (
              <span key={index} className="min-w-0">
                {text}
              </span>
            )
        )}
      </div>
    </div>
  );
};

export default Message;
