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
    version: "4b0970478e6123a0437561282904683f32a9ed0307205dc5db2b5609d6a2ceff",

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
