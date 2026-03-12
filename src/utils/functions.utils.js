export function getFunctionName({ skip = 0 } = {}) {
    const stack = new Error().stack;

    if (!stack) {
        return "unknown";
    }

    const frames = stack.split("\n").slice(1).map((line) => line.trim());
    const targetFrame = frames[1 + skip] ?? "";
    const match = targetFrame.match(/^at\s+(?:async\s+)?([^\s(]+)/);

    if (!match) {
        return "unknown";
    }

    const symbol = match[1];
    const index = symbol.lastIndexOf(".");
    return index === -1 ? symbol : symbol.slice(index + 1);
}
