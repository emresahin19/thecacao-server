import { createContext } from "react";
import { ToastContextProps } from "./toast.props";

export const ToastContext = createContext<ToastContextProps | undefined>(undefined);
