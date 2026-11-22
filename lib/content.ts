import { site } from "@/lib/site";

export type IconKey =
  | "temple"
  | "discourse"
  | "seva"
  | "nature"
  | "heart"
  | "sun"
  | "hands"
  | "book"
  | "music"
  | "users"
  | "leaf"
  | "lotus";

export const highlights = [
  {
    title: "Divine Ashram",
    description:
      "A sacred campus at the foot of Mallayyagiri, where prayer, silence and celebration share the same ground.",
    image: "/images/highlight-ashram.jpg",
    alt: "A brightly decorated ashram festival stage with saffron flags",
    icon: "temple" as IconKey,
    href: "/ashram",
  },
  {
    title: "Spiritual Discourses",
    description:
      "Gurudev's discourses draw thousands each Pournami, offering timeless wisdom in everyday language.",
    image: "/images/highlight-discourse.webp",
    alt: "Sri Dr. Basavalinga Avadhoota addressing a large gathering of devotees beneath the ashram pandal",
    icon: "discourse" as IconKey,
    href: "/teachings",
  },
  {
    title: "Annadanam Seva",
    description:
      "Food is served as prasada every day. No one who arrives at the ashram leaves hungry.",
    image: "/images/highlight-annadanam.jpg",
    alt: "Volunteers serving rice and prasada to devotees seated on the ground",
    icon: "seva" as IconKey,
    href: "/donate",
  },
  {
    title: "Green & Peaceful Surroundings",
    description:
      "Open skies, old trees and quiet pathways create room for the mind to soften and turn inward.",
    image: "/images/highlight-nature.jpg",
    alt: "Golden evening light across green hills and a winding valley path",
    icon: "nature" as IconKey,
    href: "/ashram",
  },
];

export const featureStrip = [
  {
    icon: "users" as IconKey,
    title: "Thousands of Devotees Blessed",
    description: "A living tradition of faith across generations",
  },
  {
    icon: "temple" as IconKey,
    title: "Spiritual Programs & Sevas",
    description: "Satsang, puja, sadhana and festival celebrations",
  },
  {
    icon: "hands" as IconKey,
    title: "Service to Humanity",
    description: "Annadanam, education and care for those in need",
  },
  {
    icon: "lotus" as IconKey,
    title: "Path to Inner Peace",
    description: "Guidance for every sincere seeker",
  },
];

export const guruBio = [
  "Poojya Sri Dr. Basavalinga Avadhoota is the Peethadhikari of the Mallayyagiri, Basavakalyan and Degalmadi Ashrams — a revered spiritual leader, an inspiring orator, a compassionate humanitarian and a dedicated guardian of India's cultural and spiritual heritage. Through his wisdom and selfless service he has sown the seeds of spirituality, nurtured moral values and illuminated the lives of countless devotees.",
  "Born Basavaraj Mulge on 21 June 1976 in Ratnapur, a village in Nyalkal Mandal of Sangareddy District, Telangana, he was the third son of Sri Rachappa Mulge and Smt. Bandemma, raised in a devout Lingayat family that had received spiritual initiation. Even during his college years at Kaviratna Kalidasa College he was drawn to philosophical inquiry, meditation and the deeper purpose of human existence.",
  "He completed his early schooling in his native village and his secondary and pre-university education at N.F.H.S. in Bidar. A laboratory technician course at Nittur in Bhalki Taluk gave him practical knowledge, and he went on to complete postgraduate studies in Kannada and Philosophy at Karnatak University, Dharwad, where he was awarded a gold medal. He also appeared for the preliminary examination of the UPSC in New Delhi.",
  "Following his graduation he undertook an intense spiritual journey in search of divine wisdom, performing penance in the Himalayas and visiting Kashi, Srisailam, Rishikesh and Badrinath. He received Jnana Deeksha from his revered Guru, Paramahamsa Pagal Baba, and in 2006 settled at Mallayyagiri, between Kuppanagar and Chillapalli villages. What began as a quiet place of sadhana now receives more than 10,000 devotees on every Pournami.",
  "His mission extends far beyond spiritual discourses. He guides parents in raising children with strong moral values, encourages young people to overcome harmful habits, promotes the importance of culture and education, and inspires society to embrace unity, brotherhood, compassion and patriotism. A practitioner of homeopathy, he has also extended care and guidance to countless devotees who have placed their faith in him.",
];

export const guruQuote = {
  text: "Let your heart be filled with devotion, your hands with service, and your mind with the remembrance of the Divine.",
  attribution: "Guru Vani",
};

