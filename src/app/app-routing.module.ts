import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BiseccionComponent } from './metodos/biseccion/biseccion.component';

const routes: Routes = [{ path: '**', component: BiseccionComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
