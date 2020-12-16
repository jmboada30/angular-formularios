import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidacionesService } from 'src/app/services/validaciones.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css'],
})

export class ReactiveComponent implements OnInit {
  formulario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private validaciones: ValidacionesService) {
    this.crearFormulario();
    this.cargarDataAlFormulario();
    this.crearListeners();
  }

  ngOnInit(): void { }

  get nombreNoValido() {
    return (
      this.formulario.get('nombre').invalid &&
      this.formulario.get('nombre').touched
    );
  }

  get apellidoNoValido() {
    return (
      this.formulario.get('apellido').invalid &&
      this.formulario.get('apellido').touched
    );
  }

  get correoNoValido() {
    return (
      this.formulario.get('correo').invalid &&
      this.formulario.get('correo').touched
    );
  }
  
  get usuarioNoValido() {
    return (
      this.formulario.get('usuario').invalid &&
      this.formulario.get('usuario').touched
    );
  }

  get distritoNoValido() {
    return (
      this.formulario.get('direccion.distrito').invalid &&
      this.formulario.get('direccion.distrito').touched
    );
  }

  get ciudadNoValida() {
    return (
      this.formulario.get('direccion.ciudad').invalid &&
      this.formulario.get('direccion.ciudad').touched
    );
  }

  get pass1NoValido() {
    return (
      this.formulario.get('pass1').invalid &&
      this.formulario.get('pass1').touched
    );
  }

  get pass2NoValido() {
    const pass1 = this.formulario.get('pass1').value;
    const pass2 = this.formulario.get('pass2').value;
    return pass1 === pass2 ? false : true;
  }

  get pasatiempos() {
    return this.formulario.get('pasatiempos') as FormArray;
  }

  // A continuacion con ayuda de formBuilder crearemos el metodo para crear un formulario a nivel de JS, lo que nos permitira validar todos los campos de dicho formulario de forma reactiva y sin llenar de tanto codigo el HTML (recordar que mientras mas simple sea el HTML mejor sera.)
  crearFormulario() {
    this.formulario = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      apellido: ['', [Validators.required, Validators.minLength(2), this.validaciones.noAceptarBoada]],
      correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      usuario: ['', Validators.required, this.validaciones.existeUsuario], /*1ero valor por defecto, 2do validacion sinc y 3ero validacion asincrona*/
      pass1: ['', Validators.required],
      pass2: ['', Validators.required],
      direccion: this.formBuilder.group({ distrito: ['', Validators.required], ciudad: ['', Validators.required] }),
      pasatiempos: this.formBuilder.array([]),
    }, {
      validators: this.validaciones.passwordsIguales('pass1', 'pass2')
    });
  }

  crearListeners(){
    
    // La sig linea permite observar los cambios por cada letra presionada en cualquier campo del form
    // this.formulario.valueChanges.subscribe( valor => console.log(valor));

    // la sig linea captura el status del formulario. Es decir si es valido o invalido
    // this.formulario.statusChanges.subscribe( status => console.log(status));

    // Si lo que queremos es observar SOLO UN CAMPO la hacemos asi:
    this.formulario.get('pass1').valueChanges.subscribe( valor => {console.log(valor)})

  }
  // con esta funcion agregaremos un elemento al ARRAY pasatiempos
  agregarPasatiempo() {
    this.pasatiempos.push(this.formBuilder.control(''));
  }
  // con esta funcion BORRAMOS un elemento al ARRAY pasatiempos
  borrarPasatiempo(index: number) {
    this.pasatiempos.removeAt(index);
  }

  // Con esta funcion podemos cargar data que venga de un backend por ejemplo cuando deseamos editar
  // UN TRUCO: Debido a que .setValue() es muy estricto se puede usar en su lugar .reset()

  cargarDataAlFormulario() {
    // this.formulario.setValue({
    this.formulario.reset({
      nombre: 'Joel',
      apellido: 'Boada',
      correo: 'jmboada30@gmail.com',
      pass1:'123',
      pass2:'123',
      direccion: {
        distrito: 'Chorrillos',
        ciudad: 'Lima',
      },
    });

    // para cargar un Array a pasatiempos que venga del backend podria ser:
    const pasatiemposBackend = ['comer'];
    pasatiemposBackend.forEach((item) =>
      this.pasatiempos.push(this.formBuilder.control(item))
    );
  }

  // Para guardar los datos en el form, NOTESE que se realizan las validaciones antes de hacerlo!!
  guardar() {
    console.log(this.formulario);

    //  VALIDACIONES (Si fallan se mostraran los mensajes de dichas fallas en la misma pagina)
    if (this.formulario.invalid) {
      return Object.values(this.formulario.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          return Object.values(control.controls).forEach((subcontrol) => {
            subcontrol.markAllAsTouched();
          });
        } else {
          return control.markAllAsTouched();
        }
      });
    }

    // para resetear un formulario despues de usarlo
    this.formulario.reset();
  }
}
