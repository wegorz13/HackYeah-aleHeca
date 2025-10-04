// ...existing code...
export default (sequelize, DataTypes) => {
  const Picture = sequelize.define("Picture", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER },
    value: { type: DataTypes.TEXT, allowNull: false }, // store strings
  });
  return Picture;
};
// ...existing code...
