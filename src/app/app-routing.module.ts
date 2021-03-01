import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetodoComponent } from './pages/metodo/metodo.component';

const routes: Routes = [{ path: '**', component: MetodoComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
