import React from 'react';
import { Provider } from 'react-redux';
import { VariableProvider, ModalProvider, AuthProvider, LoadingProvider, ToastProvider } from '../../contexts';
import { wrapper } from '../../store';
import "../../assets/scss/variables.scss";

function TheApp({ children, ...rest }: { children: React.ReactNode }) {
  const { store, props } = wrapper.useWrappedStore(rest); 
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <LoadingProvider>
            <VariableProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </VariableProvider>
          </LoadingProvider>
        </AuthProvider>
      </Provider>
    </>
  );
}

export default TheApp;
