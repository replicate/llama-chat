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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EmptyState() {
  return (
    <div className="mt-12">
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        Welcome to Chat with a Llama.
      </h2>
      <p className="mt-1 text-base text-gray-500">
        This is an{" "}
        <a className="underline" href="https://github.com/replicate/llama-chat">
          open source app
        </a>{" "}
        for chatting with Llama 2. Powered by{" "}
        <a
          className="underline"
          href="https://replicate.com/a16z-infra/llama13b-v2-chat?utm_source=project&utm_compaign=llamachat"
        >
          Replicate
        </a>
        .
      </p>

      <ul
        role="list"
        className="mt-6 divide-y divide-gray-200 border-b border-t border-gray-200"
      >
        {items.map((item, itemIdx) => (
          <li key={itemIdx}>
            <div className="group relative flex items-start space-x-3 py-4">
              <div className="flex-shrink-0">
                <span className="text-4xl mr-3">{item.emoji}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900">
                  <a href={item.href}>
                    <span className="absolute inset-0" aria-hidden="true" />
                    {item.name}
                  </a>
                </div>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <div className="flex-shrink-0 self-center">
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