export const quotes = [
  {
    text: "Devotion, Discipline and Service are the keys to realizing the Divine within.",
    telugu: "భక్తి, క్రమశిక్షణ, సేవ — ఇవే దైవాన్ని చేరుకునే మూడు మార్గాలు.",
    attribution: "Sri Dr. Basavalinga Avadhoota",
  },
  {
    text: "The Guru does not give you a new path; he removes the dust from the path you already walk.",
    attribution: "Guru Vani",
  },
  {
    text: "A life of simplicity is not a life of less. It is a life of enough.",
    attribution: "Guru Vani",
  },
  {
    text: "Where humility lives, the Divine finds a home.",
    attribution: "Guru Vani",
  },
  {
    text: "Serve the person in front of you. That is the beginning and the end of sadhana.",
    attribution: "Guru Vani",
  },
];

export const pillars = [
  {
    title: "Bhakti",
    subtitle: "Devotion",
    description:
      "Devotion softens the heart and turns everyday life into an offering. Through bhajan, pooja and remembrance, the seeker learns to see the Divine in all things.",
    icon: "heart" as IconKey,
  },
  {
    title: "Sadhana",
    subtitle: "Discipline",
    description:
      "A steady practice is the root of inner freedom. Yoga, meditation, silence and self-study give the mind a place to rest and the heart room to grow.",
    icon: "sun" as IconKey,
  },
  {
    title: "Seva",
    subtitle: "Service",
    description:
      "Service dissolves the distance between 'I' and 'other'. Annadanam, care for the vulnerable and quiet acts of help make spirituality something the hands can do.",
    icon: "hands" as IconKey,
  },
];

export const discourseThemes = [
  {
    title: "Guru Tattva",
    description:
      "What the Guru principle is, how it is transmitted, and why a living tradition matters.",
    icon: "lotus" as IconKey,
  },
  {
    title: "Sattvic Living",
    description:
      "Food, speech, routine and relationships — practical guidance for a clearer, calmer life.",
    icon: "leaf" as IconKey,
  },
  {
    title: "Family & Culture",
    description:
      "Raising children with values, honouring elders, and keeping the home a place of harmony.",
    icon: "users" as IconKey,
  },
  {
    title: "Youth & Character",
    description:
      "Courage, discipline and purpose for young seekers facing a fast-changing world.",
    icon: "sun" as IconKey,
  },
  {
    title: "Anubhava — Inner Experience",
    description:
      "Moving from belief to direct experience through silence, meditation and self-inquiry.",
    icon: "heart" as IconKey,
  },
  {
    title: "Dasoha & Community",
    description:
      "The ashram's tradition of sharing: food, knowledge, shelter and dignity for all.",
    icon: "hands" as IconKey,
  },
];

export const literaryWorks = [
  {
    title: "Anubhavaamrutha",
    description:
      "Telugu devotional songs that carry spiritual experience and philosophical insight in simple, singable verse.",
    icon: "music" as IconKey,
  },
  {
    title: "Satya Shudda",
    description:
      "Modern vachana compositions reflecting spiritual wisdom and ethical values, signed 'Ghana Yogi Mallinatha'.",
    icon: "book" as IconKey,
  },
  {
    title: "Oldie Haadida Hridaya Geeta",
    description:
      "A collection of devotional songs and reflections expressing the heart's longing for the Divine.",
    icon: "music" as IconKey,
  },
  {
    title: "Avadhoota Vaibhavam",
    description:
      "The life history, spiritual journey and divine leelas of Sri Dr. Basavalinga Avadhoota, recorded through the experiences of devotees.",
    icon: "book" as IconKey,
  },
  {
    title: "The Twenty-Four Avatars of Lord Dattatreya",
    description:
      "A study of the twenty-four avatars of Lord Dattatreya, guiding readers towards spiritual knowledge, devotion, righteousness and the path of self-realisation.",
    icon: "book" as IconKey,
  },
  {
    title: "Akkamahadevi Yoganga Trividhi",
    description:
      "An exploration of Jaganmatha Akkamahadevi's sacred teachings and the journey of the individual soul towards union with the Supreme Consciousness.",
    icon: "book" as IconKey,
  },
];

export const timeline = [
  {
    year: "1976",
    title: "Born in Ratnapur",
    description:
      "Born on 21 June, the third son of Sri Rachappa Mulge and Smt. Bandemma, in Ratnapur village, Nyalkal Mandal, Sangareddy District, Telangana.",
  },
  {
    year: "1990s",
    title: "Education and scholarship",
    description:
      "Studies at N.F.H.S. Bidar and Kaviratna Kalidasa College, trains as a laboratory technician at Nittur, and earns an M.A. in Kannada and Philosophy with a gold medal at Karnatak University, Dharwad.",
  },
  {
    year: "1990s–2000s",
    title: "Years of sadhana",
    description:
      "Undertakes penance in the Himalayas and visits Kashi, Srisailam, Rishikesh and Badrinath, receiving Jnana Deeksha from Paramahamsa Pagal Baba.",
  },
  {
    year: "2006",
    title: "Mallayyagiri Ashram",
    description:
      "Settles between Kuppanagar and Chillapalli and begins a life of satsang, healing and service that grows into the Mallayyagiri Ashram.",
  },
  {
    year: "2020",
    title: "Honorary doctorate",
    description:
      "Conferred an honorary doctorate by the International Peace University of Germany at the World Peace Conference in Ooty on 11 January.",
  },
  {
    year: "Today",
    title: "A living tradition",
    description:
      "Serves as Peethadhikari of the Mallayyagiri, Basavakalyan and Degalmadi Ashrams, guiding seekers across five states and in five languages.",
  },
];

