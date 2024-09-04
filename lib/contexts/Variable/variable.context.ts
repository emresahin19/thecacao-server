import { createContext } from "react";
import { VariableContextProps } from "./variable.props";

export const VariableContext = createContext<VariableContextProps | undefined>(undefined);