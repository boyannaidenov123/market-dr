import { NgModule } from "@angular/core";
import { RouterModule, Routes} from "@angular/router";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { ProductsComponent } from './products/products.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './admin/admin.guard';
import { SofiaComponent } from './markets/sofia/sofia.component';
import { VarnaComponent } from './markets/varna/varna.component';
import { PlovdivComponent } from './markets/plovdiv/plovdiv.component';

const routes:Routes = [
    {path:'', component:IndexComponent},
    {path:'login', component:LoginComponent},
    {path:'signup', component:SignupComponent},
    {path:'profile', component:ProfileComponent, canActivate:[AuthGuard]},
    {path:'products', component:ProductsComponent, canActivate:[AuthGuard]},
    {path:'admin', component:AdminComponent, canActivate:[AuthGuard, AdminGuard]},
    {path:'market/Sofia', component:SofiaComponent, canActivate:[AuthGuard]},
    {path:'market/Plovdiv', component:PlovdivComponent, canActivate:[AuthGuard]},
    {path:'market/Varna', component:VarnaComponent, canActivate:[AuthGuard]}
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule],
    providers:[AuthGuard, AdminGuard]
})

export class AppRoutingModule{}