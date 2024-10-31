import React, { useEffect, useState } from 'react';
import socket from '../socket';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // Rest of your component code
};

export default ChatWindow;
