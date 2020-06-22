import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CallbackComponent } from './shopify-page/callback/callback.component';
import { InitialloadComponent } from './shopify-page/initialload/initialload.component';

const routes: Routes = [
  {
    path: 'home',
    component: InitialloadComponent,
  },
  {
    path: 'auth/callback',
    component: CallbackComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
