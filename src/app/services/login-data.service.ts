import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginDataService {

  isAuthenticated: Subject<boolean> = new BehaviorSubject<boolean>(false);
  firstName: Subject<string> = new BehaviorSubject<string>("User");
  familyName: Subject<string> = new BehaviorSubject<string>("Musstermann");
  email: Subject<string> = new BehaviorSubject<string>("user.musstermann@domain.com");

  constructor() { }

  sendData(loginFirstName: string, loginFamilyName: string,
    loginEmail: string, loginIsAuthenticated: boolean){

      this.isAuthenticated.next(loginIsAuthenticated);
      this.firstName.next(loginFirstName);
      this.familyName.next(loginFamilyName);
      this.email.next(loginEmail);
      // console.log("LoginDataService", loginFirstName, loginFamilyName, loginEmail, loginIsAuthenticated);
  }

  receiveFirstNameData(): Observable<string>{
    return this.firstName.asObservable();
  }

  receiveFamilyNameData(): Observable<string>{
    return this.familyName.asObservable();
  }

  receiveEmailData(): Observable<string>{
    return this.email.asObservable();
  }

  receiveIsAuthenticatedData(): Observable<boolean>{
    return this.isAuthenticated.asObservable();
  }
}
