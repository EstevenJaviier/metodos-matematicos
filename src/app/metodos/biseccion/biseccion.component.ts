import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as math from 'mathjs';

@Component({
  templateUrl: './biseccion.component.html',
  styleUrls: ['./biseccion.component.css'],
})
export class BiseccionComponent implements OnInit {
  result: Array<any>;
  formBiseccion: FormGroup;

  get fC() {
    return this.formBiseccion.controls;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formBiseccion = this.fb.group({
      funcion: ['x^3-7*x^2+14*x-6', Validators.required],
      intervalo_a: ['0', Validators.required],
      intervalo_b: ['1', Validators.required],
      tolerancia: ['0.05', Validators.required],
      numIteraciones: ['100', Validators.required],
    });
  }

  f(x: number) {
    try {
      const node2 = math.parse(this.formBiseccion.get('funcion').value);
      const code2 = node2.compile();
      const scope = { x: x };
      return code2.evaluate(scope);
    } catch (error) {
      throw new Error(
        'Por favor corrija la funcion insertada: \n' + error.message
      );
    }
  }

  isNumber(e: KeyboardEvent) {
    const chart = String.fromCharCode(e.which);
    /[0-9|.|,]/.test(chart) || e.preventDefault();
  }

  isFuncion(e: KeyboardEvent) {
    const chart = String.fromCharCode(e.which);
    /[0-9|x|^|+|/|*|-]/.test(chart) || e.preventDefault();
  }

  biseccion() {
    try {
      this.result = [];

      let iteracion = 1;
      let a = this.formBiseccion.get('intervalo_a').value;
      let b = this.formBiseccion.get('intervalo_b').value;
      let p = 0;
      let fa = 0;
      let fb = 0;
      let fp = 0;
      let error = 0;
      let aux = 0;

      while (iteracion <= this.formBiseccion.get('numIteraciones').value) {
        p = (a + b) / 2;
        fp = this.f(p);
        fa = this.f(a);
        fb = this.f(b);
        error = Math.abs(p - aux); //Math.abs retorna el valor absoluto
        aux = p;

        this.result.push({
          iteracion,
          intervalo_a: a,
          intervalo_b: b,
          p,
          fa,
          fb,
          fp,
          error,
        });
        iteracion++;

        if (fp * fa < 0) {
          b = p;
        } else {
          a = p;
        }
        if (error < this.formBiseccion.get('tolerancia').value) {
          break;
        }
      }
    } catch (error) {
      alert(error.message);
    }
  }
}
