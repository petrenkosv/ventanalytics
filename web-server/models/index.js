const fs        = require("fs");
const path      = require("path");
const Sequelize = require("sequelize");

// Database connection
let sequelize = new Sequelize(process.env.DB_POSTGRES_DATABASE, process.env.DB_POSTGRES_LOGIN, process.env.DB_POSTGRES_PASSWORD, {
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT,
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: false,
    operatorsAliases: false
});

let db = {};

// Собираем список нужных директорий с моделями
const models = [
    __dirname,
    path.join(__dirname, "..", "..", "university", "models"),
    path.join(__dirname, "..", "..", "widgets", "models"),
    path.join(__dirname, "..", "..", "scraping", "models", "postgres")
];

// Выполняем обход по нужным директориям и записываем модели
for (var i in models) {
    fs.readdirSync(models[i])
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== "index.js") && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        let curPath = path.join(models[i], file);
        let model = sequelize.import(curPath);
        db[model.name] = model;
    });
}

// Подключаем модели
Object.keys(db).forEach((modelName) => {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
