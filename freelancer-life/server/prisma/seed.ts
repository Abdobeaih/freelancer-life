import { PrismaClient, Category, Plan, Status } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin
  await prisma.admin.upsert({
    where: { username: "adham" },
    update: {},
    create: {
      username: "adham",
      passwordHash: await bcrypt.hash("123456", 10),
    },
  });

  // Companies
  const companies = await Promise.all([
    prisma.company.upsert({
      where: { email: "gym@gold.com" },
      update: {},
      create: {
        name: "نادي القوة الذهبي",
        email: "gym@gold.com",
        passwordHash: await bcrypt.hash("gym123", 10),
        category: Category.gym,
        city: "الرياض",
        emoji: "🏋️",
        status: Status.approved,
        views: 342,
      },
    }),
    prisma.company.upsert({
      where: { email: "cafe@code.com" },
      update: {},
      create: {
        name: "مقهى الكود",
        email: "cafe@code.com",
        passwordHash: await bcrypt.hash("cafe123", 10),
        category: Category.food,
        city: "الرياض",
        emoji: "☕",
        status: Status.approved,
        views: 512,
      },
    }),
    prisma.company.upsert({
      where: { email: "dental@care.com" },
      update: {},
      create: {
        name: "عيادة الأسنان",
        email: "dental@care.com",
        passwordHash: await bcrypt.hash("dental123", 10),
        category: Category.medical,
        city: "الرياض",
        emoji: "🦷",
        status: Status.approved,
        views: 178,
      },
    }),
    prisma.company.upsert({
      where: { email: "cinema@stars.com" },
      update: {},
      create: {
        name: "سينما ستارز",
        email: "cinema@stars.com",
        passwordHash: await bcrypt.hash("cinema123", 10),
        category: Category.fun,
        city: "جدة",
        emoji: "🎬",
        status: Status.approved,
        views: 156,
      },
    }),
  ]);

  // Point Rewards
  const gymCo = companies[0];
  const cafeCo = companies[1];
  const dentalCo = companies[2];
  const cinemaCo = companies[3];

  await prisma.ptReward.createMany({
    skipDuplicates: true,
    data: [
      { description: "جلسة تدريب مجانية", points: 500, companyId: gymCo.id, redeemedCount: 12 },
      { description: "اشتراك أسبوع مجاني", points: 800, companyId: gymCo.id, redeemedCount: 5 },
      { description: "مشروب مجاني", points: 200, companyId: cafeCo.id, redeemedCount: 34 },
      { description: "تنظيف أسنان مجاني", points: 600, companyId: dentalCo.id, redeemedCount: 8 },
      { description: "تذكرة سينما مجانية", points: 350, companyId: cinemaCo.id, redeemedCount: 21 },
    ],
  });

  // Discounts
  await prisma.discount.createMany({
    skipDuplicates: true,
    data: [
      { name: "نادي القوة الذهبي",    description: "اشتراك سنوي + فرد مجاني", category: Category.gym,     percentage: "30%", city: "الرياض", tier: Plan.free,    status: Status.approved, uses: 87,  companyId: gymCo.id },
      { name: "فيتنس برو",            description: "جميع الاشتراكات",          category: Category.gym,     percentage: "25%", city: "جدة",    tier: Plan.free,    status: Status.approved, uses: 54 },
      { name: "باور إليت",            description: "للأعضاء الإليت فقط",      category: Category.gym,     percentage: "50%", city: "الدمام", tier: Plan.elite,   status: Status.approved, uses: 22 },
      { name: "مقهى الكود",           description: "جميع المشروبات",           category: Category.food,    percentage: "20%", city: "الرياض", tier: Plan.free,    status: Status.approved, uses: 156, companyId: cafeCo.id },
      { name: "السفرة الذهبية",       description: "الوجبات الرئيسية",         category: Category.food,    percentage: "15%", city: "جدة",    tier: Plan.free,    status: Status.approved, uses: 89 },
      { name: "بيت البرجر",           description: "بريميوم على الوجبات",      category: Category.food,    percentage: "25%", city: "الرياض", tier: Plan.premium, status: Status.approved, uses: 43 },
      { name: "عيادة الأسنان",        description: "جميع علاجات الأسنان",      category: Category.medical, percentage: "40%", city: "الرياض", tier: Plan.free,    status: Status.approved, uses: 43,  companyId: dentalCo.id },
      { name: "مركز العيون",          description: "فحص + نظارات",             category: Category.medical, percentage: "30%", city: "جدة",    tier: Plan.premium, status: Status.approved, uses: 67 },
      { name: "سينما ستارز",          description: "جميع أوقات العروض",        category: Category.fun,     percentage: "25%", city: "جدة",    tier: Plan.free,    status: Status.approved, uses: 38,  companyId: cinemaCo.id },
      { name: "إسكيب روم",            description: "جلسة بريميوم كاملة",       category: Category.fun,     percentage: "30%", city: "الرياض", tier: Plan.premium, status: Status.approved, uses: 19 },
    ],
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
