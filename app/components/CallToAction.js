import CTAGooBG from "../../public/cta-goo-bg.webp";

export default function CallToAction() {
  return (
    <div
      className="guide-footer-cta bg-pink-600 flex-col justify-between text-center p-12 space-y-4"
      style={{
        background: `url(${CTAGooBG.src}) no-repeat center center`,
        backgroundSize: "cover",
        position: "relative",
        zIndex: 1,
      }}
    >
      <h1 className="text-4xl text-white mb-0 font-bold">
        Run AI with an API.
      </h1>
      <p className="text-white max-w-lg mx-auto">
        Replicate lets you build apps like this using open-source models like{" "}
        <a
          className="underline"
          href="https://replicate.com/meta/llama-2-70b-chat?utm_source=project&utm_campaign=llama2ai"
        >
          Llama
        </a>
        ,{" "}
        <a
          className="underline"
          href="https://replicate.com/yorickvp/llava-13b?utm_source=project&utm_campaign=llama2ai"
        >
          Llava
        </a>
        , and{" "}
        <a
          className="underline"
          href="https://replicate.com/nateraw/salmonn?utm_source=project&utm_campaign=llama2ai"
        >
          Salmonn
        </a>{" "}
        with one line of code.
      </p>

      <a
        className="bg-black text-white text-small inline-block px-5 py-3 flex-none no-underline"
        href="https://replicate.com/blog/run-llama-2-with-an-api?utm_source=project&utm_campaign=llama2ai"
      >
        Try Replicate
      </a>
    </div>
  );
}
