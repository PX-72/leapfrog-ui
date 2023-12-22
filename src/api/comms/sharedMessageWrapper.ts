import { EventTypeEnum } from '@/api/comms/enums/eventTypeEnum';

export type MessageWrapper = {
    portId: string,
    message: string,
    eventType: EventTypeEnum
};

function toMessageWrapper(portId: string, eventType: EventTypeEnum, message: string): MessageWrapper;
function toMessageWrapper(portId: string, eventType: EventTypeEnum, message: MessageEvent): MessageWrapper;

function toMessageWrapper(portId: string, eventType: EventTypeEnum, message: string | MessageEvent): MessageWrapper {
    if (typeof message === 'string') return ({ portId, eventType, message });
    if (message instanceof MessageEvent) return ({ portId, eventType, message: message.data.toString() });
    throw new Error('Invalid arguments. message must be either string or MessageEvent.');
}

export { toMessageWrapper };