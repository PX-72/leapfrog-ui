export const getCurrencyPairs = async (): Promise<string[]> => {
    const response = await fetch('http://localhost:8090/api/v1/static-data/currency-pairs', { method: 'GET' });

    if (!response.ok)
        throw new Error(`HTTP error when getting currency pairs! Status: ${response.status}`);

    return await response.json();
};
