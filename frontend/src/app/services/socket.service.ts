import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class SocketService { 
    private socket: Socket;
    private readonly SERVER_URL = environment.apiUrl;

    constructor() {
        this.socket = io(this.SERVER_URL, {
            transports: ['websocket'],
            autoConnect: true,
        })
    }

    emit(eventName: string, data: any): void {
        this.socket.emit(eventName, data)
    }

    disconnect(): void {
        if(this.socket) {
            this.socket.disconnect()
        }
    }

    listen<T>(eventName: string): Observable<T> {
        return new Observable<T>((sub) => {
            this.socket.on(eventName, (data: T) => {
                sub.next(data);
            })

            return () => {
                this.socket.off(eventName)
            }
        })
    }
}