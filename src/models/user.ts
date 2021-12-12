export default class User {
  public id: number;
  public name: string;

  constructor(init: Partial<User> | undefined = undefined) {
    this.id = 0;
    this.name = '';

    if (init) Object.assign(this, init);
  }
}
