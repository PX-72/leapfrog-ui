const MAXIMUM_DELAY = 10_000;

const getReconnectionTimeout = (iteration: number): Promise<void> => {
    const delay = Math.min(2 ** (iteration - 2) * 1_000, MAXIMUM_DELAY);
    return new Promise(resolve => setTimeout(resolve, delay));
};

type WebSocketWrapper = {
    send: (msg: string) => void,
    close: () => void
};

export const createWebSocket = (
    url: string,
    onMessage: (event: MessageEvent) => void,
    onError: (event: Event) => void
): WebSocketWrapper => {
    let shouldClose = false;
    let reconnectionIteration = 0;
    let currentWebSocket: WebSocket;

    (function reopen() {
        if (shouldClose)
            return;

        currentWebSocket = new WebSocket(url);

        currentWebSocket.onmessage = onMessage;
        currentWebSocket.onerror = onError;

        currentWebSocket.onclose = async () => {
            await getReconnectionTimeout(reconnectionIteration++);
            reopen();
        };
    })();

    return {
        send: msg => currentWebSocket.send(msg),
        close: () => {
            shouldClose = true;
            currentWebSocket.close();
        }
    };
};
