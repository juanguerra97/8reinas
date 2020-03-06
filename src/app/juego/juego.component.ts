import { Component, OnInit } from '@angular/core';
import { Casilla } from '../casilla/casilla.component';
import { faWindowRestore, faSearch, faRecycle, faChess, faDice, faPlay, faSkull } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.scss']
})
export class JuegoComponent implements OnInit {

  public reinasColocadas = 0;
  public casillas: Casilla[][] = [];

  faSearch = faPlay;
  faIcon = faSkull;

  constructor() {
    this.inicializarTablero();
  }

  ngOnInit() {
  }

  public inicializarTablero(): void {
    this.reinasColocadas = 0;
    let rowPar = false;
    let colPar = false;
    this.casillas = [];
    // creacion de casillas
    for (let row = 0; row < 8; ++row) {
      rowPar = row % 2 === 0;
      this.casillas[row] = []; // crea el arreglo de la fila
      for (let col = 0; col < 8; ++col) {
        colPar = col % 2 === 0;
        if (rowPar) {
          this.casillas[row][col] = new Casilla(row, col, colPar);
        } else {
          this.casillas[row][col] = new Casilla(row, col, !colPar);
        }

      }
    }
  }

  // metodo que se llama cada vez que una casilla pasa a estar ocupada o a desocuparse
  public onCambioCasillaOcupada(casilla: Casilla): void {

    let row = 0;
    let col = 0;

    // modifica las casillas en la fila
    for (col = 0; col < 8; ++col) {
      if (col === casilla.col) continue;
      if (casilla.ocupada) {
        this.casillas[casilla.row][col].atacantes++;
      } else {
        this.casillas[casilla.row][col].atacantes--;
      }
    }

    // modifica las casillas en la columna
    for (row = 0; row < 8; ++row) {
      if (row === casilla.row) continue;
      if (casilla.ocupada) {
        this.casillas[row][casilla.col].atacantes++;
      } else {
        this.casillas[row][casilla.col].atacantes--;
      }
    }

    // hacia arriba a la izquierda
    for (row = casilla.row - 1, col = casilla.col - 1; row >= 0 && col >= 0; --row, --col) {
      if (casilla.ocupada) {
        this.casillas[row][col].atacantes++;
      } else {
        this.casillas[row][col].atacantes--;
      }
    }

    // hacia arriba a la derecha
    for (row = casilla.row - 1, col = casilla.col + 1; row >= 0 && col < 8; --row, ++col) {
      if (casilla.ocupada) {
        this.casillas[row][col].atacantes++;
      } else {
        this.casillas[row][col].atacantes--;
      }
    }

    // hacia abajo a la izquierda
    for (row = casilla.row + 1, col = casilla.col - 1; row < 8 && col >= 0; ++row, --col) {
      if (casilla.ocupada) {
        this.casillas[row][col].atacantes++;
      } else {
        this.casillas[row][col].atacantes--;
      }
    }

    // hacia abajo a la derecha
    for (row = casilla.row + 1, col = casilla.col + 1; row < 8 && col < 8; ++row, ++col) {
      if (casilla.ocupada) {
        this.casillas[row][col].atacantes++;
      } else {
        this.casillas[row][col].atacantes--;
      }
    }

    if (casilla.ocupada) {
      this.reinasColocadas++;
    } else {
      this.reinasColocadas--;
    }

    if (this.reinasColocadas === 8) {
      console.log('Has ganado!');
    }

  }

  public buscarSolucion(): void {

    if (this.reinasColocadas > 0) {
      this.inicializarTablero();
    }

    for (let col = 0; col < 8; ++col) {
      for (const row of this.ordenarRandom([0, 1, 2, 3, 4, 5, 6, 7])) {
        if (this.probarMovimiento(this.casillas[row][col], col)) {
          return;
        }
      }
    }

  }

  private probarMovimiento(casilla: Casilla, colActual: number): boolean {

    if (!casilla.ocupada && casilla.atacantes === 0) {
      casilla.ocupada = true; // instenta el movimiento
      this.onCambioCasillaOcupada(casilla);

      if (this.reinasColocadas === 8) {
        return true;
      } else {
        ++colActual;
        if (colActual < 8) {
          for (const row of this.ordenarRandom([0, 1, 2, 3, 4, 5, 6, 7])) {
            if (this.probarMovimiento(this.casillas[row][colActual], colActual)) {
              return true;
            }
          }
        }
      }

      casilla.ocupada = false; // deshace el movimiento
      this.onCambioCasillaOcupada(casilla);

    }
    return false;
  }

  // funcion para ordernar un arreglo aleatoriamente
  private ordenarRandom(arreglo: any[]): any[] {

    let randPos = 0;
    for (let i = 0; i < arreglo.length; ++i) {
      randPos = i % 2 === 0 ? Math.floor(Math.random() * 7) : Math.ceil(Math.random() * 7);
      const temp = arreglo[i];
      arreglo[i] = arreglo[randPos];
      arreglo[randPos] = temp;
    }

    return arreglo;
  }

}
