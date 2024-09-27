import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  clean(): void {
    window.localStorage.clear();
  }

  public saveUser(user: unknown): void {
    window.localStorage.removeItem('accessToken');
    window.localStorage.setItem('accessToken', JSON.stringify(user));
  }

  public getUser(): unknown {
    const user = window.localStorage.getItem('accessToken');
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.localStorage.getItem('accesToken');
    if (user) {
      return true;
    }

    return false;
  }
}
