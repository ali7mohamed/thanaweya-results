/**
 * One-time seed for reference data that isn't part of the yearly results import:
 * governorates, sample FAQ, and default ad slot placements.
 * Run with: npx tsx prisma/seed.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GOVERNORATES = [
  { nameAr: 'القاهرة', slug: 'cairo' },
  { nameAr: 'الجيزة', slug: 'giza' },
  { nameAr: 'الإسكندرية', slug: 'alexandria' },
  { nameAr: 'الدقهلية', slug: 'dakahlia' },
  { nameAr: 'الشرقية', slug: 'sharqia' },
  { nameAr: 'المنوفية', slug: 'monufia' },
  { nameAr: 'القليوبية', slug: 'qalyubia' },
  { nameAr: 'الغربية', slug: 'gharbia' },
  { nameAr: 'كفر الشيخ', slug: 'kafr-el-sheikh' },
  { nameAr: 'البحيرة', slug: 'beheira' },
  { nameAr: 'المنيا', slug: 'minya' },
  { nameAr: 'أسيوط', slug: 'assiut' },
  { nameAr: 'سوهاج', slug: 'sohag' },
  { nameAr: 'قنا', slug: 'qena' },
  { nameAr: 'أسوان', slug: 'aswan' },
  { nameAr: 'الأقصر', slug: 'luxor' },
  { nameAr: 'بورسعيد', slug: 'port-said' },
  { nameAr: 'الإسماعيلية', slug: 'ismailia' },
  { nameAr: 'السويس', slug: 'suez' },
];

const AD_SLOTS = [
  { placementKey: 'home_mid', adFormat: 'responsive', adUnitId: 'REPLACE_ME', pageType: 'home' },
  { placementKey: 'search_mid', adFormat: 'responsive', adUnitId: 'REPLACE_ME', pageType: 'search' },
  { placementKey: 'result_top', adFormat: 'leaderboard', adUnitId: 'REPLACE_ME', pageType: 'result' },
  { placementKey: 'result_infeed_1', adFormat: 'in-feed', adUnitId: 'REPLACE_ME', pageType: 'result' },
  { placementKey: 'result_bottom', adFormat: 'rectangle', adUnitId: 'REPLACE_ME', pageType: 'result' },
  { placementKey: 'coordination_mid', adFormat: 'responsive', adUnitId: 'REPLACE_ME', pageType: 'coordination' },
  { placementKey: 'coordination_bottom', adFormat: 'multiplex', adUnitId: 'REPLACE_ME', pageType: 'coordination' },
  { placementKey: 'faq_bottom', adFormat: 'in-feed', adUnitId: 'REPLACE_ME', pageType: 'faq' },
  { placementKey: 'news_list_infeed_1', adFormat: 'in-feed', adUnitId: 'REPLACE_ME', pageType: 'news' },
  { placementKey: 'news_list_bottom', adFormat: 'in-feed', adUnitId: 'REPLACE_ME', pageType: 'news' },
  { placementKey: 'news_article_top', adFormat: 'leaderboard', adUnitId: 'REPLACE_ME', pageType: 'news_article' },
  { placementKey: 'news_article_bottom', adFormat: 'rectangle', adUnitId: 'REPLACE_ME', pageType: 'news_article' },
  { placementKey: 'appeals_mid', adFormat: 'responsive', adUnitId: 'REPLACE_ME', pageType: 'appeals' },
];

const FAQS = [
  {
    sortOrder: 1,
    question: 'متى تظهر نتيجة الثانوية العامة 2026؟',
    answer:
      'تعلن وزارة التربية والتعليم موعد ظهور النتيجة رسمياً قبل الإعلان بأيام قليلة عادة، وتُنشر النتيجة دفعة واحدة لكل الجمهورية في نفس التوقيت. تابع صفحة آخر الأخبار على هذا الموقع فور اعتماد الموعد الرسمي.',
  },
  {
    sortOrder: 2,
    question: 'كيف أستعلم عن نتيجتي برقم الجلوس؟',
    answer:
      'من صفحة الاستعلام عن النتيجة، أدخل رقم الجلوس المكوّن من الأرقام الموجودة في بطاقة الجلوس الخاصة بك بدون فراغات، ثم اضغط على زر عرض النتيجة لتظهر لك النتيجة فوراً.',
  },
  {
    sortOrder: 3,
    question: 'هل يمكن الاستعلام بالاسم بدل رقم الجلوس؟',
    answer:
      'نعم، يمكنك كتابة اسمك الرباعي كما هو مسجل في بطاقة الجلوس. إذا كان هناك أكثر من طالب بنفس الاسم، سيعرض لك الموقع قائمة لاختيار رقم الجلوس الصحيح لتفادي الخلط بين الأسماء المتشابهة.',
  },
  {
    sortOrder: 4,
    question: 'ما الفرق بين الدور الأول والدور الثاني؟',
    answer:
      'الدور الأول هو الامتحان الأساسي الذي يؤديه جميع الطلاب في موعده المحدد. أما الدور الثاني فهو فرصة إضافية لمن تغيّب لعذر مقبول أو رسب في مادة أو أكثر، ويؤدَّى عادة بعد الدور الأول بفترة قصيرة وفق شروط تحددها الوزارة.',
  },
  {
    sortOrder: 5,
    question: 'كيف يُحسب المجموع الكلي والنسبة المئوية؟',
    answer:
      'المجموع الكلي هو ناتج جمع درجات جميع المواد المقررة على الطالب في شعبته (علمي علوم، علمي رياضة، أو أدبي). أما النسبة المئوية فتُحسب بقسمة المجموع الذي حصل عليه الطالب على المجموع الكلي الأقصى الممكن، ثم ضرب الناتج في 100.',
  },
  {
    sortOrder: 6,
    question: 'ماذا أفعل إذا لم تظهر نتيجتي على الموقع؟',
    answer:
      'تأكد أولاً من كتابة رقم الجلوس بشكل صحيح بدون مسافات أو رموز إضافية. إذا استمرت المشكلة، فقد تكون بياناتك لم تُرصد إلكترونياً بعد لأسباب إدارية، وننصح في هذه الحالة بالتواصل المباشر مع مدرستك أو إدارة التعليم التابع لها للتأكد من رصد الدرجة.',
  },
  {
    sortOrder: 7,
    question: 'هل التنسيق المعروض على الموقع رسمي؟',
    answer:
      'التنسيق المعروض هو تقدير يعتمد على بيانات الأعوام السابقة والمتاح لحظة النشر، وليس بديلاً عن الإعلان الرسمي لمكاتب تنسيق القبول بالجامعات. استخدمه للتقدير المبدئي فقط، وارجع دائماً للتنسيق الرسمي عند التقديم الفعلي.',
  },
];

const NEWS_ARTICLES = [
  {
    slug: 'khatawat-alistlam-an-alnatija',
    title: 'خطوات الاستعلام عن نتيجة الثانوية العامة 2026 بالتفصيل',
    excerpt: 'دليل سريع بخطوتين للاستعلام عن النتيجة: رقم الجلوس أو الاسم الرباعي، وأهم النصائح لتفادي زحام لحظة الإعلان.',
    category: 'النتيجة',
    image: null as string | null,
    body:
      'مع اقتراب موعد إعلان نتيجة الثانوية العامة، يبحث آلاف الطلاب وأولياء الأمور عن أسرع طريقة موثوقة للاستعلام عن النتيجة دون الدخول في زحام المواقع الرسمية وقت الإعلان.\n\n' +
      'يوفر هذا الموقع خطوتين فقط للوصول إلى النتيجة: إدخال رقم الجلوس المدوّن على بطاقة الجلوس، أو كتابة اسم الطالب الرباعي كاملاً. في حالة تشابه الأسماء، تظهر قائمة بالنتائج المطابقة ليختار الطالب رقم جلوسه بدقة.\n\n' +
      'ننصح دائماً بتجهيز رقم الجلوس مسبقاً قبل موعد ظهور النتيجة بدقائق، لتفادي أي تأخير أو ضغط على الخوادم في أول لحظات الإعلان، والاحتفاظ بصورة من النتيجة فور ظهورها للرجوع إليها عند التقديم على التنسيق.',
    publishedAt: new Date('2026-01-15T10:00:00Z'),
  },
  {
    slug: 'alfarq-bayn-alshoab-althanawiya',
    title: 'الفرق بين الشعب الثلاث في الثانوية العامة وتأثيرها على التنسيق',
    excerpt: 'علمي علوم، علمي رياضة، وأدبي: أي شعبة تفتح أبواباً أوسع لأي كليات، ولماذا يختلف التنسيق بينها كل عام.',
    category: 'التنسيق',
    image: null as string | null,
    body:
      'ينقسم طلاب الثانوية العامة في مصر إلى ثلاث شعب رئيسية: علمي علوم، علمي رياضة، وأدبي، ولكل شعبة مواد دراسية مختلفة ومسارات جامعية مرتبطة بها.\n\n' +
      'طلاب علمي رياضة يؤهلهم مجموعهم للتقديم على كليات الهندسة والحاسبات والمعاهد الفنية المتخصصة في التخصصات الرياضية والتكنولوجية.\n\n' +
      'طلاب علمي علوم لديهم مرونة أكبر، إذ يمكنهم التقديم على كليات الطب والصيدلة والعلاج الطبيعي، بالإضافة إلى معظم الكليات المتاحة لشعبة علمي رياضة أيضاً في أغلب الجامعات.\n\n' +
      'أما طلاب الشعبة الأدبية فيتجهون عادة إلى كليات الآداب والحقوق والتجارة والإعلام والألسن، وتختلف الحدود الدنيا للتنسيق في هذه الكليات باختلاف عدد المتقدمين كل عام.',
    publishedAt: new Date('2026-01-20T10:00:00Z'),
  },
  {
    slug: 'nasayeh-qabl-zohour-alnatija',
    title: 'نصائح للطلاب وأولياء الأمور في أيام انتظار النتيجة',
    excerpt: 'كيف تتعامل مع ضغط أيام انتظار النتيجة دون متابعة الشائعات، مع خطة عملية للاستعداد للتنسيق مبكراً.',
    category: 'عام',
    image: null as string | null,
    body:
      'فترة انتظار نتيجة الثانوية العامة من أكثر الفترات ضغطاً نفسياً على الطالب وأسرته على حد سواء. وفيما يلي بعض النصائح العملية لتخفيف هذا الضغط:\n\n' +
      'أولاً، حاول الحفاظ على روتين يومي طبيعي قدر الإمكان بدلاً من قضاء الوقت كله في تصفح الأخبار والشائعات غير الموثقة حول موعد النتيجة.\n\n' +
      'ثانياً، تجنب متابعة "تسريبات" النتيجة أو الدرجات المتداولة بشكل غير رسمي على مواقع التواصل، فهي غالباً غير دقيقة وتسبب قلقاً إضافياً بلا داعٍ.\n\n' +
      'ثالثاً، جهّز مسبقاً قائمة بالكليات التي تفكر فيها بناءً على نسب الأعوام السابقة، حتى تكون جاهزاً لاتخاذ قرارك بسرعة وهدوء فور ظهور النتيجة الفعلية.',
    publishedAt: new Date('2026-01-25T10:00:00Z'),
  },
];

async function main() {
  for (const g of GOVERNORATES) {
    await prisma.governorate.upsert({ where: { slug: g.slug }, update: {}, create: g });
  }
  for (const slot of AD_SLOTS) {
    await prisma.adSlot.upsert({
      where: { placementKey: slot.placementKey },
      update: {},
      create: slot,
    });
  }
  for (const faq of FAQS) {
    await prisma.faq.upsert({
      where: { id: faq.sortOrder },
      update: faq,
      create: faq,
    });
  }
  for (const article of NEWS_ARTICLES) {
    await prisma.news.upsert({
      where: { slug: article.slug },
      update: article,
      create: { ...article, isPublished: true },
    });
  }
  console.log('Seed complete: governorates, ad slot placeholders, FAQ, and starter news articles created.');
  console.log('Edit ad_unit_id values in the ad_slots table once real AdSense units are approved.');
  console.log('Add real, dated news as they happen - the 3 seeded articles are evergreen explainers, not breaking news.');
}

main().finally(() => prisma.$disconnect());
