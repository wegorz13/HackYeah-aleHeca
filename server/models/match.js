// ...existing code...
export default (sequelize, DataTypes) => {
  const Match = sequelize.define("Match", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    mentorId: { type: DataTypes.INTEGER },
    travellerId: { type: DataTypes.INTEGER },
    receivedPositive: { type: DataTypes.BOOLEAN, defaultValue: false },
    expirationStamp: { type: DataTypes.DATE },
  });
  return Match;
};
// ...existing code...
