const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Question = require('./question.model');

class Answer extends Model { }

Answer.init({
  codAnswer: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'cod_answer'
  },
  answerType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'answer_type'
  },
  answerText: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'answer_text'
  },
  codQuestion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'cod_question',
    references: {
      model: Question,
      key: 'cod_question'
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
  modelName: 'Answer',
  tableName: 'answers',
  scopes: {
    withPassword: {
      attributes: {},
    }
  },
  timestamps: true,
  underscored: true,
});

Answer.belongsTo(Question, { as: "question", foreignKey: "cod_question" });

module.exports = Answer;
