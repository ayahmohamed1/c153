// ============================================================
// 🎁 GIFT DATA — EDIT HERE to add or change customer content
// ============================================================
// Each key is the URL slug: /gift/aya → id = "aya"
// ============================================================

export interface GiftData {
  name: string;           // Shown in the intro "Make a wish, [name]!"
  senderName?: string;    // Signature at the bottom of the letter (e.g., "Aya ✨")
  envelopeImage: string;  // Path inside /public — the envelope image
  birthdayImage: string;  // Path inside /public — the main birthday card image
  message: string;        // The birthday message (supports \n for line breaks)
  musicUrl?: string;      // Optional: URL to a background music mp3
  accentColor?: string;   // Optional: custom accent color (default: #38bdf8)
}

// ============================================================
// CUSTOMER DATA
// ============================================================
const defaultGift: GiftData = {
  name: "habibty",                                      // اسم مستلم الهدية
  senderName: "your love",                            // التوقيع في آخر الرسالة (اختياري)
  envelopeImage: "/images/envelope-aya.png",          // صورة الظرف
  birthdayImage: "/images/birthday-aya.png",          // صورة الهدية النهائية
  accentColor: "#38bdf8",                             // اللون الأزرق الفاتح المتوافق مع التصميم الجديد
  musicUrl: "",                                       // رابط الموسيقى هنا
  message: `Today marks one full year of us being together, Nour. This has been the absolute best year of my life, ever since I met you. The sweetest days of my life were spent with you. I never imagined I’d ever meet someone like you—someone who loves me and cares for me so deeply without asking for anything in return. You’ve always treated me like your own son, showing me a mother's tenderness. You’ve put up with so much from me this past year, and I'm sorry if I ever upset you, intentionally or unintentionally. You're all I have in this world.

You showed up and completely changed the way I look at everything. You made me love life again, Nour, after I had completely lost my passion for it. My first and last wish has always been to stay with you for the rest of our lives until we get married, have our own home decorated just the way we like it, and have Adham and Laila—building the family we've always dreamed of. I am certain that our kids will thank me one day for choosing a mother like you.

I love you so much, my sweetheart, and I don't want anyone else in this world. May God give me the ability to always make you happy and put a smile on your face, the light of my eyes. Here's to a hundred more years together, my absolute best and most beautiful blessing. Tarek loves you so, so, so much, and he could never live without you. May God keep you in my life and never deprive me of you, the soul of my heart.

I love you, Narnar 💗`,
};

const giftData: Record<string, GiftData> = {
  yahya: defaultGift,
  aya: defaultGift,
};

export default giftData;