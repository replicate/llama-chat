import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const prediction = await replicate.predictions.create({
    // See https://replicate.com/a16z-infra/llama13b-v2-chat/versions
    version: "e951f18578850b652510200860fc4ea62b3b16fac280f83ff32282f87bbd2e48",

    stream: true,

    // This is the text prompt that will be submitted by a form on the frontend
    input: {
      prompt: req.body.prompt,
      max_length: 500,
      temperature: 0.75,
      repetition_penalty: 1,
      top_p: 1,
    },
  });

  console.log({ prediction });

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}
