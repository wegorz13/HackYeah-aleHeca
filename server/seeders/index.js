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
import fs from "fs";
import path from "path";

export default async function seedDatabase() {
  console.log("🌱 Seeding mock data...");

  const unique = (genFn, count) => {
    const set = new Set();
    while (set.size < count) {
      set.add(genFn());
      if (set.size > count * 2) break;
    }
    return Array.from(set).slice(0, count);
  };

  const cityNames = [
    "Tokyo",
    "Paris",
    "Berlin",
    "Ottawa",
    "Canberra",
    "Brasília",
    "Nairobi",
    "Seoul",
    "Madrid",
    "Cairo",
  ];
  const cities = await City.bulkCreate(cityNames.map((name) => ({ name })));

  const countryNames = unique(() => faker.location.country(), 20);
  const countries = await Country.bulkCreate(
    countryNames.map((name) => ({ name }))
  );

  const traitNames = [
    "Hiking",
    "Photo",
    "Cook",
    "Guide",
    "Music",
    "Coffee",
    "Cycle",
    "Museums",
    "StreetFood",
    "Night",
    "Early",
    "History",
    "Board",
    "Language",
    "Tech",
    "Books",
    "Yoga",
    "Surf",
    "Trail",
    "Beer",
    "Tea",
    "Eco",
    "Arch",
    "Vintage",
    "Film",
    "Sports",
    "OpenMic",
    "Pottery",
    "Couch",
  ];
  await Trait.bulkCreate(traitNames.map((t) => ({ name: t })));

  const users = [];
  for (let i = 0; i < 10; i++) {
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    const fullName = `${first} ${last}`;
    const user = await User.create({
      email: faker.internet
        .email({ firstName: first, lastName: last })
        .toLowerCase(),
      password: faker.internet.password(),
      name: fullName,
      age: faker.number.int({ min: 18, max: 70 }),
      contact: {
        instagram: `${first.toLowerCase()}_${faker.string.alphanumeric(4)}`,
        phoneNumber: faker.phone.number("+1-###-###-####"),
        email: faker.internet
          .email({ firstName: first, lastName: last })
          .toLowerCase(),
      },
      country: faker.helpers.arrayElement(countries).name,
    });
    users.push(user);
  }

  try {
    const picsDir = path.join(
      process.cwd(),
      "seeders",
      "seed-assets",
      "pictures"
    );
    console.log(picsDir);
    if (fs.existsSync(picsDir)) {
      const files = fs.readdirSync(picsDir);
      const pictureRows = [];
      const perUser = new Map();
      const fileRegex = /^(\d+)_([0-9]+)\.(png|jpe?g|webp)$/i;
      for (const f of files) {
        const m = f.match(fileRegex);
        if (!m) continue;
        const userId = parseInt(m[1], 10);
        const order = parseInt(m[2], 10);
        if (!Number.isInteger(userId)) continue;
        if (!users.find((u) => u.id === userId)) continue;
        const fullPath = path.join(picsDir, f);
        try {
          const buffer = fs.readFileSync(fullPath);
          pictureRows.push({ userId, value: buffer, order });
          perUser.set(userId, (perUser.get(userId) || 0) + 1);
        } catch (e) {}
      }
      if (pictureRows.length) {
        await Picture.bulkCreate(pictureRows);
        Array.from(perUser.entries()).sort((a, b) => a[0] - b[0]);
      }
    }
  } catch (e) {
    console.warn("⚠️ Error while seeding pictures:", e.message);
  }

  const profiles = [];
  for (const user of users) {
    const profileCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < profileCount; i++) {
      const city = faker.helpers.arrayElement(cities).name;
      const chosenTraits = faker.helpers.arrayElements(traitNames, {
        min: 3,
        max: 7,
      });
      const role = faker.helpers.arrayElement(["mentor", "traveller"]);
      const description = faker.helpers.arrayElement([
        `Friendly ${role} based in ${city} who loves ${chosenTraits[0]} and sharing local spots with visitors.`,
        `Passionate about ${chosenTraits
          .slice(0, 2)
          .join(
            " & "
          )}; always up for meeting new people and exploring ${city}.`,
        `I enjoy ${chosenTraits
          .join(", ")
          .toLowerCase()} and creating meaningful travel experiences.`,
        `Happy to host, swap stories, and go ${chosenTraits[0].toLowerCase()} together while you are in town.`,
        `Exploring culture, food, and hidden corners of ${city} – let's connect!`,
      ]);

      const profile = await Profile.create({
        userId: user.id,
        city,
        role,
        traits: chosenTraits,
        description,
      });
      profiles.push(profile);
    }
  }

  for (let i = 0; i < 40; i++) {
    const a = faker.helpers.arrayElement(profiles);
    let b = faker.helpers.arrayElement(profiles);
    while (b.role !== "traveller") {
      b = faker.helpers.arrayElement(profiles);
    }

    let guard = 0;
    while ((b.id === a.id || a.role === b.role) && guard < 10) {
      b = faker.helpers.arrayElement(profiles);
      guard++;
    }
    await Match.create({
      mentorId: a.role === "mentor" ? a.id : b.id,
      travellerId: a.role === "traveller" ? a.id : b.id,
      receivedPositive: faker.datatype.boolean(),
      expirationStamp: faker.date.soon({ days: 45 }),
    });
  }

  const reviewPhrasesStart = [
    "Great experience",
    "Very welcoming",
    "Super knowledgeable",
    "Had an amazing time",
    "Fantastic host",
    "Helpful and friendly",
    "Inspiring conversations",
    "Would definitely meet again",
    "Easy to coordinate",
    "Truly local insights",
  ];
  const reviewPhrasesEnd = [
    "made the trip memorable.",
    "shared wonderful tips about the city.",
    "was flexible and communicative.",
    "helped me discover hidden gems.",
    "created a relaxed atmosphere.",
    "was punctual and reliable.",
    "offered genuine hospitality.",
    "went above and beyond.",
    "gave excellent recommendations.",
    "was fun to explore with.",
  ];

  for (let i = 0; i < 20; i++) {
    const receiverProfile = faker.helpers.arrayElement(profiles);
    let authorProfile = faker.helpers.arrayElement(profiles);
    let guard = 0;
    while (
      (authorProfile.id === receiverProfile.id ||
        authorProfile.userId === receiverProfile.userId) &&
      guard < 15
    ) {
      authorProfile = faker.helpers.arrayElement(profiles);
      guard++;
    }
    const message = `${faker.helpers.arrayElement(
      reviewPhrasesStart
    )} – ${faker.helpers.arrayElement(reviewPhrasesEnd)}`;
    await Review.create({
      authorId: authorProfile.userId,
      receiverId: receiverProfile.userId,
      message,
      role: faker.helpers.arrayElement(["mentor", "traveller"]),
      rating: faker.number.int({ min: 1, max: 5 }),
    });
  }
}
