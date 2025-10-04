import dotenv from "dotenv";
import express from "express";
import { Sequelize, DataTypes } from "sequelize";
import { faker } from "@faker-js/faker";
dotenv.config();

const sequelize = new Sequelize("sqlite::memory:", {
  logging: false,
});
const app = express();
app.use(express.json());

// ==========================
// 📦 MODEL DEFINITIONS
// ==========================

const TRAITS = ["Couch-surf", "Sports", "Art", "Pottery", "BeerBuddy"];
const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
});

const Profile = sequelize.define("Profile", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  cityId: { type: DataTypes.INTEGER },
  role: {
    type: DataTypes.ENUM("mentor", "traveller", "admin"),
    allowNull: false,
  },
  trait_ids: { type: DataTypes.JSON, allowNull: true , get() {
    const value = this.getDataValue("trait_ids");
    return value.map(trait_num=> TRAITS[trait_num]);
  },},
});

const Match = sequelize.define("Match", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  mentorId: { type: DataTypes.INTEGER },
  travellerId: { type: DataTypes.INTEGER },
  receivedPositive: { type: DataTypes.BOOLEAN, defaultValue: false },
  expirationStamp: { type: DataTypes.DATE },
});

const Review = sequelize.define("Review", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  authorId: { type: DataTypes.INTEGER },
  receiverId: { type: DataTypes.INTEGER },
  message: { type: DataTypes.TEXT },
  role: { type: DataTypes.ENUM("mentor", "traveller") },
  rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
});

const Trait = sequelize.define("Trait", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const City = sequelize.define("City", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const Picture = sequelize.define("Picture", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER },
  value: { type: DataTypes.BLOB, allowNull: false },
});

// ==========================
// 🔗 RELATIONSHIPS
// ==========================
User.hasMany(Profile, { foreignKey: "userId" });
Profile.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Review, { foreignKey: "authorId", as: "AuthoredReviews" });
User.hasMany(Review, { foreignKey: "receiverId", as: "ReceivedReviews" });
Review.belongsTo(User, { foreignKey: "authorId" });
Review.belongsTo(User, { foreignKey: "receiverId" });

User.hasMany(Picture, { foreignKey: "userId" });
Picture.belongsTo(User, { foreignKey: "userId" });

Profile.belongsTo(City, { foreignKey: "cityId" });
City.hasMany(Profile, { foreignKey: "cityId" });

Profile.hasMany(Match, { foreignKey: "userId" });
Match.belongsTo(Profile, { foreignKey: "travellerId", as: "Traveller" });
Match.belongsTo(Profile, { foreignKey: "mentorId", as: "Mentor" });

// ==========================
// 🌱 MOCK SEED DATA
// ==========================
async function seedDatabase() {
  console.log("🌱 Seeding mock data...");

  // Seed Cities
  const cities = await City.bulkCreate(
    Array.from({ length: 10 }).map((_, i) => ({
      name: `City ${i + 1}`,
    }))
  );

  // Traits
  const traits = await Trait.bulkCreate(
    ["Couch-surf", "Sports", "Art", "Pottery", "BeerBuddy"].map((t) => ({
      name: t,
    }))
  );

  // Users
  const users = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return User.create({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
      });
    })
  );

  // Profiles
  for (const user of users) {
    const randomCity = faker.helpers.arrayElement(cities); // Pick a valid city
    const randomTraits = faker.helpers
      .arrayElements(traits, 2)
      .map((t) => t.id); // Use valid trait IDs

    await Profile.create({
      userId: user.id,
      cityId: randomCity.id, // Use a valid city ID
      role: faker.helpers.arrayElement(["mentor", "traveller"]),
      trait_ids: randomTraits,
    });
  }

  // Matches
  for (let i = 0; i < 5; i++) {
    await Match.create({
      mentorId: faker.helpers.arrayElement(users).id,
      travellerId: faker.helpers.arrayElement(users).id,
      receivedPositive: faker.datatype.boolean(),
      expirationStamp: faker.date.future(),
    });
  }

  // Reviews
  for (let i = 0; i < 10; i++) {
    await Review.create({
      authorId: faker.helpers.arrayElement(users).id,
      receiverId: faker.helpers.arrayElement(users).id,
      message: faker.lorem.sentences(2),
      role: faker.helpers.arrayElement(["mentor", "traveller"]),
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

// ==========================
// ENDPOINTS
// ==========================

app.get("/users", async (_, res) => res.json(await User.findAll()));
app.get("/profiles", async (_, res) => res.json(await Profile.findAll()));
app.get("/traits", async (_, res) => res.json(await Trait.findAll()));
app.get("/cities", async (_, res) => res.json(await City.findAll()));

app.post("/like", async (req, res) => {
  try {
    const { travellerId, mentorId, role } = req.body;
    let match;

    if (role === "traveller") {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30); // +30 days

      match = await Match.create({
        travellerId,
        mentorId,
        receivedPositive: false,
        expirationStamp: expirationDate,
      });
    } else if (role === "mentor") {
      // Mentor "likes back" → update match
      match = await Match.findOne({
        where: { travellerId, mentorId },
      });

      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      await match.update({ receivedPositive: true });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    return res.status(201).json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//pass your profile or just role and cityId
app.get("/profiles", async (req, res) => {
  const data = JSON.parse(req.query.params);
  const role = data.role == "traveller" ? "mentor" : "traveller";
    const profiles = await Profile.findAll({
      where: {
        role: role,
        cityId: data.cityId
      },
      include: [
        {
          model: User,
          include: [{ model: Picture }],
        },
      ],
    });
  

    const traits = ["Couch-surf", "Sports", "Art", "Pottery", "BeerBuddy"];

    
  res.send(profiles);
});

// app.get("/matches/:profileId", async (req, res) => {
//   const profileId = req.params.profileId;
//   const matches = await Match.findAll({
//     where: {
//       [Op.or]: [{ mentorId: profileId }, { travellerId: profileId }],
//     },
//     include: [
//       { model: Profile, as: "Traveller" },
//       { model: Profile, as: "Mentor" },
//     ],
//   });

//   const travellers = matches.map((m) => m.Traveller);

//   res.send(travellers);
// });

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email: email,
      password: password,
    },
  });

  res.send(user.id);
});

const PORT = 3000;
app.listen(PORT, async () => {
  await initDatabase();
  console.log(`✅ Server running: http://localhost:${PORT}`);
});
