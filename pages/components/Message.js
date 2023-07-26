import { Fragment } from "react";

const Message = ({ message, isUser }) => {
  let containerClass = "mt-5 bg-green-200 p-5 rounded-t-xl rounded-bl-xl";
  if (isUser) {
    containerClass = "mt-5 bg-gray-100 p-5 rounded-t-xl rounded-br-xl";
  }

  console.log({ message });

  if (Array.isArray(message)) {
    message = message.join("");
  }

  return (
    <div className="">
      <div className={containerClass}>
        {message &&
          message.split("\n").map((text, index) => (
            <Fragment key={index}>
              {text}
              <br />
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default Message;
