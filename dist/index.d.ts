export declare const useSingleRequest: (urlkey: string, request: (params?: any) => Promise<any>, formater: (res: any) => any) => {
    data: any;
    setData: import("react").Dispatch<any>;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    runRequest: (params?: any) => void;
};
