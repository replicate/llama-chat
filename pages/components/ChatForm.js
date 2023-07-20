const ChatForm = ({ onSubmit }) => {
  return (
    <form className="w-full flex" onSubmit={onSubmit}>
      <input
        type="text"
        className="flex-grow"
        name="prompt"
      />
      <button className="button" type="submit">
        Send
      </button>
    </form>
  );
};

export default ChatForm;
