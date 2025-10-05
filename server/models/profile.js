// ...existing code...
export default (sequelize, DataTypes) => {
  const Profile = sequelize.define("Profile", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    city: { type: DataTypes.INTEGER },
    role: {
      type: DataTypes.ENUM("mentor", "traveller", "admin"),
      allowNull: false,
    },
    traits: { type: DataTypes.JSON, allowNull: true }, // array of trait names
    description: { type: DataTypes.TEXT, allowNull: true },
    date: { type: DataTypes.TEXT, allowNull: true },
  });
  return Profile;
};
// ...existing code...
