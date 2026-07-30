const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error reading mock db collection ${collection}:`, error);
    return [];
  }
};

const writeData = (collection, data) => {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing mock db collection ${collection}:`, error);
    return false;
  }
};

const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const matches = (item, query) => {
  for (const key in query) {
    const val = query[key];
    if (val && typeof val === 'object') {
      if ('$in' in val) {
        if (!Array.isArray(val.$in)) continue;
        if (!val.$in.includes(item[key])) return false;
      } else if ('$ne' in val) {
        if (item[key] === val.$ne) return false;
      } else {
        // Fallback exact match for nested objects
        if (JSON.stringify(item[key]) !== JSON.stringify(val)) return false;
      }
    } else {
      if (item[key] !== val) return false;
    }
  }
  return true;
};

const mockDb = {
  find: async (collection, query = {}) => {
    const items = readData(collection);
    return items.filter(item => matches(item, query));
  },

  findOne: async (collection, query = {}) => {
    const items = readData(collection);
    return items.find(item => matches(item, query)) || null;
  },

  findById: async (collection, id) => {
    const items = readData(collection);
    return items.find(item => item._id === id) || null;
  },

  create: async (collection, data) => {
    const items = readData(collection);
    const newItem = {
      _id: generateId(),
      ...data,
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    writeData(collection, items);
    return newItem;
  },

  findByIdAndUpdate: async (collection, id, updateData) => {
    const items = readData(collection);
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;

    // Handle updates (flatten objects where needed, but simple merge is fine for our mock)
    items[index] = {
      ...items[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    writeData(collection, items);
    return items[index];
  },

  deleteOne: async (collection, query = {}) => {
    const items = readData(collection);
    const index = items.findIndex(item => matches(item, query));
    if (index === -1) return { deletedCount: 0 };
    items.splice(index, 1);
    writeData(collection, items);
    return { deletedCount: 1 };
  },

  deleteMany: async (collection, query = {}) => {
    const items = readData(collection);
    const beforeCount = items.length;
    const remaining = items.filter(item => !matches(item, query));
    writeData(collection, remaining);
    return { deletedCount: beforeCount - remaining.length };
  }
};

module.exports = mockDb;
