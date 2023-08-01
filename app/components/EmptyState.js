export default function EmptyState({ setOpen, setPrompt }) {
  return (
    <div className="mt-12 sm:mt-24 space-y-6 text-gray-400 text-base mx-8 sm:mx-4 sm:text-2xl leading-12">
      <p>
        {" "}
        Customize Llama&apos;s personality by clicking the{" "}
        <button
          className="prompt-button inline-flex items-center "
          onClick={() => setOpen(true)}
        >
          settings{" "}
        </button>{" "}
        button.
      </p>
      <p>
        I can{" "}
        <button
          className="prompt-button"
          onClick={() =>
            setPrompt(
              "Explain the self-attention mechanism that Transformers use like I'm five."
            )
          }
        >
          explain concepts
        </button>
        , write{" "}
        <button
          className="prompt-button"
          onClick={() =>
            setPrompt("Write a poem about open source machine learning. ")
          }
        >
          poems
        </button>{" "}
        and{" "}
        <button
          className="prompt-button"
          onClick={() =>
            setPrompt(
              "Write a python script that trains `bert-large` on the `IMDB` dataset using the Transformers `Trainer` class and Datasets library. I have access to four GPUs, so let's use DDP. Please write the script and then tell me how to launch it on the command line."
            )
          }
        >
          code
        </button>
        ,{" "}
        <button
          className="prompt-button"
          onClick={() =>
            setPrompt(
              "Respond to this question only based on the information provided here. Cats like dogs, and dogs like rabbits. Cats like anything that dogs like. I really really dislike rabbits. How do cats feel about rabbits?"
            )
          }
        >
          solve logic puzzles
        </button>
        , or even{" "}
        <button
          className="prompt-button"
          onClick={() =>
            setPrompt(
              "please provide 10 fun names for a pet pelican. Please come up with unique emojis to go along with each name. Try not to repeat the same emojis. Make them fun, colorful, and loving names"
            )
          }
        >
          name your pets.
        </button>{" "}
      </p>
      <p>Send me a message.</p>
    </div>
  );
}
