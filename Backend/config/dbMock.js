import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

class MockModel {
  constructor(modelName, data) {
    this._modelName = modelName;
    this._data = { 
      _id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      ...data 
    };
    Object.assign(this, this._data);
  }

  async save() {
    const list = MockModel._load(this._modelName);
    const existingIndex = list.findIndex(item => item._id === this._id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...this._serialize() };
    } else {
      list.push(this._serialize());
    }
    MockModel._save(this._modelName, list);
    return this;
  }

  _serialize() {
    const serialized = { ...this };
    delete serialized._modelName;
    delete serialized._data;
    return serialized;
  }

  static _getPath(modelName) {
    return path.resolve(`./db_${modelName}.json`);
  }

  static _load(modelName) {
    const filePath = this._getPath(modelName);
    if (!fs.existsSync(filePath)) {
      if (modelName === 'user') {
        const seedUser = [
          {
            _id: "testuser123",
            name: "Test User",
            email: "test@example.com",
            password: "$2b$10$63nkJSt6Z9gpa1bZPB082OjRKi1qSgJi9tU2L7m8FFX6JBDbfAxQO",
            role: "user",
            cartData: {},
            createdAt: new Date().toISOString()
          }
        ];
        this._save(modelName, seedUser);
        return seedUser;
      }
      return [];
    }
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
      return [];
    }
  }

  static _save(modelName, list) {
    const filePath = this._getPath(modelName);
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  }

  static async find(query = {}) {
    const list = this._load(this._modelName);
    if (Object.keys(query).length === 0) return list;
    return list.filter(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  static async findOne(query = {}) {
    const list = this._load(this._modelName);
    const found = list.find(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    return found ? new MockModel(this._modelName, found) : null;
  }

  static async findById(id) {
    const list = this._load(this._modelName);
    const found = list.find(item => item._id === id);
    return found ? new MockModel(this._modelName, found) : null;
  }

  static async findByIdAndUpdate(id, update) {
    const list = this._load(this._modelName);
    const index = list.findIndex(item => item._id === id);
    if (index >= 0) {
      // Handle mongoose $set / direct updates
      const updatedFields = update.$set ? { ...update, ...update.$set } : update;
      delete updatedFields.$set;
      
      list[index] = { ...list[index], ...updatedFields };
      this._save(this._modelName, list);
      return new MockModel(this._modelName, list[index]);
    }
    return null;
  }

  static async findByIdAndDelete(id) {
    let list = this._load(this._modelName);
    const initialLength = list.length;
    const item = list.find(item => item._id === id);
    list = list.filter(item => item._id !== id);
    if (list.length !== initialLength) {
      this._save(this._modelName, list);
      return new MockModel(this._modelName, item);
    }
    return null;
  }
}

export default function createModelWrapper(modelName, realModel) {
  const mockClass = class extends MockModel {
    constructor(data) {
      super(modelName, data);
    }
  };
  mockClass._modelName = modelName;

  // Explicitly bind static methods to the mockClass so 'this._modelName' works correctly
  mockClass.find = (query) => MockModel.find.call(mockClass, query);
  mockClass.findOne = (query) => MockModel.findOne.call(mockClass, query);
  mockClass.findById = (id) => MockModel.findById.call(mockClass, id);
  mockClass.findByIdAndUpdate = (id, update) => MockModel.findByIdAndUpdate.call(mockClass, id, update);
  mockClass.findByIdAndDelete = (id) => MockModel.findByIdAndDelete.call(mockClass, id);

  const handler = {
    construct(target, args) {
      if (mongoose.connection.readyState === 1) {
        return new realModel(...args);
      } else {
        return new mockClass(...args);
      }
    },
    get(target, prop) {
      if (mongoose.connection.readyState === 1) {
        const val = realModel[prop];
        return typeof val === 'function' ? val.bind(realModel) : val;
      } else {
        if (typeof mockClass[prop] !== 'undefined') {
          return typeof mockClass[prop] === 'function' ? mockClass[prop].bind(mockClass) : mockClass[prop];
        }
        return undefined;
      }
    }
  };

  return new Proxy(realModel, handler);
}
