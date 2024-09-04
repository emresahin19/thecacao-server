import { createContext } from "react";
import { LoadingContextProps } from "./loading.props";

export const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);
