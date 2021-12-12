export default class User {
  public id: number;
  public name: string;

  constructor(init: Partial<User> | undefined) {
    if (init) {
    }
    this.id = 0;
    this.name = '';
  }
}
