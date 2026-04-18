export enum AppPhase {
  LANDING = 'LANDING',
  WAITING = 'WAITING',
  ACTIVE = 'ACTIVE',
  SYNTHESIS = 'SYNTHESIS',
  REVEAL = 'REVEAL',
  ERROR = 'ERROR'
}

export enum ConnectionStatus {
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RECONNECTING = 'RECONNECTING'
}

export enum WSMessageType {
  CREATE_ROOM = 'CREATE_ROOM',
  JOIN_ROOM = 'JOIN_ROOM',
  ROOM_READY = 'ROOM_READY',
  STATUS_UPDATE = 'STATUS_UPDATE',
  SUBMIT_TRANSCRIPT = 'SUBMIT_TRANSCRIPT',
  REVEAL_STORY = 'REVEAL_STORY',
  ERROR = 'ERROR',
  HEARTBEAT = 'HEARTBEAT'
}

export interface WSMessage<T = any> {
  type: WSMessageType;
  sessionId?: string;
  userId?: string;
  payload: T;
}
