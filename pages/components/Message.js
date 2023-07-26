const Message = ({ message, isUser }) => {
  if (Array.isArray(message)) {
    message = message.join("");
  }

  if (!message || message === "") {
    return null;
  }

  return (
    <div className="flex gap-x-4 py-5 border-b">
      <span className="text-2xl" role="presentation">
        {isUser ? <i title="User">👤</i> : <i title="AI">🦙</i>}
      </span>

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
