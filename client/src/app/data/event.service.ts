// user.service.ts
import { Injectable, EventEmitter } from '@angular/core';


@Injectable()
export class EventService {
  userLoggedIn = new EventEmitter();
  statisticChanged = new EventEmitter();
  notificationFetched = new EventEmitter();

  constructor() {
  }

  triggerUserLoggedIn(data) {
    this.userLoggedIn.emit(data);
  }

  triggerNotificationFetched(message, status) {
    let notificationInfo = {
      message: message,
      status: status
    };
    this.notificationFetched.emit(notificationInfo);
  }

  triggerStatisticChanged(data) {
    this.statisticChanged.emit(data); 
  }
}