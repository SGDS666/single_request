import { useCallback, useEffect, useState } from 'react';

const urlMap = new Map();

export const useSingleRequest = (
  urlkey: string,
  request: (params?: any) => Promise<any>,
  formater: (res: any) => any
) => {
  const [data, setData] = useState<any>(undefined);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const runRequest = useCallback((params?: any) => {
    request(params)
      .then((res) => {
        const data = formater ? formater(res) : res;
        setData(data);

        setLoading(false);
        urlMap.set(urlkey, data);
      })
      .catch((reason) => {
        setErrorMessage(reason);
        setError(true);
      });
  }, [formater, request, urlkey])

  useEffect(() => {
    if (!urlMap.has(urlkey)) {
      runRequest();
    } else {
      setData(urlMap.get(urlkey));
      setLoading(false);
    }


  }, [runRequest, urlkey]);

  return {
    data,
    setData,
    isLoading,
    isError,
    errorMessage,
    runRequest,
  };
};
