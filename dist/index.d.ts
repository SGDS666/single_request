import React from 'react';
export declare const SRProvider: React.FC<{
    children: any;
}>;
export declare const SingleRoot: React.FC<{
    children: any;
}>;
export declare const useSingleRequest: (urlkey: string, request: (params?: any) => Promise<any>, formater?: ((res: any) => any) | undefined) => {
    data: any;
    setData: import("recoil").SetterOrUpdater<any>;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    runRequest: (params?: any) => void;
};
