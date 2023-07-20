import { Fragment } from "react";

const Message = ({ message }) => {
  return (
    <div className="mt-5">
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
