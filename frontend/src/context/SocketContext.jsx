import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  useEffect(() => {
    let socketInstance = null;

    if (isAuthenticated && user) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const token = localStorage.getItem('staymate_token');

      socketInstance = io(socketUrl, {
        withCredentials: true,
        auth: { token },
      });

      socketInstance.on('connect', () => {
        // Socket connected
      });

      socketInstance.on('unread_message_notification', (data) => {
        setUnreadNotifications((prev) => [data, ...prev]);
      });

      setSocket(socketInstance);
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  const clearNotifications = () => {
    setUnreadNotifications([]);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        unreadNotifications,
        unreadCount: unreadNotifications.length,
        clearNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  return context || {};
};
