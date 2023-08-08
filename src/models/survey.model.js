const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const User = require('./user.model');
const Question = require('./question.model');

class Survey extends Model { }

Survey.init({
  codSurvey: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'cod_survey'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'creation_date'
  },
  codUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'cod_user',
    references: {
      model: User,
      key: 'cod_user'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    createdBy: {
      allowNull: false,
      type: DataTypes.STRING,
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
  }
}, {
  sequelize,
  modelName: 'Survey',
  tableName: 'surveys',
  scopes: {
    withPassword: {
      attributes: {},
    }
  },
  timestamps: true,
  underscored: true,

});

Survey.belongsTo(User, { as: "user", foreignKey: "cod_user" });

module.exports = Survey;
