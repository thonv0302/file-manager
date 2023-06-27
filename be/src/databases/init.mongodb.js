const mongoose = require('mongoose');
const connectString = `mongodb+srv://thonv0302:chemgio123@trainning.55stg.mongodb.net/image-manager`;

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => {
        console.log(`Connected Mongodb Success Pro`);
      })
      .catch((err) => console.log(`Error Connect!`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
