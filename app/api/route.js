import Replicate from "replicate";
import { ReplicateStream, StreamingTextResponse } from "ai";
export const runtime = "edge";

const VERSIONS = {
  "yorickvp/llava-13b":
    "e272157381e2a3bf12df3a8edd1f38d1dbd736bbb7437277c8b34175f8fce358",
  "nateraw/salmonn":
    "ad1d3f9d2bd683628242b68d890bef7f7bd97f738a7c2ccbf1743a594c723d83",
};

export async function POST(req) {
  const params = await req.json();
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for");


  params.replicateClient = new Replicate({
    auth: params.replicateApiToken,
    userAgent: "llama-chat",
  });

  if (!ip) {
    console.error("IP address is null");
    return new Response("IP address could not be retrieved", { status: 500 });
  }

  let response;
  if (params.image) {
    response = await runLlava(params);
  } else if (params.audio) {
    response = await runSalmonn(params);
  } else {
    response = await runLlama(params);
  }

  // Convert the response into a friendly text-stream
  const stream = await ReplicateStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}

async function runLlama({
  replicateClient,
  model,
  prompt,
  systemPrompt,
  maxTokens,
  temperature,
  topP,
}) {
  console.log("running llama");
  console.log("model", model);
  console.log("maxTokens", maxTokens);



  return await replicateClient.predictions.create({
    model: model,
    stream: true,
    input: {
      prompt: `${prompt}`,
      max_new_tokens: maxTokens,
      ...(model.includes("llama3")
        ? { max_tokens: maxTokens }
        : { max_new_tokens: maxTokens }),
      temperature: temperature,
      repetition_penalty: 1,
      top_p: topP,
    },
  });
}

async function runLlava({ replicateClient, prompt, maxTokens, temperature, topP, image }) {
  console.log("running llava");

  return await replicateClient.predictions.create({
    stream: true,
    input: {
      prompt: `${prompt}`,
      top_p: topP,
      temperature: temperature,
      max_tokens: maxTokens,
      image: image,
    },
    version: VERSIONS["yorickvp/llava-13b"],
  });
}

async function runSalmonn({ replicateClient, prompt, maxTokens, temperature, topP, audio }) {
  console.log("running salmonn");

  return await replicate.predictions.create({
    stream: true,
    input: {
      prompt: `${prompt}`,
      top_p: topP,
      temperature: temperature,
      max_length: maxTokens,
      wav_path: audio,
    },
    version: VERSIONS["nateraw/salmonn"],
  });
}
