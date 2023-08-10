const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig'); 
class Option extends Model { }

Option.init({
  codOption: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'cod_option' // Nombre de columna en snake_case para la base de datos
  },
  optionText: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'option_text' // Nombre de columna en snake_case para la base de datos
  }
}, {
  sequelize,
  modelName: 'Option',
  tableName: 'options', // Nombre de tabla en plural y minúsculas
  timestamps: false
});
 
module.exports = Option;
