"use client";
import React, { useState, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { ModalProps } from 'lib/interfaces';
import { useVariable } from 'lib/contexts';
import { clearSelected } from 'lib/store';
import { useShallowRouting } from 'lib/utils';
import { useRouter } from 'next/router';
import { ModalContextType, ModalProviderProps } from './modal.props';
import { ModalContext } from './modal.context';


export const ModalProvider = ({ children }: ModalProviderProps) => {
    const [show, setShow] = useState<boolean>(false);
    const [component, setComponent] = useState<ReactNode>(null);
    const { setIsOverflow } = useVariable();
    const dispatch = useDispatch();
    const router = useRouter();
    
    const handleShow = ({ show, component, route }: ModalProps) => {
      if (show) {
        setIsOverflow(true);
        setShow(show);
        setComponent(component);
        if (route) {
          // useShallowRouting(route);
          // router.push(route);
        }
      } else {
        resetModal();
      }
    }
  
    const resetModal = () => {
      setIsOverflow(false);
      setShow(false);
      setComponent(null);
      dispatch(clearSelected());
      // useShallowRouting('/menu');
      // router.push('/menu');
    }
  
    const values: ModalContextType = {
      show,
      setShow,
      component,
      handleShow,
      setComponent,
      resetModal,
    };
  
    return (
      <ModalContext.Provider value={values}>
        {children}
      </ModalContext.Provider>
    );
  };
  