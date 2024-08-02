import Link from "next/link";

export default function TokenForm({ handleTokenSubmit }) {
  return (
    <div className="landing-page container flex-column mx-auto mt-24 p-4">
      <div className="hero mx-auto">
        <div className="hero-text text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            🦙 Ready to chat with a Llama?
          </h1>
        </div>

        <div className="mt-12 max-w-xl mx-auto text-center">
          <p className="text-base text-gray-500">
            You need a {" "}
            <Link
              className="underline"
              href="https://replicate.com/account/api-tokens?utm_campaign=llama2ai&utm_source=project"
              target="_blank"
              rel="noopener noreferrer"
            >
              Replicate API token
            </Link>{" "} to run this demo. Copy it and paste below:
          </p>

          <form onSubmit={handleTokenSubmit}>
            <label htmlFor="api-key" className="sr-only">
              API token
            </label>
            <input
              type="text"
              name="api-key"
              id="api-key"
              className="block mt-6 w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl"
              placeholder="Paste your API token here..."
              minLength="40"
              maxLength="40"
              required
            />
            <div className="mt-5 sm:mt-6 sm:gap-3">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md bg-black p-3 text-xl text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 sm:col-start-2"
              >
                Start chatting &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}