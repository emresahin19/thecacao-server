
export interface LoadingContextProps {
    loaded: boolean;
    setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
    domContentLoaded: boolean;
    setDomContentLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}