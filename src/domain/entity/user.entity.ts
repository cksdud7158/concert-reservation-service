export class UserEntity {
  id: number;
  creat_at: Date;
  update_at: Date;
  point: number;
  constructor(
    args: Partial<{
      id: number;
      creat_at: Date;
      update_at: Date;
      point: number;
    }>,
  ) {
    Object.assign(this, args);
  }
}
