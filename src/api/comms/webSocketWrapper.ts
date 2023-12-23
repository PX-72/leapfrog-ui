import { Status } from './enums';

const MAXIMUM_DELAY = 10_000;

const getReconnectionTimeout = (iteration: number): Promise<void> => {
    const power = iteration >= 8 ? 8 : iteration;
    const delay = Math.min(2 ** (power - 2) * 1_000, MAXIMUM_DELAY);
    return new Promise(resolve => setTimeout(resolve, delay));
};

export type WebSocketWrapper = {
    send: (msg: string) => void,
    close: () => void,
    getStatus: () => Status
};

export const createWebSocket = (
    url: string,
    onMessage: (event: MessageEvent) => void,
    onError: (event: Event) => void,
    onOpen: () => void,
    onClose: () => void
): WebSocketWrapper => {
    let shouldClose = false;
    let reconnectionIteration = 0;
    let currentWebSocket: WebSocket;

    (function reopen() {
        currentWebSocket = new WebSocket(url);

        currentWebSocket.onmessage = onMessage;
        currentWebSocket.onerror = onError;
        currentWebSocket.onopen = onOpen;
        currentWebSocket.onclose = async () => {
            if (shouldClose) {
                shouldClose = false;
                reconnectionIteration = 0;
                onClose();
            } else {
                await getReconnectionTimeout(reconnectionIteration++);
                reopen();
            }
        };
    })();

    const close = () => {
        shouldClose = true;
        currentWebSocket.close();
    }

    const getStatus = (): Status => {
        if (currentWebSocket === undefined) return Status.Closed;

        switch (currentWebSocket.readyState) {
            case WebSocket.CONNECTING: return Status.Connecting;
            case WebSocket.OPEN: return Status.Ready;
            case WebSocket.CLOSING: return Status.Closing;
            case WebSocket.CLOSED: return Status.Closed;
            default: return Status.Unknown;
        }
    }

    const send = (msg: string) => {
        if (getStatus() === Status.Ready) {
            currentWebSocket.send(msg);
        } else {
            console.error('Message could not be sent on websocket as it is not open.');
        }
    }

    return {
        send,
        close,
        getStatus
    };
};
