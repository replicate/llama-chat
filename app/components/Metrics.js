import { countTokens } from "../src/tokenizer";

export default function Metrics({
  startedAt,
  firstMessageAt,
  completedAt,
  completion,
}) {
  const timeToFirstToken =
    firstMessageAt && startedAt
      ? (new Date(firstMessageAt) - new Date(startedAt)) / 1000.0
      : null;
  const tokenCount = completion && countTokens(completion);
  const runningDuration = firstMessageAt
    ? ((completedAt ? new Date(completedAt) : new Date()) -
        new Date(firstMessageAt)) /
      1000.0
    : null;
  const tokensPerSecond =
    tokenCount > 0 && runningDuration > 0 && tokenCount / runningDuration;

  if (timeToFirstToken === null || tokenCount === null || runningDuration === null) {
    return null;
  }

  return (
    <dl className="grid grid-cols-12 gap-2 mb-4">
      <div className="col-span-3 sm:col-span-4 flex items-center justify-center sm:text-sm text-xs">
        <dd className="text-gray-900 pr-3">
          {timeToFirstToken ? timeToFirstToken.toFixed(2) : "—"}
        </dd>
        <dt className="font-medium text-gray-500">
          <span className="hidden sm:inline">sec to </span> first token
        </dt>
      </div>
      <div className="col-span-3 flex items-center justify-center sm:text-sm text-xs">
        <dd className="text-gray-900 pr-2">
          {tokensPerSecond ? tokensPerSecond.toFixed(2) : "—"}
        </dd>
        <dt className="font-medium text-gray-500">
          t<span className="hidden sm:inline">okens</span> / s
          <span className="hidden sm:inline">ec</span>
        </dt>
      </div>
      <div className="col-span-3 sm:col-span-2 flex items-center justify-center sm:text-sm text-xs">
        <dd className="text-gray-900 pr-2">{tokenCount || "—"}</dd>
        <dt className="font-medium text-gray-500">tokens</dt>
      </div>
      <div className="col-span-3 flex items-center justify-center sm:text-sm text-xs">
        <dd className="text-gray-900 pr-2">
          {Math.max(runningDuration, 0).toFixed(2)}
        </dd>
        <dt className="font-medium text-gray-500">run time</dt>
      </div>
    </dl>
  );
}
