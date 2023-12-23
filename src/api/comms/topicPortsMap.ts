
const map = new Map<string, MessagePort[]>();

const getPortsByKey = (key: string): MessagePort[] => [...(map.get(key) ?? [])];

const addPort = (key: string, port: MessagePort): boolean => {
    if (!map.has(key)) {
        map.set(key, [port]);
        return true;
    }

    const portList = map.get(key);
    const i = portList!.indexOf(port);
    if (i === -1) {
        portList?.push(port);
        return true;
    }

    return false;
};

const removePortForKey = (key: string, port: MessagePort): boolean => {
    if (!map.has(key)) return false;

    const portList = map.get(key);
    const i = portList!.indexOf(port);

    if (i === -1) return false;

    portList!.splice(i, 1);
    if (portList!.length === 0) {
        map.delete(key);
        return true;
    }

    return false;
};

const removePort = (port: MessagePort): string[] => {
    const topicKeysWithoutPorts = [];
    for (const [topic, portList] of map) {
        const i = portList.indexOf(port);
        if (i === -1) continue;

        portList.splice(i, 1);
        if (portList.length === 0)
            topicKeysWithoutPorts.push(topic);
    }

    topicKeysWithoutPorts.forEach(t => map.delete(t));

    return topicKeysWithoutPorts;
};

export default {
    getPortsByKey,
    addPort,
    removePortForKey,
    removePort
};