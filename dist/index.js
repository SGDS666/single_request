"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSingleRequest = exports.SingleRoot = exports.SRProvider = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("react");
const recoil_1 = require("recoil");
const urlMap = new Map();
const AtomMap = new Map();
const createAtom = (key, defaultValue) => {
    if (AtomMap.has(key)) {
        return AtomMap.get(key);
    }
    const atomItem = (0, recoil_1.atom)({
        key,
        default: defaultValue
    });
    AtomMap.set(key, atomItem);
    return atomItem;
};
const createKey = (key) => {
    const datakey = key + "data";
    const loadingKey = key + "loading";
    const errorKey = key + 'error';
    const messageKey = key + 'message';
    return [datakey, loadingKey, errorKey, messageKey];
};
const SRContext = (0, react_2.createContext)({ urlMap, AtomMap, createAtom, createKey });
const SRProvider = ({ children }) => {
    return (react_1.default.createElement(SRContext.Provider, { value: { urlMap, AtomMap, createAtom, createKey } }, children));
};
exports.SRProvider = SRProvider;
const SingleRoot = ({ children }) => {
    return (react_1.default.createElement(recoil_1.RecoilRoot, null,
        react_1.default.createElement(exports.SRProvider, null, children)));
};
exports.SingleRoot = SingleRoot;
const useSingleRequest = (urlkey, request, formater) => {
    const { urlMap, createAtom, createKey } = (0, react_2.useContext)(SRContext);
    const [datakey, loadingKey, errorKey, messageKey] = (0, react_2.useMemo)(() => {
        return createKey(urlkey);
    }, [createKey, urlkey]);
    const dataAtom = createAtom(datakey, undefined);
    const loadingAtom = createAtom(loadingKey, true);
    const errorAtom = createAtom(errorKey, false);
    const messageAtom = createAtom(messageKey, "");
    const [data, setData] = (0, recoil_1.useRecoilState)(dataAtom);
    const [isLoading, setLoading] = (0, recoil_1.useRecoilState)(loadingAtom);
    const [isError, setError] = (0, recoil_1.useRecoilState)(errorAtom);
    const [errorMessage, setErrorMessage] = (0, recoil_1.useRecoilState)(messageAtom);
    (0, react_1.useEffect)(() => {
        if (!urlMap.has(urlkey)) {
            urlMap.set(urlkey, undefined);
            request()
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
        }
    }, [formater, request, setData, setError, setErrorMessage, setLoading, urlMap, urlkey]);
    (0, react_1.useEffect)(() => {
        if (!data && urlMap.has(urlkey)) {
            setData(urlMap.get(urlkey));
        }
    }, [data, setData, urlMap, urlkey]);
    const runRequest = (0, react_2.useCallback)((params) => {
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
    }, [formater, request, setData, setError, setErrorMessage, setLoading, urlMap, urlkey]);
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
