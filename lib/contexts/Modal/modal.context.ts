import { createContext } from "react";
import { ModalContextType } from "./modal.props";

export const ModalContext = createContext<ModalContextType | undefined>(undefined);
