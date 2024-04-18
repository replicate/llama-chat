import CTAGooBG from "../../public/cta-goo-bg.webp";

export default function CallToAction() {
  // todo: make this real goo
  return (
    <div
      className="guide-footer-cta sm:flex items-center bg-pink-600 justify-between p-12 space-y-4"
      style={{
        background: `url(${CTAGooBG.src}) no-repeat center center`,
        backgroundSize: "cover",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div>
        <h1 className="text-2xl sm:text-3xl text-white font-bold">
          Run Meta Llama 3 with an API
        </h1>
        <p className="text-white mx-auto mt-2 sm:mt-0">
          Replicate lets you run language models in the cloud with one line of
          code.
        </p>
      </div>

      <a
        className="bg-black text-white text-small inline-block px-5 py-3 flex-none no-underline"
        href="https://replicate.com/blog/run-llama-3-with-an-api?utm_source=project&utm_campaign=llama2ai"
      >
        Get started &rarr;
      </a>
    </div>
  );
}
