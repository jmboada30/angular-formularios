import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PaisService } from '../../services/pais.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  usuario = {
    nombre: 'Joel',
    apellido: 'Boada',
    correo: 'jmboada30@gmail.com',
    pais: 'VEN',
    genero: 'M'
  };
  paises: any[] = [];

  constructor(private paisService: PaisService) {}

  ngOnInit(): void {
    this.paisService.getPaises().subscribe(paises => {
      this.paises = paises;
      this.paises.unshift({
        nombre: ['Seleccione un país'],
        codigo: ''
      });
      console.log(this.paises);
    });
  }

  guardar(f: NgForm) {
    Object.values(f.controls).forEach(control => {
      control.markAllAsTouched();
    });
    console.log(f.value);
  }
}
