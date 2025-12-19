
export const LinearLoader = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="relative w-8 h-8">
                <div className="absolute inset-0 border-2 border-transparent border-t-zinc-600 rounded-full animate-spin"
                    style={{ animationDuration: '1s' }} />

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-zinc-600 rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    );
};
