import { Fragment } from "react";

const Message = ({ message, isUser }) => {
  let containerClass = "mt-5 bg-green-200 p-5 rounded-md";
  if (isUser) {
    containerClass = "mt-5 bg-gray-100 p-5 rounded-md";
  }

  if (Array.isArray(message)) {
    message = message.join("");
  }

  return (
    <div className="">
      <div>
        {message &&
          message.split("\n").map((text, index) => (
            <div class="">
              <div className={containerClass} key={index}>
                {text}
                <br />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Message;
