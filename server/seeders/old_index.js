import { faker } from "@faker-js/faker";
import {
  User,
  Profile,
  Match,
  Review,
  Trait,
  City,
  Picture,
  Country,
} from "../models/index.js";

export default async function seedDatabase() {
  console.log("🌱 Seeding mock data...");

  const cities = await City.bulkCreate(
    Array.from({ length: 10 }).map((_, i) => ({ name: `City ${i + 1}` }))
  );

  const countries = await Country.bulkCreate(
    Array.from({ length: 10 }).map((_, i) => ({ name: `Country ${i + 1}` }))
  );

  const traitNames = ["Couch-surf", "Sports", "Art", "Pottery", "BeerBuddy"];
  await Trait.bulkCreate(traitNames.map((t) => ({ name: t })));

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
      country: faker.helpers.arrayElement(countries).name,
    });

    await Picture.bulkCreate(
      Array.from({ length: 3 }).map(() => ({
        userId: user.id,
        value: faker.image.url(),
      }))
    );

    users.push(user);
  }

  const profiles = [];
  for (const user of users) {
    const randomCity = faker.helpers.arrayElement(cities);
    const traitsForProfile = faker.helpers.arrayElements(traitNames, {
      min: 1,
      max: 3,
    });

    const profile = await Profile.create({
      userId: user.id,
      city: randomCity.name,
      role: faker.helpers.arrayElement(["mentor", "traveller"]),
      traits: traitsForProfile, // names
      description: faker.lorem.sentence(),
    });

    profiles.push(profile);
  }

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
}
