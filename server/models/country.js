// ...existing code...
export default (sequelize, DataTypes) => {
  const Country = sequelize.define("Country", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
  });
  return Country;
};
// ...existing code...
