import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { 
  MatMenuModule,
  MatCardModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatInputModule,
  MatButtonModule,
  MatPaginatorModule
  

} from '@angular/material';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { CountdownModule } from 'ngx-countdown';






import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AppRoutingModule } from './app-routing.module';
import { IndexComponent } from './index/index.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MarketComponent } from './market/market.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ProfileComponent } from './profile/profile.component';
import { ProductListCreateComponent } from './products/product-list-create/product-list-create.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ClockComponent } from './clock/clock.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    IndexComponent,
    MarketComponent,
    ProfileComponent,
    ProductListCreateComponent,
    ProductListComponent,
    ClockComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule,
    MatSliderModule,
    MatExpansionModule,
    MatRadioModule,
    MatTabsModule,
    NgCircleProgressModule.forRoot({}),
    CountdownModule,
    MatProgressSpinnerModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
