import { Fragment } from "react";

const Message = ({ message, isUser }) => {
  let containerClass = "mt-5 bg-gray-200 p-5 rounded-lg";
  if (isUser) {
    containerClass = "mt-5 bg-green-200 p-5 rounded-lg";
  }

  return (
    <div className={containerClass}>
      {message.join("").split("\n").map((text, index) => (
        <Fragment key={index}>
          {text}
          <br />
        </Fragment>
      ))}
    </div>
  );
};

export default Message;
