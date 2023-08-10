const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const moment = require('moment');
class User extends Model { }

User.init({
  codUser: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true, 
    field: 'cod_user' // Nombre de columna en snake_case para la base de datos
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  img: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  role: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  attempts: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  blocked: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  createdBy: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'AUTO_GENERADO'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'AUTO_GENERADO'
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users', // Nombre de tabla en plural y minúsculas
  // timestamps: false,
  scopes: {
    withPassword: {
      attributes: {},
    },
    withoutPassword: {
      attributes: { exclude: ['password'] },
    }
  },
  // defaultScope: {
  //   attributes: { exclude: ['password'] },
  // },
  // don't forget to enable timestamps!
  timestamps: true,
  underscored: true //BD con snake_case: cod_usuario, por default iguala todo

});

module.exports = User;
