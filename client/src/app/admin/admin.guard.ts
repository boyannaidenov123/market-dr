import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service'
import { Observable, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AdminGuard implements CanActivate{
    private AdminSubs: Subscription;
    
    constructor(private authService: AuthService, private router: Router){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):boolean | Observable<boolean> | Promise<boolean> | any{

        const isAdmin = this.authService.getIsAdmin_();
            console.log(isAdmin);
            if(!isAdmin){
                this.router.navigate(['/market/Sofia']);
            }
            return isAdmin;

    }
}