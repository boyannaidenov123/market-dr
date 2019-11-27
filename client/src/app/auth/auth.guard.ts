import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate{
    
    constructor(private authService: AuthService, private router: Router){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):boolean | Observable<boolean> | Promise<boolean>{
        const isAuth = this.authService.getIsAuth();
        if(!isAuth){
            this.router.navigate(['/login']);
        }
        return isAuth;
    }
}