import { nanoid } from 'nanoid';
import { WSMessageType, type WSMessage, AppPhase } from '../../shared/types';

interface Room {
  id: string;
  userA: any;
  userB?: any;
  transcripts: Map<string, string>;
}

const rooms = new Map<string, Room>();

const server = Bun.serve({
  port: 3000,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("Unsaid Weaver Active");
  },
  websocket: {
    message(ws, message) {
      const msg: WSMessage = JSON.parse(message as string);
      
      switch (msg.type) {
        case WSMessageType.CREATE_ROOM:
          const id = nanoid(6);
          const userId = nanoid(4);
          rooms.set(id, { id, userA: ws, transcripts: new Map() });
          ws.data = { sessionId: id, userId };
          ws.send(JSON.stringify({ type: WSMessageType.CREATE_ROOM, payload: { sessionId: id, userId } }));
          break;

        case WSMessageType.JOIN_ROOM:
          const roomId = msg.payload.sessionId;
          const room = rooms.get(roomId);
          if (room) {
            const bId = nanoid(4);
            room.userB = ws;
            ws.data = { sessionId: roomId, userId: bId };
            ws.send(JSON.stringify({ type: WSMessageType.JOIN_ROOM, payload: { sessionId: roomId, userId: bId } }));
            room.userA.send(JSON.stringify({ type: WSMessageType.ROOM_READY, payload: {} }));
            room.userB.send(JSON.stringify({ type: WSMessageType.ROOM_READY, payload: {} }));
          }
          break;

        case WSMessageType.SUBMIT_TRANSCRIPT:
          const sRoom = rooms.get(ws.data.sessionId);
          if (sRoom) {
            sRoom.transcripts.set(ws.data.userId, msg.payload.text);
            if (sRoom.transcripts.size === 2) {
              sRoom.userA.send(JSON.stringify({ type: WSMessageType.REVEAL_STORY, payload: { 
                lines: ["You both carry a weight you didn't choose.", "One of you felt small, while the other felt invisible.", "But under it all, you both just want to be known.", "It is safe to talk now."],
                sentiment: 'warm'
              }}));
              sRoom.userB.send(JSON.stringify({ type: WSMessageType.REVEAL_STORY, payload: { 
                lines: ["You both carry a weight you didn't choose.", "One of you felt small, while the other felt invisible.", "But under it all, you both just want to be known.", "It is safe to talk now."],
                sentiment: 'warm'
              }}));
            }
          }
          break;
          
        case WSMessageType.STATUS_UPDATE:
          const stRoom = rooms.get(ws.data.sessionId);
          if (stRoom) {
            const target = stRoom.userA === ws ? stRoom.userB : stRoom.userA;
            if (target) target.send(message);
          }
          break;
      }
    },
    close(ws) {
      if (ws.data?.sessionId) rooms.delete(ws.data.sessionId);
    }
  },
});

console.log(`Unsaid Weaver running on port ${server.port}`);
