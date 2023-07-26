const LoadingChatLine = () => {
    return (
        <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
            <div className="flex flex-grow space-x-3">
                <div className="min-w-0 flex-1">
                    <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
                            <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
                        </div>
                        <div className="h-2 rounded bg-zinc-500"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingChatLine;