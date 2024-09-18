"use client";
import React, { useState, ReactNode, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ModalProps } from 'lib/interfaces';
import { clearSelected } from 'lib/store';
import { ModalContextType, ModalProviderProps } from './modal.props';
import { ModalContext } from './modal.context';

export const ModalProvider = ({ children }: ModalProviderProps) => {
    const [show, setShow] = useState<boolean>(false);
    const [component, setComponent] = useState<ReactNode>(null);
    const dispatch = useDispatch();
    const scrollYRef = useRef<number>(0); 
    
    const handleShow = ({ show, component }: ModalProps) => {
      if (show) {
        setShow(show);
        setComponent(component);
      } else {
        resetModal();
      }
    }

    useEffect(() => {
      if (show) {
        scrollYRef.current = window.scrollY || window.pageYOffset;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollYRef.current}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      }else {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollYRef.current);
      }
    }, [show]);
  
    const resetModal = () => {
      setShow(false);
      setComponent(null);
      dispatch(clearSelected());
    }

    const setWrapperStyle = (open: boolean) => {

      const body = document.querySelector('body');
      if (body) {
        body.style.overflow = open ? 'hidden' : 'auto';
      }
    }
  
    const values: ModalContextType = {
      show,
      setShow,
      component,
      handleShow,
      setComponent,
      resetModal,
      setWrapperStyle
    };
  
    return (
      <ModalContext.Provider value={values}>
        {children}
      </ModalContext.Provider>
    );
  };
  