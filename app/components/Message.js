import ReactMarkdown from 'react-markdown';
import { dark } from "react-syntax-highlighter/src/styles/hljs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const Message = ({ message, isUser }) => {
  let containerClass = "bg-gray-50";
  if (isUser) {
    containerClass = "";
  }

  if (Array.isArray(message)) {
    message = message.join("");
  }

  if (!message || message === "") {
    return null;
  }

  return (
    <div className={`flex gap-x-4 rounded-md ${containerClass} py-5 px-5`}>
      {isUser ? (
        <span className="text-xl sm:text-2xl" title="user">
          🥸
        </span>
      ) : (
        <span className="text-xl sm:text-2xl" title="AI">
          🦙
        </span>
      )}

      <div className="flex flex-col text-sm sm:text-base flex-1 gap-y-4 mt-1">
        <ReactMarkdown
          components={{
            code(props) {
              const { children, className, node, ...rest } = props
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  language={match[1]}
                  style={dark}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              )
            }
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;
