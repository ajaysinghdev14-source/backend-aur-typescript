// Ek in memory DB
// save('user-1', { name: 'John Doe' })

// HashMap (key, value)
//           T?, T?

type UserId = string;

interface User {
  id: UserId;
  fname: string;
  lname: string;
  email: string;
  contact: {
    moblie: string;
  };
  address: {
    street: number;
    pin: number;
    country: string;
  };
}

class InMemoryDB {
  private _db: Map<UserId, User>;
  constructor() {}

  public insertUser(data: User) {
    if (this._db.has(data.id)) {
    }

    this._db.set(data.id, data);
  }
}