export const recognition = [
  "Honorary doctorate from the International Peace University of Germany at the World Peace Conference, Ooty, on 11 January 2020",
  "Honoured by religious institutions, spiritual organisations and cultural associations across the Deccan",
  "Spiritual discourses delivered in more than 2,500 towns, cities and villages across Karnataka, Telangana, Andhra Pradesh and Maharashtra",
  "Author of six works in Kannada and Telugu, including Anubhavaamrutha, Satya Shudda and Avadhoota Vaibhavam",
];

export const dailyRhythm = [
  {
    time: "Early morning",
    title: "Suprabhata & abhisheka",
    description:
      "The shrine opens with prayer, abhisheka and a period of quiet meditation before the day's work begins.",
  },
  {
    time: "Morning",
    title: "Seva & ashram life",
    description:
      "Devotees and residents tend the gardens, prepare the kitchen and look after the daily needs of the ashram.",
  },
  {
    time: "Midday",
    title: "Annadanam",
    description:
      "Prasada is served to all who arrive. Visitors are welcome to join the meal and the seva that makes it possible.",
  },
  {
    time: "Evening",
    title: "Satsang & bhajan",
    description:
      "Gurudev's discourses, devotional singing and quiet reflection draw the day to a close.",
  },
  {
    time: "Night",
    title: "Aarti & silence",
    description:
      "The final aarti is offered, lamps are lit, and the ashram settles into the silence that gives it its character.",
  },
];

export const visitorGuidelines = [
  "Dress modestly and comfortably. Traditional Indian clothing is appreciated but not required.",
  "Remove footwear before entering the shrine and satsang hall.",
  "Please ask before photographing the shrine, the Guru or other devotees.",
  "Keep conversation low in the meditation areas and switch phones to silent.",
  "Alcohol, tobacco and non-vegetarian food are not permitted on the ashram grounds.",
  "Accommodation and prasada are offered as seva; call ahead so the ashram can prepare for you.",
];

export const visitFaqs = [
  {
    question: "Is the ashram open to everyone?",
    answer:
      "Yes. People of every background are welcome to visit the shrine, attend satsang and join the annadanam. There is no fee or membership.",
  },
  {
    question: "Do I need to book before visiting?",
    answer:
      "No booking is needed for a day visit. If you are travelling in a group, need accommodation or wish to come for a camp, please call the ashram office so arrangements can be made.",
  },
  {
    question: "When are the discourses held?",
    answer:
      "Satsang is held regularly, with large gatherings on Pournami and festival days. Discourses may also take place while Gurudev is travelling, so please call ahead to confirm the programme.",
  },
  {
    question: "Can I volunteer or offer seva?",
    answer:
      "Yes. Devotees are welcome to help with annadanam, the kitchen, the gardens and festival arrangements. Contact the office to be connected with the seva coordinator.",
  },
];

export const donationImpact = [
  {
    title: "Annadanam that never stops",
    description:
      "Every contribution helps the ashram serve a hot, sattvic meal to devotees, visitors and families in need.",
    icon: "seva" as IconKey,
  },
  {
    title: "A home for seekers",
    description:
      "Your support keeps the shrine, satsang hall and guest facilities clean, safe and open to all.",
    icon: "temple" as IconKey,
  },
  {
    title: "Education and youth",
    description:
      "Gifts support camps, cultural education and the practical care of the next generation.",
    icon: "book" as IconKey,
  },
];

export const donationFaqs = [
  {
    question: "How do I complete my gift?",
    answer:
      "Choose an amount and seva, then submit the form. The ashram office will share the UPI ID or bank account details for the transfer. After paying, send the reference to the office so your gift can be acknowledged. No card details are collected on this website.",
  },
  {
    question: "Do I get a receipt?",
    answer:
      "Yes. A phone number is required when you record your offering, and the acknowledgement is sent by SMS and WhatsApp to that number. For an 80G receipt, contact the ashram office directly and quote your reference.",
  },
  {
    question: "Can I give from outside India?",
    answer:
      "Please contact the ashram office before transferring. The team can share the correct bank details and explain the rules that apply to foreign contributions.",
  },
  {
    question: "Can I choose how my gift is used?",
    answer:
      "Yes. Choose Annadanam, Goshala Seva, Ashram Upkeep, Education & Youth, or a general donation. If a particular need is fully met, the ashram may apply your gift where it is most needed.",
  },
];

export const ashramAddress = site.address;
