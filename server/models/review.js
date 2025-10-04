// ...existing code...
export default (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    authorId: { type: DataTypes.INTEGER }, // Profile ID
    receiverId: { type: DataTypes.INTEGER }, // Profile ID
    message: { type: DataTypes.TEXT },
    role: { type: DataTypes.ENUM("mentor", "traveller") },
    rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
  });
  return Review;
};
// ...existing code...
