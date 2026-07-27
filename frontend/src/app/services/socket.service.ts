import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket?: Socket;

  connect(serverUrl: string): void {
    if (this.socket) {
      return;
    }

    this.socket = io(serverUrl, {
      transports: ['websocket'],
      autoConnect: true,
    });
  }

  emit(eventName: string, data: any): void {
    this.getSocket().emit(eventName, data);
  }

  disconnect(): void {
    this.socket?.disconnect();
  }

  listen<T>(eventName: string): Observable<T> {
    return new Observable<T>((sub) => {
      const socket = this.getSocket();

      socket.on(eventName, (data: T) => {
        sub.next(data);
      });

      return () => {
        socket.off(eventName);
      };
    });
  }

  private getSocket(): Socket {
    if (!this.socket) {
      throw new Error('Socket ainda não foi conectado. Aguarde o AppConfigService.load().');
    }

    return this.socket;
  }
}
