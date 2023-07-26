const ChatForm = ({ prompt, setPrompt, onSubmit }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    onSubmit(event.target.prompt.value);
    setPrompt("");
    event.target.reset();
  };

  return (
    <div className="relative">
      <div className="z-10 fixed bottom-0 left-0 right-0 bg-slate-100 border-t-2">
        <div className="container max-w-2xl mx-auto p-5 pb-8">
          <form className="w-full flex" onSubmit={handleSubmit}>
            <input
              onChange={(e) => setPrompt(e.target.value)}
              type="text"
              required="true"
              className="flex-grow rounded-l-md focus:outline-none outline-none focus:ring-0 focus:ring-offset-0"
              name="prompt"
              value={prompt}
            />
            <button className="button" type="submit">
              Chat
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatForm;
