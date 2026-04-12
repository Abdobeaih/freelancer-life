export const PLANS = {
    free: {
        label: "مجانية", en: "FREE", price: 0,
        perks: ["هوية رقمية", "خصومات عامة", "QR Code", "100 نقطة ترحيبية"],
    },
    premium: {
        label: "بريميوم", en: "PREMIUM", price: 49,
        perks: ["كل مزايا المجانية", "خصومات حصرية", "بطاقة ذهبية", "2x نقاط على كل استخدام"],
    },
    elite: {
        label: "إليت", en: "ELITE", price: 99,
        perks: ["كل مزايا بريميوم", "خصومات VIP", "بطاقة بلاتينية", "3x نقاط + أولوية قصوى"],
    },
};
export const PLAN_ORDER = { free: 0, premium: 1, elite: 2 };
export const canAccess = (userPlan, required) => PLAN_ORDER[userPlan] >= PLAN_ORDER[required];
export const CATS = {
    gym: "جيمات", food: "مطاعم", medical: "عيادات", fun: "ترفيه",
};
export const CAT_EMO = {
    gym: "🏋️", food: "☕", medical: "🩺", fun: "🎮",
};
export const PTS = {
    SIGNUP: 100,
    REFERRAL_SENDER: 200,
    REFERRAL_RECEIVER: 100,
    USE_DISC_FREE: 10,
    USE_DISC_PREM: 20,
    USE_DISC_ELITE: 30,
    UPGRADE_PREMIUM: 150,
    UPGRADE_ELITE: 300,
};
export const MONTHS_S = ["ين", "فب", "مر", "أب", "مي", "يو", "يل", "أغ", "سب", "أك", "نو", "دي"];
export const JOBS = [
    "مصمم UI/UX", "مطور ويب", "مطور موبايل", "كاتب محتوى",
    "مصمم جرافيك", "محرر فيديو", "مترجم", "مسوّق رقمي", "أخرى",
];
