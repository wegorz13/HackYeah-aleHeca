// ...existing code...
import { faker } from "@faker-js/faker";
import {
  User,
  Profile,
  Match,
  Review,
  Trait,
  City,
  Picture,
} from "../models/index.js";

export default async function seedDatabase() {
  console.log("🌱 Seeding mock data...");

  // Cities
  const cities = await City.bulkCreate(
    Array.from({ length: 10 }).map((_, i) => ({ name: `City ${i + 1}` }))
  );

  // Traits
  const traits = await Trait.bulkCreate(
    ["Couch-surf", "Sports", "Art", "Pottery", "BeerBuddy"].map((t) => ({
      name: t,
    }))
  );

  // Users + Pictures
  const users = [];
  for (let i = 0; i < 10; i++) {
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
        value: faker.image.url(), // string URL
      }))
    );

    users.push(user);
  }

  // Profiles (1 per user; adjust as needed)
  const profiles = [];
  for (const user of users) {
    const randomCity = faker.helpers.arrayElement(cities);
    const randomTraits = faker.helpers
      .arrayElements(traits, { min: 1, max: 3 })
      .map((t) => t.id);

    const profile = await Profile.create({
      userId: user.id,
      cityId: randomCity.id,
      role: faker.helpers.arrayElement(["mentor", "traveller"]),
      trait_ids: randomTraits,
    });

    profiles.push(profile);
  }

  // Matches (between profiles)
  for (let i = 0; i < 8; i++) {
    const a = faker.helpers.arrayElement(profiles);
    let b = faker.helpers.arrayElement(profiles);
    while (b.id === a.id) b = faker.helpers.arrayElement(profiles);

    await Match.create({
      mentorId: a.role === "mentor" ? a.id : b.id,
      travellerId: a.role === "traveller" ? a.id : b.id,
      receivedPositive: faker.datatype.boolean(),
      expirationStamp: faker.date.soon({ days: 30 }),
    });
  }

  // Reviews (receiver is Profile)
  for (let i = 0; i < 20; i++) {
    const receiver = faker.helpers.arrayElement(profiles);
    let author = faker.helpers.arrayElement(profiles);
    while (author.id === receiver.id)
      author = faker.helpers.arrayElement(profiles);

    await Review.create({
      authorId: author.id,
      receiverId: receiver.id,
      message: faker.lorem.sentences(2),
      role: faker.helpers.arrayElement(["mentor", "traveller"]),
      rating: faker.number.int({ min: 1, max: 5 }),
    });
  }

  console.log("✅ Mock data seeded!");
}
// ...existing code...
