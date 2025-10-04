// ...existing code...
export default (sequelize, DataTypes) => {
  const Profile = sequelize.define("Profile", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    cityId: { type: DataTypes.INTEGER },
    role: {
      type: DataTypes.ENUM("mentor", "traveller", "admin"),
      allowNull: false,
    },
    trait_ids: { type: DataTypes.JSON, allowNull: true }, // array of Trait IDs
    description: { type: DataTypes.TEXT, allowNull: true },
  });
  return Profile;
};
// ...existing code...
