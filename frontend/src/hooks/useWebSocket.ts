import { useEffect, useRef } from 'react';
import { useSessionStore } from '@store/useSessionStore';
import { WSMessageType, type WSMessage, AppPhase } from '@shared/types';

export const useWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const { setPhase, setSessionId, setUserId, setPartnerStatus, setStory } = useSessionStore();

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.PUBLIC_WS_URL || 'localhost:3000';
    const socket = new WebSocket(`${protocol}//${host}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WS Connection Established');
    };

    socket.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);

      switch (message.type) {
        case WSMessageType.ROOM_READY:
          setPhase(AppPhase.ACTIVE);
          break;
        case WSMessageType.STATUS_UPDATE:
          setPartnerStatus(message.payload.status);
          break;
        case WSMessageType.REVEAL_STORY:
          setStory(message.payload.lines);
          setPhase(AppPhase.REVEAL);
          break;
        case WSMessageType.ERROR:
          console.error('WS Error:', message.payload);
          setPhase(AppPhase.ERROR);
          break;
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (type: WSMessageType, payload: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, payload }));
    }
  };

  return { sendMessage };
};
