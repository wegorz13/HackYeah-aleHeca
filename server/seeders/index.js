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

  // Helper to build a unique list from a generator
  const unique = (genFn, count) => {
    const set = new Set();
    while (set.size < count) {
      set.add(genFn());
      if (set.size > count * 2) break; // safety
    }
    return Array.from(set).slice(0, count);
  };

  // Cities (more realistic English city names)
  const cityNames = unique(() => faker.location.city(), 25);
  const cities = await City.bulkCreate(cityNames.map((name) => ({ name })));

  // Countries (real English country names)
  const countryNames = unique(() => faker.location.country(), 20);
  const countries = await Country.bulkCreate(
    countryNames.map((name) => ({ name }))
  );

  // Expanded trait list (English, lifestyle / travel oriented)
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

  // Users (more users, richer contact info)
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

  // Seed picture blobs from seed-assets/pictures for files named <userId>_<index>.png
  // e.g. 1_1.png, 1_2.png ... 2_1.png etc.
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
      const fileRegex = /^(\d+)_([0-9]+)\.(png|jpe?g|webp)$/i;
      for (const f of files) {
        const m = f.match(fileRegex);
        if (!m) continue;
        const userId = parseInt(m[1], 10);
        const order = parseInt(m[2], 10); // use the second number as order
        if (!Number.isInteger(userId)) continue;
        if (!users.find((u) => u.id === userId)) continue;
        const fullPath = path.join(picsDir, f);
        try {
          const buffer = fs.readFileSync(fullPath);
          pictureRows.push({ userId, value: buffer, order });
        } catch (e) {
          console.warn("⚠️ Failed reading image", fullPath, e.message);
        }
      }
      if (pictureRows.length) {
        await Picture.bulkCreate(pictureRows);
        console.log(`🖼️ Seeded ${pictureRows.length} pictures from ${picsDir}`);
      } else {
        console.log("ℹ️ No picture files matched pattern in", picsDir);
      }
    } else {
      console.log(
        "ℹ️ Pictures directory not found, skipping picture seeding:",
        picsDir
      );
    }
  } catch (e) {
    console.warn("⚠️ Error while seeding pictures:", e.message);
  }

  // Profiles (multiple per user) with richer English descriptions
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

  // Matches (more volume)
  for (let i = 0; i < 40; i++) {
    const a = faker.helpers.arrayElement(profiles);
    let b = faker.helpers.arrayElement(profiles);
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

  // Reviews (richer English phrasing)
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
    // Ensure different profile and different underlying user
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
      authorId: authorProfile.userId, // FIX: must reference Users table
      receiverId: receiverProfile.userId, // FIX: must reference Users table
      message,
      role: faker.helpers.arrayElement(["mentor", "traveller"]),
      rating: faker.number.int({ min: 1, max: 5 }),
    });
  }

  console.log("✅ Mock data seeded!");
}
