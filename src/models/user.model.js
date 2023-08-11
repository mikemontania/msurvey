const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const moment = require('moment');
const Survey = require('./survey.model');

const User = sequelize.define('User', {
    codUser: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'cod_user', // Utiliza snake_case en la base de datos
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    img: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    attempts: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        },
        field: 'created_at', // Utiliza snake_case en la base de datos
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
        },
        field: 'updated_at', // Utiliza snake_case en la base de datos
    },
}, {
    tableName: 'users', // Especifica el nombre de la tabla en snake_case
    timestamps: true,
    underscored: true,
  // Esto convierte los nombres de columnas de camelCase a snake_case
  underscored: true,
  // Esto convierte los nombres de modelos de pascalCase a snake_case
  freezeTableName: true,
});

User.hasMany(Survey, {
     foreignKey: 'codUser',
});

Survey.belongsTo(User, {
    foreignKey: 'codUser',
});

module.exports = User;
