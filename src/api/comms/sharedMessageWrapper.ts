import { EventType } from './enums';

export type MessageWrapper = {
    portId: string,
    type: EventType
    data: any,
};

function toMessageWrapper(portId: string, eventType: EventType, message: string): MessageWrapper;
function toMessageWrapper(portId: string, eventType: EventType, message: MessageEvent): MessageWrapper;

function toMessageWrapper(portId: string, eventType: EventType, message: string | MessageEvent): MessageWrapper {
    if (typeof message === 'string') return ({ portId, type: eventType, data: message });
    if (message instanceof MessageEvent) return ({ portId, type: eventType, data: message.data.toString() });
    throw new Error('Invalid arguments. message must be either string or MessageEvent.');
}

export { toMessageWrapper };