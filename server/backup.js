import dotenv from "dotenv";
import express from "express";
import { Sequelize, DataTypes, Op, where } from "sequelize";
import { faker, tr } from "@faker-js/faker";
dotenv.config();

const sequelize = new Sequelize("sqlite::memory:", {
  logging: false,
});
const app = express();
app.use(express.json());

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: true },
});

const Profile = sequelize.define("Profile", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  cityId: { type: DataTypes.INTEGER },
  role: {
    type: DataTypes.ENUM("mentor", "traveller", "admin"),
    allowNull: false,
  },
  trait_ids: {
    type: DataTypes.JSON,
    allowNull: true,
  },
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

async function seedDatabase() {
  console.log("🌱 Seeding mock data...");

  const cities = await City.bulkCreate(
    Array.from({ length: 10 }).map((_, i) => ({
      name: `City ${i + 1}`,
    }))
  );

  const traits = await Trait.bulkCreate(
    ["Couch-surf", "Sports", "Art", "Pottery", "BeerBuddy"].map((t) => ({
      name: t,
    }))
  );

  const users = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      const user = await User.create({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 70 }),
        contact: {
          instagram: faker.person.firstName(),
          phoneNumber: faker.phone.number("+1-###-###-####"),
          email: faker.internet.email(),
        },
      });

      await Picture.bulkCreate(
        Array.from({ length: 3 }).map(() => ({
          userId: user.id,
          value: faker.lorem.sentences(2),
        }))
      );

      return user;
    })
  );

  for (const user of users) {
    const randomCity = faker.helpers.arrayElement(cities);
    const randomTraits = faker.helpers
      .arrayElements(traits, 2)
      .map((t) => t.id);

    await Profile.create({
      userId: user.id,
      cityId: randomCity.id,
      role: faker.helpers.arrayElement(["mentor", "traveller"]),
      trait_ids: randomTraits,
    });
  }

  for (let i = 0; i < 5; i++) {
    await Match.create({
      mentorId: faker.helpers.arrayElement(users).id,
      travellerId: faker.helpers.arrayElement(users).id,
      receivedPositive: faker.datatype.boolean(),
      expirationStamp: faker.date.future(),
    });
  }

  for (let i = 0; i < 10; i++) {
    await Review.create({
      authorId: faker.helpers.arrayElement(users).id,
      receiverId: faker.helpers.arrayElement(users).id,
      message: faker.lorem.sentences(2),
      role: faker.helpers.arrayElement(["mentor", "traveller"]),
      rating: faker.number.int({ min: 1, max: 5 }),
    });
  }
}

async function initDatabase() {
  await sequelize.sync({ force: true });
  await seedDatabase();
}

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
      expirationDate.setDate(expirationDate.getDate() + 30);

      match = await Match.create({
        travellerId,
        mentorId,
        receivedPositive: false,
        expirationStamp: expirationDate,
      });
    } else if (role === "mentor") {
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

app.get("/profiles/check", async (req, res) => {
  const { userId, cityId } = req.query;
  const profile = await Profile.findOne(
    where({
      userId: userId,
      cityId: cityId,
    })
  );

  if (!profile) return res.status(404).send("Profile not found");
  res.json(profile.id);
});

app.get("/profiles/search", async (req, res) => {
  const profile = JSON.parse(req.query.profile);
  const role = profile.role == "traveller" ? "mentor" : "traveller";
  const profiles = await Profile.findAll({
    where: {
      role: role,
      cityId: profile.cityId,
    },
    include: [
      {
        model: User,
        include: [{ model: Picture }],
      },
    ],
  });

  const reviews = await Review.findAll(
    where({ receiverId: { [Op.in]: [profiles.map((p) => p.id)] } })
  );

  const cities = await City.findAll();
  const traits = await Trait.findAll();

  const profileResponse = profiles.map((p) => {
    const averageRating =
      reviews
        .filter((r) => r.receiverId === p.id)
        .reduce((sum, r) => sum + r.rating, 0) /
      (reviews.filter((r) => r.receiverId === p.id).length || 1);

    return {
      name: p.User.name,
      age: p.User.age,
      city: cities.find((c) => c.id === p.cityId)?.name,
      pictures: p.User.Pictures.map((pic) => pic.value),
      role: p.role,
      traits: traits
        .filter((trait) => p.trait_ids.includes(trait.id))
        .map((t) => t.name),
      averageRating: averageRating || 0,
    };
  });

  res.json(profileResponse);
});

app.get("/matches/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const userProfiles = await Profile.findAll({
      where: { userId },
    });

    const profileIds = userProfiles.map((profile) => profile.id);

    const matches = await Match.findAll({
      where: {
        [Op.or]: [
          { mentorId: { [Op.in]: profileIds } },
          { travellerId: { [Op.in]: profileIds } },
        ],
      },
      include: [
        {
          model: Profile,
          as: "Traveller",
          include: [
            {
              model: User,
              include: [{ model: Picture }],
            },
          ],
        },
        {
          model: Profile,
          as: "Mentor",
          include: [
            {
              model: User,
              include: [{ model: Picture }],
            },
          ],
        },
      ],
    });

    const cities = await City.findAll();
    const traits = await Trait.findAll();

    const matchedProfiles = matches.map((match) => {
      const matchedProfile = profileIds.includes(match.mentorId)
        ? match.Traveller
        : match.Mentor;

      return matchedProfile;
    });

    const profileResponse = matchedProfiles.map((profile) => {
      return {
        name: profile.User.name,
        age: profile.User.age,
        city: cities.find((city) => city.id === profile.cityId)?.name,
        pictures: profile.User.Pictures.map((pic) => pic.value),
        role: profile.role,
        traits: traits
          .filter((trait) => profile.trait_ids.includes(trait.id))
          .map((t) => t.name),
        contact: profile.User.contact,
      };
    });

    res.json(profileResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching matches.");
  }
});

app.post("/profiles", async (req, res) => {
  const { userId, cityId, role, trait_ids } = req.body;
  try {
    const profile = await Profile.create({
      userId,
      cityId,
      role,
      trait_ids,
    });
    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the profile." });
  }
});

app.post("/review", async (req, res) => {
  const { authorId, receiverId, message, role, rating } = req.body;

  try {
    const review = await Review.create({
      authorId,
      receiverId,
      message,
      role,
      rating,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while submitting the review." });
  }
});

app.post("/picture", async (req, res) => {
  const { userId, value } = req.body;
  try {
    const picture = await Picture.create({ userId, value });
    res.status(201).json(picture);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while uploading the picture." });
  }
});

app.post("/register", async (req, res) => {
  const { email, password, name, contact } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const newUser = await User.create({
      email,
      password,
      name,
      contact,
    });

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        contact: newUser.contact,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email: email,
      password: password,
    },
  });

  res.status(200).send(user.id);
});
