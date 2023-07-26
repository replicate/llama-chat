import { ChevronRightIcon } from "@heroicons/react/20/solid";

import {
  CalendarIcon,
  CommandLineIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";

const items = [
  {
    name: "Explain concepts",
    description:
      "Explain the self-attention mechanism that Transformers use like I'm five.",
    href: "#",
    iconColor: "bg-purple-500",
    icon: CommandLineIcon,
    emoji: "🤔",
  },
  {
    name: "Write poems",
    description: "Write a poem about open source machine learning. ",
    href: "#",
    iconColor: "bg-yellow-500",
    icon: CalendarIcon,
    emoji: "✒️",
  },
  {
    name: "Solve logic puzzles",
    description:
      "Respond to this question only based on the information provided here. Cats like dogs, and dogs like rabbits. Cats like anything that dogs like. I really really dislike rabbits. How do cats feel about rabbits?",
    href: "#",
    iconColor: "bg-yellow-500",
    icon: CalendarIcon,
    emoji: "🐱",
  },
  {
    name: "Write code",
    description:
      "Write a python script that trains `bert-large` on the `IMDB` dataset using the Transformers `Trainer` class and Datasets library. I have access to four GPUs, so let's use DDP. Please write the script and then tell me how to launch it on the command line.",
    href: "#",
    iconColor: "bg-blue-500",
    icon: CommandLineIcon,
    emoji: "💻",
  },
  {
    name: "Name your pets",
    description:
      "please provide 10 fun names for a pet pelican. Please come up with unique emojis to go along with each name. Try not to repeat the same emojis. Make them fun, colorful, and loving names",
    href: "#",
    iconColor: "bg-pink-500",
    icon: MegaphoneIcon,
    emoji: "🦢",
  },
];

export default function EmptyState({ setPrompt }) {
  return (
    <div className="mt-12 text-center text-gray-500">
      <p className="mt-1 text-gray-500 text-xl">
        This is an{" "}
        <a className="underline" href="https://github.com/replicate/llama-chat">
          open source app
        </a>{" "}
        for chatting with Llama 2. You can customize Llama&apos;s personality by
        clicking on the settings button on the top right. Say something!
      </p>
    </div>
  );
}