import {Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { faChessQueen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-casilla',
  templateUrl: './casilla.component.html',
  styleUrls: ['./casilla.component.scss']
})
export class CasillaComponent implements OnInit {

  faChessQueen = faChessQueen;

  @Input('casilla') casilla: Casilla = null;
  @Output('oncambioocupada') onCambioOcupacion: EventEmitter<Casilla> = new EventEmitter<Casilla>();

  constructor() { }

  ngOnInit() {
  }

  public onCasillaClicked(): void {
    if (this.casilla.ocupada) {
      this.casilla.ocupada = false;
      this.onCambioOcupacion.emit(this.casilla);
    } else if (this.casilla.atacantes === 0) {
      this.casilla.ocupada = true;
      this.onCambioOcupacion.emit(this.casilla);
    }
  }

}

export class Casilla {
  public row = 0;
  public col = 0;
  public esPar = false;
  public atacantes = 0;
  public ocupada = false;

  constructor(row: number, col: number, esPar: boolean) {
    this.row = row;
    this.col = col;
    this.esPar = esPar;
  }

}
