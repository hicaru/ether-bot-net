import * as WebSocket from 'ws';

export interface ISoketEvent {
  type: string | number;
  body?: any;
  ws?: WebSocket;
}

export enum WsConfig {
  MESSAGE = 'message',
  CONNECTION = 'connection'
}
