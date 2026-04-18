import { useEffect, useRef, useCallback } from 'react';
import { useSessionStore } from '@store/useSessionStore';
import { WSMessageType, type WSMessage, AppPhase } from '@shared/types';

export const useWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const store = useSessionStore;

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.PUBLIC_WS_URL || 'localhost:3000';
    const socket = new WebSocket(`${protocol}//${host}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WS Connection Established');
      const sessionId = store.getState().sessionId;
      if (sessionId) {
        console.log('Attempting to join session:', sessionId);
        socket.send(JSON.stringify({
          type: WSMessageType.JOIN_ROOM,
          payload: { sessionId },
        }));
      }
    };

    socket.onerror = (error) => {
      console.error('❌ WS Connection Error:', error);
    };

    socket.onmessage = (event) => {
      console.log('📩 WS Message Received:', event.data);
      const message: WSMessage = JSON.parse(event.data);
      const { setPhase, setSessionId, setUserId, setPartnerStatus, setStory, setSentiment } = store.getState();

      switch (message.type) {
        case WSMessageType.CREATE_ROOM:
          setSessionId(message.payload.sessionId);
          setUserId(message.payload.userId);
          setPhase(AppPhase.WAITING);
          break;
        case WSMessageType.JOIN_ROOM:
          setSessionId(message.payload.sessionId);
          setUserId(message.payload.userId);
          break;
        case WSMessageType.ROOM_READY:
          setPhase(AppPhase.ACTIVE);
          break;
        case WSMessageType.STATUS_UPDATE:
          setPartnerStatus(message.payload.status);
          break;
        case WSMessageType.REVEAL_STORY:
          setStory(message.payload.lines);
          setSentiment(message.payload.sentiment);
          setPhase(AppPhase.REVEAL);
          break;
        case WSMessageType.ERROR:
          console.error('WS Error:', message.payload);
          break;
        case WSMessageType.HEARTBEAT:
          socket.send(JSON.stringify({ type: WSMessageType.HEARTBEAT, payload: {} }));
          break;
      }
    };

    socket.onclose = () => {
      console.log('WS Disconnected');
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = useCallback((type: WSMessageType, payload: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  return { sendMessage };
};
