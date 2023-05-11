import React, { useEffect } from 'react';
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


interface singleRequestConfig {

  awaitData: any
}


export const useSingleRequest = (
  urlkey: string,
  request: (params?: any) => Promise<any>,
  formater?: (res: any) => any,
  config?: {
    log?: boolean,
    refreshInterval?: number
  }

) => {



  const { urlMap, createAtom, createKey } = useContext(SRContext)

  const [datakey, loadingKey, errorKey, messageKey] = useMemo(() => {
    return createKey(urlkey)

  }, [createKey, urlkey])

  const dataAtom = createAtom(datakey, undefined)
  const loadingAtom = createAtom(loadingKey, true)
  const errorAtom = createAtom(errorKey, false)
  const messageAtom = createAtom(messageKey, "")



  const [data, setData] = useRecoilState<any>(dataAtom)
  const [isLoading, setLoading] = useRecoilState<boolean>(loadingAtom);
  const [isError, setError] = useRecoilState<boolean>(errorAtom);
  const [errorMessage, setErrorMessage] = useRecoilState<string>(messageAtom);

  useEffect(() => {
    if (!urlMap.has(urlkey)) {
      urlMap.set(urlkey, undefined)
      if (config?.log) {
        console.log(urlkey, "run")
      }
      request()
        .then((res) => {
          const data = formater ? formater(res) : res;
          setData(data);

          setLoading(false);
          urlMap.set(urlkey, data);
          // console.log({ urlMap })
        })
        .catch((reason) => {
          setErrorMessage(reason);
          setError(true);
        });


    }

  }, [config?.log, formater, request, setData, setError, setErrorMessage, setLoading, urlMap, urlkey])


  // useEffect(() => { //被recoil维护数据 不再需要
  //   if (!data && urlMap.has(urlkey)) {
  //     if (urlMap.get(urlkey)) {
  //       if (config?.log) {
  //         console.log(urlkey, "getCacheData")
  //       }
  //       setData(urlMap.get(urlkey))
  //       setLoading(false)
  //     }

  //   }

  // }, [config?.log, data, setData, setLoading, urlMap, urlkey])

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlkey])

  useEffect(() => {
    if (config?.refreshInterval) {
      const timer = setInterval(() => {
        if (config.log) {
          console.log(urlkey, "refreshInterval run")
        }
        runRequest()

      }, config.refreshInterval)
      return () => {
        clearInterval(timer)
      }
    }
  }, [config?.log, config?.refreshInterval, runRequest, urlkey])




  return {
    data,
    setData,
    isLoading,
    isError,
    errorMessage,
    runRequest,
  };
};
