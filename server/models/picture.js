export default (sequelize, DataTypes) => {
  const Picture = sequelize.define("Picture", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER },
    value: { type: DataTypes.BLOB("long"), allowNull: false },
    order: { type: DataTypes.INTEGER, allowNull: true },
  });
  return Picture;
};
