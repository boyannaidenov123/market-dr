import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    socket :any;

    constructor() {
        this.socket = io('http://localhost:9001')
    }

    listen(Eventname:string){
        return new Observable((subscriber)=>{
            this.socket.on(Eventname,(data)=>{
                subscriber.next(data);
            })
        })
    }
    sent(Eventname:string, data:Object | any){
        this.socket.emit(Eventname, data);
    }
}