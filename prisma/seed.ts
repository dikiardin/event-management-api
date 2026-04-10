import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clean up existing data (in correct order due to FK constraints)
  await prisma.attendee.deleteMany();
  await prisma.transactionTicket.deleteMany();
  await prisma.transactions.deleteMany();
  await prisma.review.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.point.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
  await prisma.eventOrganizer.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned up existing data");

  // ─────────────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const users = await Promise.all([
    // Regular users
    prisma.user.create({
      data: {
        username: "john_doe",
        email: "john@example.com",
        password: hashedPassword,
        role: "USER",
        referral_code: "USER1-ABC123",
        is_verified: true,
        profile_pic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
      },
    }),
    prisma.user.create({
      data: {
        username: "jane_smith",
        email: "jane@example.com",
        password: hashedPassword,
        role: "USER",
        referral_code: "USER2-DEF456",
        is_verified: true,
        profile_pic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      },
    }),
    prisma.user.create({
      data: {
        username: "mike_wilson",
        email: "mike@example.com",
        password: hashedPassword,
        role: "USER",
        referral_code: "USER3-GHI789",
        is_verified: true,
        profile_pic: null,
      },
    }),
    prisma.user.create({
      data: {
        username: "sarah_connor",
        email: "sarah@example.com",
        password: hashedPassword,
        role: "USER",
        referral_code: "USER4-JKL012",
        is_verified: true,
        profile_pic: null,
      },
    }),
    prisma.user.create({
      data: {
        username: "alex_chen",
        email: "alex@example.com",
        password: hashedPassword,
        role: "USER",
        referral_code: "USER5-MNO345",
        is_verified: true,
        profile_pic: null,
      },
    }),
    // Organizer users
    prisma.user.create({
      data: {
        username: "live_nation",
        email: "livenation@example.com",
        password: hashedPassword,
        role: "ORGANIZER",
        referral_code: "ORG1-XYZ001",
        is_verified: true,
        profile_pic: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
      },
    }),
    prisma.user.create({
      data: {
        username: "sports_arena",
        email: "sportsarena@example.com",
        password: hashedPassword,
        role: "ORGANIZER",
        referral_code: "ORG2-XYZ002",
        is_verified: true,
        profile_pic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      },
    }),
    prisma.user.create({
      data: {
        username: "theater_group",
        email: "theatergroup@example.com",
        password: hashedPassword,
        role: "ORGANIZER",
        referral_code: "ORG3-XYZ003",
        is_verified: true,
        profile_pic: null,
      },
    }),
  ]);

  const [john, jane, mike, sarah, alex, liveNation, sportsArena, theaterGroup] = users;
  console.log(`✅ Created ${users.length} users`);

  // ─────────────────────────────────────────────────
  // EVENT ORGANIZERS
  // ─────────────────────────────────────────────────
  const organizers = await Promise.all([
    prisma.eventOrganizer.create({
      data: {
        user_id: liveNation!.id,
        event_organizer_name: "Live Nation Entertainment",
        event_organizer_description:
          "Indonesia's premier live entertainment company, producing world-class concerts and music festivals across the archipelago.",
        event_organizer_bank_account: "BCA - 1234567890",
        average_rating: 4.5,
      },
    }),
    prisma.eventOrganizer.create({
      data: {
        user_id: sportsArena!.id,
        event_organizer_name: "Sports Arena ID",
        event_organizer_description:
          "Leading sports event organizer hosting major sporting events including football, basketball, and e-sports tournaments.",
        event_organizer_bank_account: "Mandiri - 0987654321",
        average_rating: 4.2,
      },
    }),
    prisma.eventOrganizer.create({
      data: {
        user_id: theaterGroup!.id,
        event_organizer_name: "Jakarta Theater Company",
        event_organizer_description:
          "Award-winning theater company bringing captivating performances and cultural events to stages across Jakarta.",
        event_organizer_bank_account: "BNI - 1122334455",
        average_rating: 4.8,
      },
    }),
  ]);

  const [orgLiveNation, orgSports, orgTheater] = organizers;
  console.log(`✅ Created ${organizers.length} event organizers`);

  // ─────────────────────────────────────────────────
  // EVENTS
  // ─────────────────────────────────────────────────
  const events = await Promise.all([
    // CONCERTS
    prisma.event.create({
      data: {
        event_organizer_id: orgLiveNation!.id,
        event_category: "CONCERT",
        event_price: 500000,
        event_thumbnail: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=450&fit=crop",
        event_name: "Jakarta Rock Festival 2026",
        event_description:
          "The biggest rock music festival in Southeast Asia featuring international and local bands. Three stages, non-stop music, and an unforgettable atmosphere under the Jakarta skyline.",
        event_start_date: new Date("2026-08-15T18:00:00Z"),
        event_end_date: new Date("2026-08-17T23:59:00Z"),
        event_location: "Gelora Bung Karno Stadium, Jakarta",
        total_seats: 5000,
        available_seats: 4200,
      },
    }),
    prisma.event.create({
      data: {
        event_organizer_id: orgLiveNation!.id,
        event_category: "CONCERT",
        event_price: 750000,
        event_thumbnail: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=450&fit=crop",
        event_name: "Bali Jazz Night",
        event_description:
          "An intimate evening of world-class jazz performances set against the stunning backdrop of Bali's sunset. Featuring Grammy-winning artists and rising stars of the Indonesian jazz scene.",
        event_start_date: new Date("2026-11-20T19:00:00Z"),
        event_end_date: new Date("2026-11-20T23:30:00Z"),
        event_location: "Nusa Dua Convention Center, Bali",
        total_seats: 2000,
        available_seats: 1500,
      },
    }),
    prisma.event.create({
      data: {
        event_organizer_id: orgLiveNation!.id,
        event_category: "CONCERT",
        event_price: 1200000,
        event_thumbnail: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=450&fit=crop",
        event_name: "K–Pop Superstar World Tour Jakarta",
        event_description:
          "The most anticipated K-Pop concert of the year! Experience electrifying performances, stunning choreography, and incredible fan energy all in one spectacular night.",
        event_start_date: new Date("2027-03-10T18:00:00Z"),
        event_end_date: new Date("2027-03-10T22:00:00Z"),
        event_location: "Indonesia Convention Exhibition (ICE), BSD",
        total_seats: 10000,
        available_seats: 7500,
      },
    }),

    // FESTIVALS
    prisma.event.create({
      data: {
        event_organizer_id: orgLiveNation!.id,
        event_category: "FESTIVAL",
        event_price: 350000,
        event_thumbnail: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=450&fit=crop",
        event_name: "Jakarta Food & Culture Festival 2027",
        event_description:
          "A grand celebration of Indonesia's diverse culinary heritage. Over 200 food vendors, live cooking demonstrations, cultural performances, and an incredible street food market all in one place.",
        event_start_date: new Date("2027-06-01T10:00:00Z"),
        event_end_date: new Date("2027-06-03T22:00:00Z"),
        event_location: "JIExpo Kemayoran, Jakarta",
        total_seats: 8000,
        available_seats: 6500,
      },
    }),
    prisma.event.create({
      data: {
        event_organizer_id: orgLiveNation!.id,
        event_category: "FESTIVAL",
        event_price: 0,
        event_thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=450&fit=crop",
        event_name: "Bandung Art & Music Fair",
        event_description:
          "A free community event celebrating Bandung's vibrant art scene. Local artists, photographers, musicians, and creators come together for a weekend of creativity and inspiration.",
        event_start_date: new Date("2026-09-20T09:00:00Z"),
        event_end_date: new Date("2026-09-22T21:00:00Z"),
        event_location: "Gedung Sate, Bandung",
        total_seats: 3000,
        available_seats: 2800,
      },
    }),
    prisma.event.create({
      data: {
        event_organizer_id: orgLiveNation!.id,
        event_category: "FESTIVAL",
        event_price: 250000,
        event_thumbnail: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=450&fit=crop",
        event_name: "Djakarta Warehouse Project 2028",
        event_description:
          "Southeast Asia's biggest dance music festival returns! Three days of non-stop electronic music with world-renowned DJs, spectacular stage designs, and an unforgettable crowd experience.",
        event_start_date: new Date("2028-12-13T16:00:00Z"),
        event_end_date: new Date("2028-12-15T06:00:00Z"),
        event_location: "JIExpo Kemayoran, Jakarta",
        total_seats: 15000,
        available_seats: 12000,
      },
    }),

    // SPORTS
    prisma.event.create({
      data: {
        event_organizer_id: orgSports!.id,
        event_category: "SPORT",
        event_price: 200000,
        event_thumbnail: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=450&fit=crop",
        event_name: "Indonesia Super League Final 2026",
        event_description:
          "The grand finale of the Indonesia Super League! Watch the top two clubs battle it out for the championship title in a thrilling match filled with passion, skill, and drama.",
        event_start_date: new Date("2026-12-20T19:00:00Z"),
        event_end_date: new Date("2026-12-20T22:00:00Z"),
        event_location: "Gelora Bung Karno Stadium, Jakarta",
        total_seats: 60000,
        available_seats: 45000,
      },
    }),
    prisma.event.create({
      data: {
        event_organizer_id: orgSports!.id,
        event_category: "SPORT",
        event_price: 150000,
        event_thumbnail: "https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?w=800&h=450&fit=crop",
        event_name: "Bali Marathon International 2027",
        event_description:
          "Run through the beautiful landscapes of Bali in this international marathon event. Featuring full marathon, half marathon, and 10K categories with stunning ocean-side and temple routes.",
        event_start_date: new Date("2027-05-18T05:00:00Z"),
        event_end_date: new Date("2027-05-18T14:00:00Z"),
        event_location: "Gianyar, Bali",
        total_seats: 5000,
        available_seats: 3500,
      },
    }),
    prisma.event.create({
      data: {
        event_organizer_id: orgSports!.id,
        event_category: "SPORT",
        event_price: 100000,
        event_thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
        event_name: "Jakarta E–Sports Championship 2028",
        event_description:
          "The ultimate e-sports showdown! Top teams from across Asia compete in DOTA 2, Valorant, and Mobile Legends. Live commentary, meet & greet with pro gamers, and massive prize pools.",
        event_start_date: new Date("2028-07-05T10:00:00Z"),
        event_end_date: new Date("2028-07-07T22:00:00Z"),
        event_location: "Istora Senayan, Jakarta",
        total_seats: 4000,
        available_seats: 3200,
      },
    }),

    // THEATER
    prisma.event.create({
      data: {
        event_organizer_id: orgTheater!.id,
        event_category: "THEATER",
        event_price: 400000,
        event_thumbnail: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=450&fit=crop",
        event_name: "The Phantom of Jakarta – Musical",
        event_description:
          "A breathtaking Indonesian adaptation of the classic musical. Featuring a full orchestra, spectacular costumes, and an all-star Indonesian cast in a story of love, mystery, and music.",
        event_start_date: new Date("2027-02-14T19:00:00Z"),
        event_end_date: new Date("2027-02-14T22:00:00Z"),
        event_location: "Teater Jakarta, Taman Ismail Marzuki",
        total_seats: 1200,
        available_seats: 800,
      },
    }),
    prisma.event.create({
      data: {
        event_organizer_id: orgTheater!.id,
        event_category: "THEATER",
        event_price: 300000,
        event_thumbnail: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&h=450&fit=crop",
        event_name: "Stand–Up Comedy Spectacular 2026",
        event_description:
          "Indonesia's funniest comedians come together for one explosive night of laughter! Featuring top names from the stand-up scene with special guest appearances and surprise acts.",
        event_start_date: new Date("2026-10-31T20:00:00Z"),
        event_end_date: new Date("2026-10-31T23:00:00Z"),
        event_location: "Balai Sarbini, Jakarta",
        total_seats: 1500,
        available_seats: 1000,
      },
    }),
    prisma.event.create({
      data: {
        event_organizer_id: orgTheater!.id,
        event_category: "THEATER",
        event_price: 500000,
        event_thumbnail: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=800&h=450&fit=crop",
        event_name: "Swan Lake Ballet – Jakarta 2028",
        event_description:
          "The timeless masterpiece of Tchaikovsky performed by an internationally acclaimed ballet company. An evening of grace, beauty, and artistic excellence that will leave you spellbound.",
        event_start_date: new Date("2028-04-22T19:00:00Z"),
        event_end_date: new Date("2028-04-22T21:30:00Z"),
        event_location: "Ciputra Artpreneur Theater, Jakarta",
        total_seats: 1000,
        available_seats: 700,
      },
    }),
    // Extra future events (2029)
    prisma.event.create({
      data: {
        event_organizer_id: orgLiveNation!.id,
        event_category: "CONCERT",
        event_price: 900000,
        event_thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=450&fit=crop",
        event_name: "Ultra Music Festival Indonesia 2029",
        event_description:
          "The world's most iconic electronic music festival finally comes to Indonesia! Three epic stages, unmatched production quality, and the biggest names in EDM for three unforgettable days.",
        event_start_date: new Date("2029-03-14T15:00:00Z"),
        event_end_date: new Date("2029-03-16T04:00:00Z"),
        event_location: "Ancol Beach City, Jakarta",
        total_seats: 20000,
        available_seats: 18000,
      },
    }),
    prisma.event.create({
      data: {
        event_organizer_id: orgSports!.id,
        event_category: "SPORT",
        event_price: 175000,
        event_thumbnail: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=450&fit=crop",
        event_name: "Indonesia Open Badminton 2029",
        event_description:
          "Watch the world's best badminton players compete in this prestigious BWF Super 1000 tournament. Expect thrilling rallies, incredible speed, and patriotic support for Indonesian heroes.",
        event_start_date: new Date("2029-06-10T09:00:00Z"),
        event_end_date: new Date("2029-06-15T20:00:00Z"),
        event_location: "Istora Senayan, Jakarta",
        total_seats: 7000,
        available_seats: 5500,
      },
    }),
  ]);

  console.log(`✅ Created ${events.length} events`);

  // ─────────────────────────────────────────────────
  // TICKETS (VIP + REGULAR for each event)
  // ─────────────────────────────────────────────────
  const ticketData = events.map((event) => {
    const vipPrice = event.event_price * 2.5;
    const regularPrice = event.event_price;
    const vipQuota = Math.floor(event.total_seats * 0.2);
    const regularQuota = event.total_seats - vipQuota;
    const vipAvailable = Math.floor(event.available_seats * 0.2);
    const regularAvailable = event.available_seats - vipAvailable;

    return [
      {
        event_id: event.id,
        ticket_type: "VIP" as const,
        price: vipPrice === 0 ? 0 : vipPrice,
        quota: vipQuota,
        available_qty: vipAvailable,
      },
      {
        event_id: event.id,
        ticket_type: "REGULAR" as const,
        price: regularPrice,
        quota: regularQuota,
        available_qty: regularAvailable,
      },
    ];
  });

  const tickets: Awaited<ReturnType<typeof prisma.ticket.create>>[] = [];
  for (const pair of ticketData) {
    for (const t of pair) {
      const ticket = await prisma.ticket.create({ data: t });
      tickets.push(ticket);
    }
  }
  console.log(`✅ Created ${tickets.length} tickets`);

  // ─────────────────────────────────────────────────
  // VOUCHERS (event-specific discounts, expire 2026-2029)
  // ─────────────────────────────────────────────────
  const vouchers = await Promise.all([
    prisma.voucher.create({
      data: {
        event_id: events[0]!.id, // Jakarta Rock Festival 2026
        voucher_code: "ROCK20OFF",
        discount_value: 20,
        voucher_start_date: new Date("2026-06-01T00:00:00Z"),
        voucher_end_date: new Date("2026-08-14T23:59:00Z"),
      },
    }),
    prisma.voucher.create({
      data: {
        event_id: events[0]!.id,
        voucher_code: "EARLYROCK10",
        discount_value: 10,
        voucher_start_date: new Date("2026-04-01T00:00:00Z"),
        voucher_end_date: new Date("2026-07-31T23:59:00Z"),
      },
    }),
    prisma.voucher.create({
      data: {
        event_id: events[1]!.id, // Bali Jazz Night
        voucher_code: "JAZZNIGHT15",
        discount_value: 15,
        voucher_start_date: new Date("2026-09-01T00:00:00Z"),
        voucher_end_date: new Date("2026-11-19T23:59:00Z"),
      },
    }),
    prisma.voucher.create({
      data: {
        event_id: events[2]!.id, // KPop Superstar
        voucher_code: "KPOPFAN25",
        discount_value: 25,
        voucher_start_date: new Date("2027-01-01T00:00:00Z"),
        voucher_end_date: new Date("2027-03-09T23:59:00Z"),
      },
    }),
    prisma.voucher.create({
      data: {
        event_id: events[3]!.id, // Food & Culture Festival
        voucher_code: "FOODIE30",
        discount_value: 30,
        voucher_start_date: new Date("2027-04-01T00:00:00Z"),
        voucher_end_date: new Date("2027-05-31T23:59:00Z"),
      },
    }),
    prisma.voucher.create({
      data: {
        event_id: events[5]!.id, // DWP 2028
        voucher_code: "DWP2028VIP",
        discount_value: 15,
        voucher_start_date: new Date("2028-10-01T00:00:00Z"),
        voucher_end_date: new Date("2028-12-12T23:59:00Z"),
      },
    }),
    prisma.voucher.create({
      data: {
        event_id: events[6]!.id, // Indonesia Super League Final
        voucher_code: "GOALSAVE20",
        discount_value: 20,
        voucher_start_date: new Date("2026-11-01T00:00:00Z"),
        voucher_end_date: new Date("2026-12-19T23:59:00Z"),
      },
    }),
    prisma.voucher.create({
      data: {
        event_id: events[9]!.id, // Phantom Musical
        voucher_code: "VALENTINE20",
        discount_value: 20,
        voucher_start_date: new Date("2027-01-15T00:00:00Z"),
        voucher_end_date: new Date("2027-02-13T23:59:00Z"),
      },
    }),
    prisma.voucher.create({
      data: {
        event_id: events[11]!.id, // Swan Lake 2028
        voucher_code: "BALLET10",
        discount_value: 10,
        voucher_start_date: new Date("2028-03-01T00:00:00Z"),
        voucher_end_date: new Date("2028-04-21T23:59:00Z"),
      },
    }),
    prisma.voucher.create({
      data: {
        event_id: events[12]!.id, // Ultra Music 2029
        voucher_code: "ULTRA2029EARLY",
        discount_value: 35,
        voucher_start_date: new Date("2028-12-01T00:00:00Z"),
        voucher_end_date: new Date("2029-03-13T23:59:00Z"),
      },
    }),
    prisma.voucher.create({
      data: {
        event_id: events[13]!.id, // Indonesia Open Badminton 2029
        voucher_code: "SMASH2029",
        discount_value: 15,
        voucher_start_date: new Date("2029-04-01T00:00:00Z"),
        voucher_end_date: new Date("2029-06-09T23:59:00Z"),
      },
    }),
  ]);
  console.log(`✅ Created ${vouchers.length} vouchers`);

  // ─────────────────────────────────────────────────
  // COUPONS (user-specific discounts)
  // ─────────────────────────────────────────────────
  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        user_id: john!.id,
        coupon_code: "DISC-JOHN10",
        discount_value: 10,
      },
    }),
    prisma.coupon.create({
      data: {
        user_id: john!.id,
        coupon_code: "WELCOME-JOHN",
        discount_value: 15,
      },
    }),
    prisma.coupon.create({
      data: {
        user_id: jane!.id,
        coupon_code: "DISC-JANE20",
        discount_value: 20,
      },
    }),
    prisma.coupon.create({
      data: {
        user_id: mike!.id,
        coupon_code: "DISC-MIKE15",
        discount_value: 15,
      },
    }),
    prisma.coupon.create({
      data: {
        user_id: sarah!.id,
        coupon_code: "DISC-SARAH10",
        discount_value: 10,
      },
    }),
    prisma.coupon.create({
      data: {
        user_id: alex!.id,
        coupon_code: "DISC-ALEX25",
        discount_value: 25,
      },
    }),
  ]);
  console.log(`✅ Created ${coupons.length} coupons`);

  // ─────────────────────────────────────────────────
  // POINTS (with expiry in 2026-2029)
  // ─────────────────────────────────────────────────
  const points = await Promise.all([
    prisma.point.create({
      data: {
        user_id: john!.id,
        point_balance: 10000,
        point_expired: new Date("2026-10-01T00:00:00Z"),
      },
    }),
    prisma.point.create({
      data: {
        user_id: john!.id,
        point_balance: 5000,
        point_expired: new Date("2027-04-15T00:00:00Z"),
      },
    }),
    prisma.point.create({
      data: {
        user_id: jane!.id,
        point_balance: 15000,
        point_expired: new Date("2027-01-20T00:00:00Z"),
      },
    }),
    prisma.point.create({
      data: {
        user_id: mike!.id,
        point_balance: 20000,
        point_expired: new Date("2028-06-30T00:00:00Z"),
      },
    }),
    prisma.point.create({
      data: {
        user_id: sarah!.id,
        point_balance: 10000,
        point_expired: new Date("2027-09-15T00:00:00Z"),
      },
    }),
    prisma.point.create({
      data: {
        user_id: alex!.id,
        point_balance: 30000,
        point_expired: new Date("2029-01-01T00:00:00Z"),
      },
    }),
  ]);
  console.log(`✅ Created ${points.length} point records`);

  // ─────────────────────────────────────────────────
  // TRANSACTIONS (mix of statuses)
  // ─────────────────────────────────────────────────

  // Helper: get regular ticket for an event
  const getRegularTicket = (eventId: number) =>
    tickets.find((t) => t.event_id === eventId && t.ticket_type === "REGULAR");
  const getVipTicket = (eventId: number) =>
    tickets.find((t) => t.event_id === eventId && t.ticket_type === "VIP");

  const transactions = await Promise.all([
    // John buys 2 regular tickets for Jakarta Rock Festival (SUCCESS)
    prisma.transactions.create({
      data: {
        user_id: john!.id,
        coupon_id: coupons[0]!.id,
        status: "SUCCESS",
        points_used: 0,
        discount_coupon: 10,
        total_price: 900000,
        transaction_date_time: new Date("2026-06-15T10:30:00Z"),
        transaction_expired: new Date("2026-06-16T10:30:00Z"),
        is_accepted: true,
        payment_proof_url: "https://www.getjobber.com/wp-content/uploads/2025/02/free-receipt-template.webp",
      },
    }),
    // Jane buys 1 VIP ticket for Bali Jazz Night (SUCCESS)
    prisma.transactions.create({
      data: {
        user_id: jane!.id,
        voucher_id: vouchers[2]!.id,
        status: "SUCCESS",
        discount_voucher: 15,
        total_price: 1593750,
        transaction_date_time: new Date("2026-09-10T14:00:00Z"),
        transaction_expired: new Date("2026-09-11T14:00:00Z"),
        is_accepted: true,
        payment_proof_url: "https://www.getjobber.com/wp-content/uploads/2025/02/free-receipt-template.webp",
      },
    }),
    // Mike buys 3 regular tickets for Food Festival (WAITING_PAYMENT)
    prisma.transactions.create({
      data: {
        user_id: mike!.id,
        status: "WAITING_PAYMENT",
        total_price: 1050000,
        transaction_date_time: new Date("2027-04-20T09:00:00Z"),
        transaction_expired: new Date("2027-04-21T09:00:00Z"),
        is_accepted: false,
      },
    }),
    // Sarah buys 2 regular tickets for Stand-Up Comedy (WAITING_CONFIRMATION)
    prisma.transactions.create({
      data: {
        user_id: sarah!.id,
        status: "WAITING_CONFIRMATION",
        total_price: 600000,
        transaction_date_time: new Date("2026-09-25T11:00:00Z"),
        transaction_expired: new Date("2026-09-26T11:00:00Z"),
        is_accepted: false,
        payment_proof_url: "https://www.getjobber.com/wp-content/uploads/2025/02/free-receipt-template.webp",
      },
    }),
    // Alex buys 1 VIP for K-Pop (SUCCESS, used points)
    prisma.transactions.create({
      data: {
        user_id: alex!.id,
        point_id: points[5]!.id,
        status: "SUCCESS",
        points_used: 30000,
        total_price: 2970000,
        transaction_date_time: new Date("2027-01-20T16:00:00Z"),
        transaction_expired: new Date("2027-01-21T16:00:00Z"),
        is_accepted: true,
        payment_proof_url: "https://www.getjobber.com/wp-content/uploads/2025/02/free-receipt-template.webp",
      },
    }),
    // John buys 1 regular for Super League Final (SUCCESS)
    prisma.transactions.create({
      data: {
        user_id: john!.id,
        voucher_id: vouchers[6]!.id,
        status: "SUCCESS",
        discount_voucher: 20,
        total_price: 160000,
        transaction_date_time: new Date("2026-11-15T08:00:00Z"),
        transaction_expired: new Date("2026-11-16T08:00:00Z"),
        is_accepted: true,
        payment_proof_url: "https://www.getjobber.com/wp-content/uploads/2025/02/free-receipt-template.webp",
      },
    }),
    // Jane buys 2 regular for Bandung Art Fair (FREE event, SUCCESS)
    prisma.transactions.create({
      data: {
        user_id: jane!.id,
        status: "SUCCESS",
        total_price: 0,
        transaction_date_time: new Date("2026-08-10T12:00:00Z"),
        transaction_expired: new Date("2026-08-11T12:00:00Z"),
        is_accepted: true,
      },
    }),
    // Mike buys 1 VIP for DWP 2028 (SUCCESS)
    prisma.transactions.create({
      data: {
        user_id: mike!.id,
        voucher_id: vouchers[5]!.id,
        status: "SUCCESS",
        discount_voucher: 15,
        total_price: 531250,
        transaction_date_time: new Date("2028-10-10T20:00:00Z"),
        transaction_expired: new Date("2028-10-11T20:00:00Z"),
        is_accepted: true,
        payment_proof_url: "https://www.getjobber.com/wp-content/uploads/2025/02/free-receipt-template.webp",
      },
    }),
  ]);
  console.log(`✅ Created ${transactions.length} transactions`);

  // ─────────────────────────────────────────────────
  // TRANSACTION TICKETS
  // ─────────────────────────────────────────────────
  const regularRockTicket = getRegularTicket(events[0]!.id);
  const vipJazzTicket = getVipTicket(events[1]!.id);
  const regularFoodTicket = getRegularTicket(events[3]!.id);
  const regularComedyTicket = getRegularTicket(events[10]!.id);
  const vipKpopTicket = getVipTicket(events[2]!.id);
  const regularLeagueTicket = getRegularTicket(events[6]!.id);
  const regularArtTicket = getRegularTicket(events[4]!.id);
  const vipDwpTicket = getVipTicket(events[5]!.id);

  const transactionTickets = await Promise.all([
    // John: 2 regular rock tickets
    prisma.transactionTicket.create({
      data: {
        transaction_id: transactions[0]!.id,
        ticket_id: regularRockTicket!.id,
        qty: 2,
        subtotal_price: 1000000,
      },
    }),
    // Jane: 1 VIP jazz ticket
    prisma.transactionTicket.create({
      data: {
        transaction_id: transactions[1]!.id,
        ticket_id: vipJazzTicket!.id,
        qty: 1,
        subtotal_price: 1875000,
      },
    }),
    // Mike: 3 regular food festival tickets
    prisma.transactionTicket.create({
      data: {
        transaction_id: transactions[2]!.id,
        ticket_id: regularFoodTicket!.id,
        qty: 3,
        subtotal_price: 1050000,
      },
    }),
    // Sarah: 2 regular comedy tickets
    prisma.transactionTicket.create({
      data: {
        transaction_id: transactions[3]!.id,
        ticket_id: regularComedyTicket!.id,
        qty: 2,
        subtotal_price: 600000,
      },
    }),
    // Alex: 1 VIP K-Pop ticket
    prisma.transactionTicket.create({
      data: {
        transaction_id: transactions[4]!.id,
        ticket_id: vipKpopTicket!.id,
        qty: 1,
        subtotal_price: 3000000,
      },
    }),
    // John: 1 regular Super League ticket
    prisma.transactionTicket.create({
      data: {
        transaction_id: transactions[5]!.id,
        ticket_id: regularLeagueTicket!.id,
        qty: 1,
        subtotal_price: 200000,
      },
    }),
    // Jane: 2 regular Bandung Art tickets
    prisma.transactionTicket.create({
      data: {
        transaction_id: transactions[6]!.id,
        ticket_id: regularArtTicket!.id,
        qty: 2,
        subtotal_price: 0,
      },
    }),
    // Mike: 1 VIP DWP ticket
    prisma.transactionTicket.create({
      data: {
        transaction_id: transactions[7]!.id,
        ticket_id: vipDwpTicket!.id,
        qty: 1,
        subtotal_price: 625000,
      },
    }),
  ]);
  console.log(`✅ Created ${transactionTickets.length} transaction tickets`);

  // ─────────────────────────────────────────────────
  // ATTENDEES (for successful transactions)
  // ─────────────────────────────────────────────────
  const attendees = await Promise.all([
    // John - Rock Festival (2 attendees)
    prisma.attendee.create({
      data: { transaction_id: transactions[0]!.id, is_attended: true },
    }),
    prisma.attendee.create({
      data: { transaction_id: transactions[0]!.id, is_attended: false },
    }),
    // Jane - Jazz Night (1 attendee)
    prisma.attendee.create({
      data: { transaction_id: transactions[1]!.id, is_attended: false },
    }),
    // Alex - K-Pop (1 attendee)
    prisma.attendee.create({
      data: { transaction_id: transactions[4]!.id, is_attended: false },
    }),
    // John - Super League (1 attendee)
    prisma.attendee.create({
      data: { transaction_id: transactions[5]!.id, is_attended: false },
    }),
    // Jane - Art Fair (2 attendees)
    prisma.attendee.create({
      data: { transaction_id: transactions[6]!.id, is_attended: true },
    }),
    prisma.attendee.create({
      data: { transaction_id: transactions[6]!.id, is_attended: true },
    }),
    // Mike - DWP (1 attendee)
    prisma.attendee.create({
      data: { transaction_id: transactions[7]!.id, is_attended: false },
    }),
  ]);
  console.log(`✅ Created ${attendees.length} attendees`);

  // ─────────────────────────────────────────────────
  // REVIEWS
  // ─────────────────────────────────────────────────
  const reviews = await Promise.all([
    // Reviews for Bandung Art Fair (past free event)
    prisma.review.create({
      data: {
        event_id: events[4]!.id,
        user_id: jane!.id,
        rating: 5,
        review_text:
          "Amazing free event! The local art scene in Bandung is incredible. I discovered so many talented artists and the live music was a wonderful bonus.",
        review_date: new Date("2026-09-23T10:00:00Z"),
      },
    }),
    // Reviews for Jakarta Rock Festival
    prisma.review.create({
      data: {
        event_id: events[0]!.id,
        user_id: john!.id,
        rating: 4,
        review_text:
          "Incredible lineup and great energy! The only downside was the long queues at the food stalls. Otherwise, a fantastic rock festival experience.",
        review_date: new Date("2026-08-18T09:00:00Z"),
      },
    }),
    prisma.review.create({
      data: {
        event_id: events[0]!.id,
        user_id: mike!.id,
        rating: 5,
        review_text:
          "Best rock festival I've ever been to in Jakarta! The sound quality was top-notch and the atmosphere was electric. Can't wait for next year!",
        review_date: new Date("2026-08-19T14:00:00Z"),
      },
    }),
    // Review for Stand-Up Comedy
    prisma.review.create({
      data: {
        event_id: events[10]!.id,
        user_id: sarah!.id,
        rating: 4,
        review_text:
          "Laughed so hard my stomach hurt! Great selection of comedians. The venue was cozy and well-organized. Would definitely go again.",
        review_date: new Date("2026-11-01T08:00:00Z"),
      },
    }),
    // Review for Super League Final
    prisma.review.create({
      data: {
        event_id: events[6]!.id,
        user_id: john!.id,
        rating: 5,
        review_text:
          "What a match! The atmosphere at GBK was absolutely insane. Being part of 60,000 fans cheering together is an experience like no other.",
        review_date: new Date("2026-12-21T10:00:00Z"),
      },
    }),
    prisma.review.create({
      data: {
        event_id: events[6]!.id,
        user_id: alex!.id,
        rating: 3,
        review_text:
          "Great game but the seating was a bit uncomfortable and food options were limited. The match itself was thrilling though — worth it for the drama!",
        review_date: new Date("2026-12-22T15:00:00Z"),
      },
    }),
  ]);
  console.log(`✅ Created ${reviews.length} reviews`);

  // ─────────────────────────────────────────────────
  // UPDATE ORGANIZER RATINGS
  // ─────────────────────────────────────────────────
  // Recalculate average ratings based on seeded reviews
  const allReviews = await prisma.review.findMany({
    include: { event: true },
  });

  const orgRatings = new Map<number, number[]>();
  for (const review of allReviews) {
    const orgId = review.event.event_organizer_id;
    if (!orgRatings.has(orgId)) orgRatings.set(orgId, []);
    orgRatings.get(orgId)!.push(review.rating);
  }

  for (const [orgId, ratings] of orgRatings) {
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    await prisma.eventOrganizer.update({
      where: { id: orgId },
      data: { average_rating: parseFloat(avg.toFixed(2)) },
    });
  }
  console.log("✅ Updated organizer average ratings");

  console.log("\n🎉 Seed completed successfully!");
  console.log("──────────────────────────────────────");
  console.log("📊 Summary:");
  console.log(`   Users:              ${users.length}`);
  console.log(`   Event Organizers:   ${organizers.length}`);
  console.log(`   Events:             ${events.length}`);
  console.log(`   Tickets:            ${tickets.length}`);
  console.log(`   Vouchers:           ${vouchers.length}`);
  console.log(`   Coupons:            ${coupons.length}`);
  console.log(`   Points:             ${points.length}`);
  console.log(`   Transactions:       ${transactions.length}`);
  console.log(`   Transaction Tickets: ${transactionTickets.length}`);
  console.log(`   Attendees:          ${attendees.length}`);
  console.log(`   Reviews:            ${reviews.length}`);
  console.log("──────────────────────────────────────");
  console.log("\n🔑 Test accounts (all password: Password123!):");
  console.log("   john@example.com    (USER)");
  console.log("   jane@example.com    (USER)");
  console.log("   mike@example.com    (USER)");
  console.log("   sarah@example.com   (USER)");
  console.log("   alex@example.com    (USER)");
  console.log("   livenation@example.com    (ORGANIZER)");
  console.log("   sportsarena@example.com   (ORGANIZER)");
  console.log("   theatergroup@example.com  (ORGANIZER)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
