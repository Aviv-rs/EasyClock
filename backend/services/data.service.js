// dbService.js
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join('data.json');

function initData(){
    fs.writeFileSync('data.json', JSON.stringify([]));
}

function readData() {
    if(!fs.existsSync('data.json')) initData();
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeData(data) {
    if(!fs.existsSync('data.json')) initData();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function getAll() {
    return readData();
}

function getById(id) {
    const data = readData();
    return data.find(user => +user.id === +id);
}

function getByUsername(username) {
    const data = readData();
    return data.find(user => user.username === username);
}

function create(newItem) {
    const data = readData();
    const id = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
    newItem = {
        id,
        ...newItem
    };
    data.push(newItem);
    writeData(data);
    return newItem;
}

function update(id, newData) {
    const data = readData();
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
        data[index] = { ...data[index], ...newData };
        writeData(data);
        return true;
    }
    return false;
}


module.exports = {
    getAll,
    getById,
    create,
    update,
    getByUsername
};
