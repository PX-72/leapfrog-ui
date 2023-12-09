



export const getCurrencyPairs = async (data: String[]): Promise<boolean> => {
    const response = await fetch('http://localhost:8090/api/v1/static-data/currency-pairs', { method: 'GET' });

    if (!response.ok) {
        throw new Error(`HTTP error when getting currency pairs! Status: ${response.status}`);
    }

    return response.ok;
};