export const createTopicPortsMap = () => {
    const map = new Map<string, Set<MessagePort>>();

    const getPortsByKey = (key: string): ReadonlySet<MessagePort> => new Set(map.get(key) ?? []);

    const addPort = (key: string, port: MessagePort): boolean => {
        if (!map.has(key)) {
            map.set(key, new Set([port]));
            return true;
        }

        const portSet = map.get(key)!;
        if (!portSet.has(port)) {
            portSet.add(port);
            return true;
        }

        return false;
    };

    const removePortForKey = (key: string, port: MessagePort): boolean => {
        if (!map.has(key)) return false;

        const portSet = map.get(key)!;
        portSet.delete(port);
        if (portSet.size === 0) {
            map.delete(key);
            return true;
        }

        return false;
    };

    const removePort = (port: MessagePort): string[] => {
        const topicKeysWithoutPorts = [];
        for (const [topic, portSet] of map) {
            if (!portSet.has(port)) continue;

            portSet.delete(port);
            if (portSet.size === 0)
                topicKeysWithoutPorts.push(topic);
        }

        topicKeysWithoutPorts.forEach(t => map.delete(t));

        return topicKeysWithoutPorts;
    };

    return {
        getPortsByKey,
        addPort,
        removePortForKey,
        removePort
    };
};
