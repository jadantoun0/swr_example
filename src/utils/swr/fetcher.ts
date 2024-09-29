
export const fetcher = async <T>(...args: [input: RequestInfo, init?: RequestInit]): Promise<T> => {
    const response = await fetch(...args);
   
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json() as Promise<T>;
};
  