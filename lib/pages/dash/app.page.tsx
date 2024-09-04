import React from 'react';
import { Provider } from 'react-redux';
import { VariableProvider, ModalProvider, AuthProvider, LoadingProvider, ToastProvider } from '@asim-ui/contexts';
import { store } from '@asim-ui/store';
import "../../assets/scss/variables.scss";

function TheApp({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <LoadingProvider>
            <VariableProvider>
              <ToastProvider>
                <ModalProvider>
                  {children}
                </ModalProvider>
              </ToastProvider>
            </VariableProvider>
          </LoadingProvider>
        </AuthProvider>
      </Provider>
    </>
  );
}

export default TheApp;
