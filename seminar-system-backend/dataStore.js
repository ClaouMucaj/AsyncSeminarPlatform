// dataStore.js
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'db');

// Helper function to read a JSON file. If it does not exist, create it with a default value.
function readJSON(filename, defaultValue = []) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  const data = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing JSON file", filePath, error);
    return defaultValue;
  }
}

// Helper function to write data to a JSON file.
function writeJSON(filename, data) {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  getUsers: () => readJSON('users.json', []),
  saveUsers: (users) => writeJSON('users.json', users),
  getSeminars: () => readJSON('seminars.json', []),
  saveSeminars: (seminars) => writeJSON('seminars.json', seminars),
  getPurchases: () => readJSON('purchases.json', []),
  savePurchases: (purchases) => writeJSON('purchases.json', purchases)
};
