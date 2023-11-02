import ReactMarkdown from 'react-markdown';
import {dark} from "react-syntax-highlighter/src/styles/hljs";
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
            children={message}
            components={{
              code(props) {
                const {children, className, node, ...rest} = props
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                    <SyntaxHighlighter
                        {...rest}
                        PreTag="div"
                        children={String(children).replace(/\n$/, '')}
                        language={match[1]}
                        style={dark}
                    />
                ) : (
                    <code {...rest} className={className}>
                      {children}
                    </code>
                )
              }
            }}
        />
      </div>
    </div>
  );
};

export default Message;
