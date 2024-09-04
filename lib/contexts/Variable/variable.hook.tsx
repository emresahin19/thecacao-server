import type { VariableContextProps } from './variable.props';
import { useContext } from 'react';
import { VariableContext } from './variable.context';

export const useVariable = (): VariableContextProps => {
    const context = useContext(VariableContext);
    if (!context) {
        throw new Error('useVariable must be used within a VariableProvider');
    }
    return context;
};
