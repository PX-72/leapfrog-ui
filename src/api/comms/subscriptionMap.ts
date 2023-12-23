
const topicPortsMap = new Map<string, MessagePort[]>();

const getPortsByKey = (key: string): MessagePort[] => [...(topicPortsMap.get(key) ?? [])];

const addPort = (key: string, port: MessagePort): boolean => {
    if (!topicPortsMap.has(key)) {
        topicPortsMap.set(key, [port]);
        return true;
    }

    const portList = topicPortsMap.get(key);
    const i = portList!.indexOf(port);
    if (i === -1) {
        portList?.push(port);
        return true;
    }

    return false;
};

const removePortForKey = (key: string, port: MessagePort): boolean => {
    if (!topicPortsMap.has(key)) return false;

    const portList = topicPortsMap.get(key);
    const i = portList!.indexOf(port);

    if (i === -1) return false;

    portList!.splice(i, 1);
    if (portList!.length === 0) {
        topicPortsMap.delete(key);
        return true;
    }

    return false;
};

const removePort = (port: MessagePort): string[] => {
    const topicKeysWithoutPorts = [];
    for (const [topic, portList] of topicPortsMap) {
        const i = portList.indexOf(port);
        if (i === -1) continue;

        portList.splice(i, 1);
        if (portList.length === 0)
            topicKeysWithoutPorts.push(topic);
    }

    topicKeysWithoutPorts.forEach(t => topicPortsMap.delete(t));

    return topicKeysWithoutPorts;
};

export default {
    getPortsByKey,
    addPort,
    removePortForKey,
    removePort
}