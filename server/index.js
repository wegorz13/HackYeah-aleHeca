import dotenv from "dotenv";
import express from "express";
import { Sequelize, DataTypes } from "sequelize";
import {faker} from '@faker-js/faker';
dotenv.config();

const sequelize = new Sequelize("sqlite::memory:", {
  logging: false,
});
const app = express();
app.use(express.json());


// ==========================
// 📦 MODEL DEFINITIONS
// ==========================

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  pictures: { type: DataTypes.BLOB("long"), allowNull: true },
});

const Profile = sequelize.define("Profile", {
  profileId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  cityId: { type: DataTypes.INTEGER },
  role: { type: DataTypes.ENUM("mentor", "mentee", "admin"), allowNull: false },
  trait_ids: { type: DataTypes.JSON, allowNull: true }, // array of trait IDs
});

const Match = sequelize.define("Match", {
  matchId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  mentorId: { type: DataTypes.INTEGER },
  userId: { type: DataTypes.INTEGER },
  receivedPositive: { type: DataTypes.BOOLEAN, defaultValue: false },
  expirationStamp: { type: DataTypes.DATE },
});

const Review = sequelize.define("Review", {
  reviewId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  authorId: { type: DataTypes.INTEGER },
  userId: { type: DataTypes.INTEGER },
  message: { type: DataTypes.TEXT },
  role: { type: DataTypes.ENUM("mentor", "mentee") },
  rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
});

const Trait = sequelize.define("Trait", {
  traitId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

// ==========================
// 🔗 RELATIONSHIPS
// ==========================
User.hasOne(Profile, { foreignKey: "userId" });
Profile.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Match, { foreignKey: "userId" });
Match.belongsTo(User, { foreignKey: "userId", as: "Mentee" });

Match.belongsTo(User, { foreignKey: "mentorId", as: "Mentor" });

// ==========================
// 🌱 MOCK SEED DATA
// ==========================
async function seedDatabase() {
  console.log("🌱 Seeding mock data...");

  // Traits
  const traits = await Trait.bulkCreate(
    ["Couch-surf", "Sports", "Art", "Pottery", "BeerBuddy"].map(
      (t) => ({ name: t })
    )
  );

  // Users
  const users = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return User.create({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
        pictures: Buffer.from(faker.image.dataUri({ width: 100, height: 100 })), // Mock binary blob
      });
    })
  );

  // Profiles
  for (const user of users) {
    const randomTraits = faker.helpers.arrayElements(traits, 2).map(
      (t) => t.traitId
    );
    await Profile.create({
      userId: user.id,
      cityId: faker.number.int({ min: 1, max: 100 }),
      role: faker.helpers.arrayElement(["mentor", "mentee"]),
      trait_ids: randomTraits,
    });
  }

  // Matches
  for (let i = 0; i < 5; i++) {
    await Match.create({
      mentorId: faker.helpers.arrayElement(users).id,
      userId: faker.helpers.arrayElement(users).id,
      receivedPositive: faker.datatype.boolean(),
      expirationStamp: faker.date.future(),
    });
  }

  // Reviews
  for (let i = 0; i < 10; i++) {
    await Review.create({
      authorId: faker.helpers.arrayElement(users).id,
      userId: faker.helpers.arrayElement(users).id,
      message: faker.lorem.sentences(2),
      role: faker.helpers.arrayElement(["mentor", "mentee"]),
      rating: faker.number.int({ min: 1, max: 5 }),
    });
  }

  console.log("✅ Mock data seeded!");
}

// ==========================
// 🚀 APP STARTUP
// ==========================
async function initDatabase() {
  await sequelize.sync({ force: true }); // recreate schema each run
  await seedDatabase();
}

app.get("/users", async (_, res) => res.json(await User.findAll()));
app.get("/profiles", async (_, res) => res.json(await Profile.findAll()));
app.get("/traits", async (_, res) => res.json(await Trait.findAll()));

app.get("/matches/:mentorId",async (req,res)=>{

  const mentorId = req.params.mentorId;
  const travellers = await Match.findOne({ where:{
    mentorId:mentorId
  },
  include:[{model:User, as:"Mentee"}]

});

  res.send(travellers);
});

const PORT = 3000;
app.listen(PORT, async () => {
  await initDatabase();
  console.log(`✅ Server running: http://localhost:${PORT}`);
});
