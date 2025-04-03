export class Profile {
  constructor(data = {}) {
    this.data = data; // Используем сеттер при инициализации
  }

  set data({ name, about, avatar, _id, cohort } = {}) {
    Object.assign(this, { name, about, avatar, _id, cohort });
  }

  get data() {
    return {
      name: this.name,
      about: this.about,
      avatar: this.avatar,
      _id: this._id,
      cohort: this.cohort,
    };
  }
}
