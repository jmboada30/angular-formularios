import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PaisService {
  constructor(private http: HttpClient) {}
  // como la peticion me devuelve muchos datos puedo hacer un filtro desde aqui para solo manejar los datos q quiero.
  getPaises() {
    return this.http.get('https://restcountries.eu/rest/v2/lang/es').pipe(
      map((res: any[]) => {
        return res.map(pais => {
          return {
            nombre: pais.name,
            codigo: pais.alpha3Code
          };
        });
      })
    );
  }
}
