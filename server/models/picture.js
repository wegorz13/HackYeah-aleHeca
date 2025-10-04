// ...existing code...
export default (sequelize, DataTypes) => {
  const Picture = sequelize.define("Picture", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER },
    value: { type: DataTypes.BLOB("long"), allowNull: false }, // store blob
    order: {type:DataTypes.INTEGER, allowNull:true} //optional order for placement of images.
  });
  return Picture;
};
// ...existing code...
