import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

interface ErrorValidate {
  [s: string]: boolean
}

@Injectable({
  providedIn: 'root',
})
export class ValidacionesService {
  constructor() { }


  // A continuacion crearemos una validacion personalizada.
  // La validacion NO PERMITIRA QUE COLOQUEN BOADAs COMO APELLIDO.!!
  noAceptarBoada(control: FormControl): ErrorValidate {
    if (control.value?.toLowerCase() === 'boadas') {
      return { noBoada: true };
    }
    return null;
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {

    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass2Name];
      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    };

  }

  existeUsuario( control:FormControl):Promise<ErrorValidate> | Observable<ErrorValidate> {

    if (!control.value) {
      return Promise.resolve(null)
    }
    return new Promise( (resolve,reject) => {
      setTimeout(() => {
        if (control.value === 'Ryuz') {
          resolve({existe:true})
        }else {
          resolve(null)
        }
      }, 3500);
    })

  }
}
