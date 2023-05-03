import React from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { atom, RecoilRoot, useRecoilState } from 'recoil';

const urlMap = new Map()
const AtomMap = new Map()
const createAtom = (key: string, defaultValue: any) => {
  if (AtomMap.has(key)) {
    return AtomMap.get(key)
  }
  const atomItem = atom({
    key,
    default: defaultValue
  })
  AtomMap.set(key, atomItem)
  return atomItem
}


const createKey = (key: string) => {
  const datakey = key + "data"
  const loadingKey = key + "loading"
  const errorKey = key + 'error'
  const messageKey = key + 'message'
  return [datakey, loadingKey, errorKey, messageKey]
}

const SRContext = createContext({ urlMap, AtomMap, createAtom, createKey })


export const SRProvider: React.FC<{ children: any }> = ({ children }) => {
  return (
    <SRContext.Provider value={{ urlMap, AtomMap, createAtom, createKey }}>
      {children}
    </SRContext.Provider>
  )
}

export const SingleRoot: React.FC<{ children: any }> = ({ children }) => {
  return (
    <RecoilRoot>
      <SRProvider>
        {children}
      </SRProvider>
    </RecoilRoot>
  )
}




export const useSingleRequest = (
  urlkey: string,
  request: (params?: any) => Promise<any>,
  formater?: (res: any) => any
) => {
  const { urlMap, createAtom, createKey } = useContext(SRContext)

  const [datakey, loadingKey, errorKey, messageKey] = useMemo(() => {
    return createKey(urlkey)

  }, [createKey, urlkey])

  const dataAtom = createAtom(datakey, undefined)
  const loadingAtom = createAtom(loadingKey, false)
  const errorAtom = createAtom(errorKey, false)
  const messageAtom = createAtom(messageKey, "")



  const [data, setData] = useRecoilState<any>(dataAtom)
  const [isLoading, setLoading] = useRecoilState<boolean>(loadingAtom);
  const [isError, setError] = useRecoilState<boolean>(errorAtom);
  const [errorMessage, setErrorMessage] = useRecoilState<string>(messageAtom);


  if (!urlMap.has(urlkey)) {
    urlMap.set(urlkey, undefined)
    request()
      .then((res) => {
        const data = formater ? formater(res) : res;
        setData(data);

        setLoading(false);
        urlMap.set(urlkey, data);
        console.log({ urlMap })
      })
      .catch((reason) => {
        setErrorMessage(reason);
        setError(true);
      });
  }
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
  }, [formater, request, setData, setError, setErrorMessage, setLoading, urlMap, urlkey])


  return {
    data,
    setData,
    isLoading,
    isError,
    errorMessage,
    runRequest,
  };
};
