export default (sequelize, DataTypes) => {
  const Trait = sequelize.define("Trait", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
  });
  return Trait;
};
