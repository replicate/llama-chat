const ChatForm = ({ prompt, setPrompt, onSubmit }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    onSubmit(event.target.prompt.value);
    setPrompt("");
    event.target.reset();
  };

  return (
    <footer className="z-10 fixed bottom-0 left-0 right-0 bg-slate-100 border-t-2">
      <div className="container max-w-2xl mx-auto p-5 pb-8">
        <form className="w-full flex" onSubmit={handleSubmit}>
          <input
            type="text"
            autoFocus={true}
            name="prompt"
            className="flex-grow rounded-l-md focus:outline-none outline-none focus:ring-0 focus:ring-offset-0"
            placeholder="Send a message"
            required={true}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button className="button" type="submit">
            Chat
          </button>
        </form>
      </div>
    </footer>
  );
};

export default ChatForm;
