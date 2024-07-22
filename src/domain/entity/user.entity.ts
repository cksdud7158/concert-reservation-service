export class UserEntity {
  id: number;
  creat_at: Date;
  update_at: Date;
  point: number;
  constructor(args: {
    id?: number;
    creat_at?: Date;
    update_at?: Date;
    point?: number;
  }) {
    Object.assign(this, args);
  }
}
