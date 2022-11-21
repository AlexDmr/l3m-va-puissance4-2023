import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { play } from '../data/play';
import {GAME_STATE, getEmptyGrid, PLAYER} from "../data/grid";
import {winner} from "../data/winner";
import {genNb} from "../grid/grid.component";
import {isValid} from "../data/isValid";
import {CopypasteService} from "../copypaste.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent implements OnInit {
  state: GAME_STATE = {
    turn: "P1",
    grid: getEmptyGrid()
  }
  hover = -1;
  error = "";

  constructor(private cp: CopypasteService) { }

  ngOnInit(): void {
  }

  copyGS() {
    this.cp.copyGameState( this.state );
  }
  pasteGS() {
    const state = this.cp.pasteGameState();
    if (state) {
      this.state = state;
    }
  }
  get canPasteGS(): Observable<boolean> {
    return this.cp.canPasteGS;
  }

  play(col: number) {
    const res = play(this.state, col + 1)
    if (res.success) {
      this.error = "";
      this.state = res.state;
    } else {
      this.error = res.reason;
    }
  }

  get winner() {
    return winner(this.state)
  }

  get nbP1(): number {
    return this.nb("P1")
  }

  get nbP2(): number {
    return this.nb("P2")
  }

  private nb(p: GAME_STATE["turn"]): number {
    return this.state.grid.reduce(
      (nb, L) => nb + L.reduce( (n, c) => c === p ? 1 + n : n, 0)
      , 0
    )
  }

  get nbLines(): number {
    return Math.max(6, this.state.grid.reduce( (n, L) => n < L.length ? L.length : n, 0) )
  }

  get lines() {
    return [...genNb(this.state.grid, 6)];
  }

  columns(nbL: number): (PLAYER | "EMPTY")[] {
    return this.state.grid.map( col => col[nbL] ?? "EMPTY" );
  }

  get validity(): string {
    const res = isValid(this.state);
    if (res.valid) {
      return "";
    } else {
      return res.reason;
    }
  }

}
