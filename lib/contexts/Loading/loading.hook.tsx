import { useContext } from "react";
import { LoadingContext } from "./loading.context";
import { LoadingContextProps } from "./loading.props";

export const useLoading = (): LoadingContextProps => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
