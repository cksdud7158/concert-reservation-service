import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";

export class ConcertScheduleEntity {
  constructor(
    private _id: number,
    private _creat_at: Date,
    private _update_at: Date,
    private _date: Date,
    private _concert?: Partial<Concert>,
    private _seats?: Partial<ConcertSeat[]>,
  ) {}

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get creat_at(): Date {
    return this._creat_at;
  }

  set creat_at(value: Date) {
    this._creat_at = value;
  }

  get update_at(): Date {
    return this._update_at;
  }

  set update_at(value: Date) {
    this._update_at = value;
  }

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }

  get concert(): Partial<Concert> {
    return this._concert;
  }

  set concert(value: Partial<Concert>) {
    this._concert = value;
  }

  get seats(): Partial<ConcertSeat[]> {
    return this._seats;
  }

  set seats(value: Partial<ConcertSeat[]>) {
    this._seats = value;
  }
}
