# Llama Chat 🦙

This is a [Next.js](https://nextjs.org/) app that demonstrates how to build a chat UI using the [Llama 2](https://replicate.com/replicate/llama70b-v2-chat) language model and Replicate's [streaming API (private beta)](https://replicate.com/docs/streaming).

## Usage

Install dependencies:

```console
npm install
```

Add your [Replicate API token](https://replicate.com/account#token) to `.env.local`:

```
REPLICATE_API_TOKEN=<your-token-here>
```

Run the development server:

```console
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

For detailed instructions on how to create and use this template, see [replicate.com/docs/get-started/nextjs](https://replicate.com/docs/get-started/nextjs)

<img src="https://user-images.githubusercontent.com/2289/208017930-a39ca4d5-2410-4049-bce0-20718480c73b.png" alt="app screenshot">

TODO

- [x] probably want some sort of logic to truncate the message history (so we're not sending a prompt that's too long — we don't want an error there)
- [x] fix the runtime error
- [ ] auto-scrolldown on last message
- [x] UI touchups
- [x] System prompts
- stats on bottom
- report that prompts email to team
