import React, { createContext, useContext, useState, useCallback } from 'react';

interface StartProjectModalContextType {
  isOpen: boolean;
  openStartProjectModal: () => void;
  closeStartProjectModal: () => void;
}

const StartProjectModalContext = createContext<StartProjectModalContextType>({
  isOpen: false,
  openStartProjectModal: () => {},
  closeStartProjectModal: () => {}
});

export const StartProjectModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openStartProjectModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeStartProjectModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <StartProjectModalContext.Provider
      value={{
        isOpen,
        openStartProjectModal,
        closeStartProjectModal
      }}
    >
      {children}
    </StartProjectModalContext.Provider>
  );
};

export const useStartProjectModal = () => useContext(StartProjectModalContext);
