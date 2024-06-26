const db = require('../../data/dbConfig'); 

function find() {
    return db('users').select('id', 'username');
}

async function findBy(filter) {
    const user = await db('users').where(filter).first();
    return user || null; 
}

async function add(user) {
    const [id] = await db('users').insert(user, 'id');
    return findById(id);
}

function findById(id) {
    return db('users').where({ id }).select('id', 'username').first();
}

module.exports = {
    add,
    find,
    findBy,
    findById,
};