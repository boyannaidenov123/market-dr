import { NgModule } from "@angular/core";
import { RouterModule, Routes} from "@angular/router";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { IndexComponent } from './index/index.component';
import { MarketComponent } from './market/market.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { ProductsComponent } from './products/products.component';

const routes:Routes = [
    {path:'', component:IndexComponent},
    {path:'login', component:LoginComponent},
    {path:'signup', component:SignupComponent},
    {path:'market', component:MarketComponent, canActivate:[AuthGuard]},
    {path:'profile', component:ProfileComponent, canActivate:[AuthGuard]},
    {path:'products', component:ProductsComponent, canActivate:[AuthGuard]}
];
@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule],
    providers:[AuthGuard]
})

export class AppRoutingModule{}