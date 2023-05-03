"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSingleRequest = void 0;
const react_1 = require("react");
const urlMap = new Map();
const useSingleRequest = (urlkey, request, formater) => {
    const [data, setData] = (0, react_1.useState)(undefined);
    const [isLoading, setLoading] = (0, react_1.useState)(true);
    const [isError, setError] = (0, react_1.useState)(false);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)('');
    const runRequest = (0, react_1.useCallback)((params) => {
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
    }, [formater, request, urlkey]);
    (0, react_1.useEffect)(() => {
        if (!urlMap.has(urlkey)) {
            runRequest();
        }
        else {
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
exports.useSingleRequest = useSingleRequest;
