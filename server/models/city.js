// ...existing code...
export default (sequelize, DataTypes) => {
  const City = sequelize.define("City", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
  });
  return City;
};
// ...existing code...
