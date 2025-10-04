// ...existing code...
import { Sequelize, DataTypes } from "sequelize";

import defineUser from "./user.js";
import defineProfile from "./profile.js";
import defineMatch from "./match.js";
import defineReview from "./review.js";
import defineTrait from "./trait.js";
import defineCity from "./city.js";
import definePicture from "./picture.js";
import defineCountry from "./country.js";

const sequelize = new Sequelize("sqlite::memory:", { logging: false });

// Initialize models
const User = defineUser(sequelize, DataTypes);
const Profile = defineProfile(sequelize, DataTypes);
const Match = defineMatch(sequelize, DataTypes);
const Review = defineReview(sequelize, DataTypes);
const Trait = defineTrait(sequelize, DataTypes);
const City = defineCity(sequelize, DataTypes);
const Picture = definePicture(sequelize, DataTypes);
const Country = defineCountry(sequelize, DataTypes);

// Associations
User.hasMany(Profile, { foreignKey: "userId" });
Profile.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Picture, { foreignKey: "userId" });
Picture.belongsTo(User, { foreignKey: "userId" });

Profile.belongsTo(City, { foreignKey: "cityId" });
City.hasMany(Profile, { foreignKey: "cityId" });

// Reviews reference users (matches your usage in /profiles/search)
User.hasMany(Review, { foreignKey: "authorId", as: "AuthoredReviews" });
User.hasMany(Review, { foreignKey: "receiverId", as: "ReceivedReviews" });
Review.belongsTo(User, { foreignKey: "receiverId", as: "Receiver" });
Review.belongsTo(User, { foreignKey: "authorId", as: "Author" });

// Matches reference Profiles for both sides
Match.belongsTo(Profile, { foreignKey: "travellerId", as: "Traveller" });
Match.belongsTo(Profile, { foreignKey: "mentorId", as: "Mentor" });
Profile.hasMany(Match, { foreignKey: "travellerId", as: "TravellerMatches" });
Profile.hasMany(Match, { foreignKey: "mentorId", as: "MentorMatches" });

export {
  sequelize,
  User,
  Profile,
  Match,
  Review,
  Trait,
  City,
  Picture,
  Country,
};
// ...existing code...
