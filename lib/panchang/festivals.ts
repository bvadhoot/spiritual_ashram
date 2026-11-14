import { DateTime } from "luxon";
import { IST } from "./calculate";
import type { Festival } from "./types";

function festival(
  id: string,
  date: string,
  name: string,
  nameTe: string,
  description: string,
  descriptionTe: string,
  category = "Festival",
  endDate?: string,
): Festival {
  return {
    id,
    date,
    endDate,
    name,
    nameTe,
    description,
    descriptionTe,
    category,
    major: true,
  };
}

/**
 * Reference festival dates for the ashram calendar. When the Prokerala
 * provider is configured, its live panchang remains the authority for the
 * daily tithi, nakshatra and rashi; these entries supply the mythology.
 */
export const FESTIVALS: Festival[] = [
  festival(
    "makara-sankranti-2026",
    "2026-01-14",
    "Makara Sankranti",
    "మకర సంక్రాంతి",
    "The sun enters Makara rashi. Homes and fields are blessed, sesame sweets are shared, and the ashram gives thanks for the harvest.",
    "సూర్యుడు మకర రాశిలోకి ప్రవేశించే పండుగ. పంటలకు కృతజ్ఞత తెలిపి, నువ్వుల మిఠాయిలను పంచుతారు.",
  ),
  festival(
    "vasant-panchami-2026",
    "2026-01-23",
    "Vasant Panchami",
    "వసంత పంచమి",
    "The first day of spring is dedicated to Saraswati, the goddess of learning, music and speech. Children begin their first letters on this day.",
    "వసంత ఋతువు ప్రారంభంలో సరస్వతీ దేవిని పూజిస్తారు. విద్య, సంగీతం, వాక్కులకు అధిష్ఠాన దేవత.",
  ),
  festival(
    "maha-shivratri-2026",
    "2026-02-15",
    "Maha Shivratri",
    "మహా శివరాత్రి",
    "The great night of Shiva recalls the cosmic dance and the union of Shiva and Shakti. Devotees keep vigil, fast and offer abhisheka through the night.",
    "శివుడు లింగోద్భవం చెందిన పవిత్ర రాత్రి. ఉపవాసం, జాగరణ, అభిషేకాలతో శివుడిని ఆరాధిస్తారు.",
  ),
  festival(
    "holi-2026",
    "2026-03-03",
    "Holi",
    "హోలీ",
    "Holika Dahan celebrates the triumph of devotion over arrogance. The next morning, colours are shared as a reminder that joy and forgiveness renew relationships.",
    "భక్తి అహంకారాన్ని జయించిన హోలికా దహనం. మరుసటి రోజు రంగులతో ఆనందాన్ని పంచుకుంటారు.",
    "Festival",
    "2026-03-04",
  ),
  festival(
    "ugadi-2026",
    "2026-03-19",
    "Ugadi",
    "ఉగాది",
    "The Telugu and Kannada new year begins with the Shukla Paksha of Chaitra. A bitter-sweet Ugadi pachadi reminds devotees to accept every flavour of life.",
    "చైత్ర శుక్ల పక్షంతో తెలుగు నూతన సంవత్సరం ప్రారంభం. ఉగాది పచ్చడి జీవితంలోని అన్ని రుచులను స్వీకరించమని చెబుతుంది.",
  ),
  festival(
    "rama-navami-2026",
    "2026-03-26",
    "Sri Rama Navami",
    "శ్రీ రామ నవమి",
    "The appearance day of Sri Rama, the seventh avatar of Vishnu, celebrates dharma, courage and a life lived in service of truth.",
    "శ్రీరాముడు అవతరించిన రోజు. ధర్మం, ధైర్యం, సత్యానికి జీవితాన్ని అంకితం చేయడం ఈ పండుగ సందేశం.",
  ),
  festival(
    "akshaya-tritiya-2026",
    "2026-04-19",
    "Akshaya Tritiya",
    "అక్షయ తృతీయ",
    "An auspicious day for beginnings, charity and sacred purchases. Akshaya means that which never diminishes; giving on this day is believed to multiply.",
    "ప్రారంభాలు, దానం, పవిత్ర కొనుగోళ్లకు శుభ దినం. ఈ రోజు చేసిన దానం ఎప్పటికీ తరగని పుణ్యంగా భావిస్తారు.",
  ),
  festival(
    "guru-purnima-2026",
    "2026-07-29",
    "Guru Purnima",
    "గురు పూర్ణిమ",
    "The full moon of Ashadha honours the Guru lineage. Devotees remember Vyasa, the ancient compiler of the scriptures, and offer gratitude to their teacher.",
    "ఆషాఢ పూర్ణిమ రోజు గురు పరంపరను పూజిస్తారు. వ్యాస మహర్షి స్మరణతో గురువులకు కృతజ్ఞత తెలుపుతారు.",
  ),
  festival(
    "raksha-bandhan-2026",
    "2026-08-28",
    "Raksha Bandhan",
    "రాఖీ పౌర్ణమి",
    "A sacred thread is tied as a promise of protection and affection. The festival celebrates the bond between siblings and the wider family of devotees.",
    "రక్షణ, ప్రేమకు చిహ్నంగా రాఖీ కడతారు. సోదర సోదరీమణుల బంధాన్ని, ఆశ్రమ కుటుంబాన్ని ఈ పండుగ జరుపుతుంది.",
  ),
  festival(
    "janmashtami-2026",
    "2026-09-04",
    "Krishna Janmashtami",
    "కృష్ణ జన్మాష్టమి",
    "The birth of Sri Krishna at midnight is celebrated with bhajans, fasting and the rocking of the cradle. Krishna's life teaches love, play and fearless dharma.",
    "అర్ధరాత్రి శ్రీకృష్ణుడు అవతరించిన రోజు. భజనలు, ఉపవాసం, ఉయ్యాల సేవతో జరుపుకుంటారు.",
  ),
  festival(
    "ganesh-chaturthi-2026",
    "2026-09-14",
    "Ganesh Chaturthi",
    "వినాయక చవితి",
    "Sri Ganesha, the remover of obstacles, is welcomed with clay murtis, modak and community singing. The festival ends with a respectful visarjan.",
    "విఘ్నాలను తొలగించే వినాయకుడిని మట్టి విగ్రహాలు, మోదకాలు, భజనలతో ఆహ్వానిస్తారు. విసర్జనతో పండుగ ముగుస్తుంది.",
  ),
  festival(
    "sharad-navratri-2026",
    "2026-10-11",
    "Sharad Navratri",
    "శరన్నవరాత్రులు",
    "Nine nights honour the nine forms of the Divine Mother. Devotees gather for Garba, Durga puja and nightly satsang, culminating in Vijayadashami.",
    "దేవీ మాత యొక్క తొమ్మిది రూపాలను తొమ్మిది రాత్రులు పూజిస్తారు. గర్బా, దుర్గా పూజ, రాత్రి సత్సంగాలతో జరుపుకుంటారు.",
    "Navratri",
    "2026-10-19",
  ),
  festival(
    "dussehra-2026",
    "2026-10-20",
    "Vijayadashami / Dussehra",
    "విజయదశమి",
    "The tenth day celebrates the victory of Durga over Mahishasura and Rama over Ravana. It is a day to resolve that truth and courage will guide the year ahead.",
    "దుర్గాదేవి మహిషాసురుడిపై, రాముడు రావణుడిపై సాధించిన విజయానికి చిహ్నం. ధర్మం, ధైర్యం మనకు మార్గదర్శకమని సంకల్పించే రోజు.",
  ),
  festival(
    "karva-chauth-2026",
    "2026-10-29",
    "Karva Chauth",
    "కర్వా చౌత్",
    "Married women keep a day-long fast and offer arghya to the moon, praying for the wellbeing of their husbands and families.",
    "వివాహితులు రోజంతా ఉపవాసం ఉండి, చంద్రుడికి అర్ఘ్యం సమర్పించి కుటుంబ శ్రేయస్సు కోసం ప్రార్థిస్తారు.",
  ),
  festival(
    "diwali-2026",
    "2026-11-08",
    "Deepavali",
    "దీపావళి",
    "The festival of lights celebrates Sri Rama's return to Ayodhya and the victory of light over darkness. Lamps, sweets and annadanam fill the ashram.",
    "శ్రీరాముడు అయోధ్యకు తిరిగి వచ్చిన సందర్భం, చీకటిపై వెలుగు విజయానికి చిహ్నం. దీపాలు, మిఠాయిలు, అన్నదానంతో ఆశ్రమం నిండుతుంది.",
  ),
  festival(
    "govardhan-puja-2026",
    "2026-11-09",
    "Govardhan Puja",
    "గోవర్ధన పూజ",
    "Devotees honour Govardhan hill and the cows that sustain the village, remembering Krishna's protection of the people of Braj.",
    "గోవర్ధన గిరి, గోవులను పూజిస్తారు. బ్రజ ప్రజలను కృష్ణుడు రక్షించిన లీలను స్మరిస్తారు.",
  ),
  festival(
    "bhai-dooj-2026",
    "2026-11-10",
    "Bhai Dooj",
    "భాయ్ దూజ్",
    "Sisters apply tilak to their brothers and pray for their long life. The day celebrates the protective love of siblings.",
    "సోదరీమణులు సోదరులకు తిలకం దిద్ది దీర్ఘాయువు కోసం ప్రార్థిస్తారు. సోదర ప్రేమకు చిహ్నం.",
  ),
  festival(
    "chhath-puja-2026",
    "2026-11-15",
    "Chhath Puja",
    "ఛఠ్ పూజ",
    "Devotees offer arghya to the setting and rising sun, thanking Surya for life and seeking the wellbeing of the family.",
    "అస్తమిస్తున్న, ఉదయిస్తున్న సూర్యుడికి అర్ఘ్యం సమర్పించి, జీవితానికి కృతజ్ఞత తెలుపుతారు.",
  ),
  festival(
    "kartika-purnima-2026",
    "2026-11-24",
    "Kartika Purnima",
    "కార్తీక పౌర్ణమి",
    "The full moon of Kartika is one of the holiest nights of the year. Lamps are floated on water, and devotees gather for deepotsava and Guru Vani.",
    "కార్తీక పౌర్ణమి సంవత్సరంలో అత్యంత పవిత్రమైన రాత్రులలో ఒకటి. నీటిపై దీపాలు వెలిగించి, దీపోత్సవంతో గురువాణి వింటారు.",
  ),
  festival(
    "dattatreya-jayanti-2026",
    "2026-12-04",
    "Dattatreya Jayanti",
    "దత్తాత్రేయ జయంతి",
    "The appearance day of Lord Dattatreya, the unified form of Brahma, Vishnu and Shiva, honours the wandering teacher and the Guru principle.",
    "బ్రహ్మ, విష్ణు, శివుల ఏకరూపమైన దత్తాత్రేయుడి జయంతి. గురు తత్వానికి, సంచార తపస్వికి నమస్కారం.",
  ),
  festival(
    "gita-jayanti-2026",
    "2026-12-19",
    "Gita Jayanti",
    "గీతా జయంతి",
    "The day the Bhagavad Gita was spoken on the field of Kurukshetra. Devotees read the Gita and reflect on action without attachment.",
    "కురుక్షేత్రంలో భగవద్గీత ఉపదేశించిన రోజు. గీతను పఠించి, ఫలాసక్తి లేని కర్మను ఆలోచిస్తారు.",
  ),
  festival(
    "makara-sankranti-2027",
    "2027-01-14",
    "Makara Sankranti",
    "మకర సంక్రాంతి",
    "The sun enters Makara rashi. Homes and fields are blessed, sesame sweets are shared, and the ashram gives thanks for the harvest.",
    "సూర్యుడు మకర రాశిలోకి ప్రవేశించే పండుగ. పంటలకు కృతజ్ఞత తెలిపి, నువ్వుల మిఠాయిలను పంచుతారు.",
  ),
  festival(
    "vasant-panchami-2027",
    "2027-01-22",
    "Vasant Panchami",
    "వసంత పంచమి",
    "The first day of spring is dedicated to Saraswati, the goddess of learning, music and speech.",
    "వసంత ఋతువు ప్రారంభంలో సరస్వతీ దేవిని పూజిస్తారు. విద్య, సంగీతం, వాక్కులకు అధిష్ఠాన దేవత.",
  ),
  festival(
    "maha-shivratri-2027",
    "2027-03-06",
    "Maha Shivratri",
    "మహా శివరాత్రి",
    "The great night of Shiva recalls the cosmic dance and the union of Shiva and Shakti. Devotees keep vigil and offer abhisheka.",
    "శివుడు లింగోద్భవం చెందిన పవిత్ర రాత్రి. ఉపవాసం, జాగరణ, అభిషేకాలతో శివుడిని ఆరాధిస్తారు.",
  ),
  festival(
    "holi-2027",
    "2027-03-22",
    "Holi",
    "హోలీ",
    "Holika Dahan celebrates the triumph of devotion over arrogance. Colours are shared the next morning.",
    "భక్తి అహంకారాన్ని జయించిన హోలికా దహనం. మరుసటి రోజు రంగులతో ఆనందాన్ని పంచుకుంటారు.",
    "Festival",
    "2027-03-23",
  ),
  festival(
    "ugadi-2027",
    "2027-04-07",
    "Ugadi",
    "ఉగాది",
    "The Telugu and Kannada new year begins with the Shukla Paksha of Chaitra.",
    "చైత్ర శుక్ల పక్షంతో తెలుగు నూతన సంవత్సరం ప్రారంభం.",
  ),
  festival(
    "rama-navami-2027",
    "2027-04-15",
    "Sri Rama Navami",
    "శ్రీ రామ నవమి",
    "The appearance day of Sri Rama celebrates dharma, courage and service of truth.",
    "శ్రీరాముడు అవతరించిన రోజు. ధర్మం, ధైర్యం, సత్యానికి జీవితాన్ని అంకితం చేయడం ఈ పండుగ సందేశం.",
  ),
  festival(
    "guru-purnima-2027",
    "2027-07-18",
    "Guru Purnima",
    "గురు పూర్ణిమ",
    "The full moon of Ashadha honours the Guru lineage and the wisdom of Vyasa.",
    "ఆషాఢ పూర్ణిమ రోజు గురు పరంపరను పూజిస్తారు. వ్యాస మహర్షి స్మరణతో గురువులకు కృతజ్ఞత తెలుపుతారు.",
  ),
  festival(
    "raksha-bandhan-2027",
    "2027-08-17",
    "Raksha Bandhan",
    "రాఖీ పౌర్ణమి",
    "A sacred thread is tied as a promise of protection and affection.",
    "రక్షణ, ప్రేమకు చిహ్నంగా రాఖీ కడతారు.",
  ),
  festival(
    "janmashtami-2027",
    "2027-08-25",
    "Krishna Janmashtami",
    "కృష్ణ జన్మాష్టమి",
    "The birth of Sri Krishna at midnight is celebrated with bhajans and fasting.",
    "అర్ధరాత్రి శ్రీకృష్ణుడు అవతరించిన రోజు. భజనలు, ఉపవాసంతో జరుపుకుంటారు.",
  ),
  festival(
    "ganesh-chaturthi-2027",
    "2027-09-04",
    "Ganesh Chaturthi",
    "వినాయక చవితి",
    "Sri Ganesha, the remover of obstacles, is welcomed with clay murtis and modak.",
    "విఘ్నాలను తొలగించే వినాయకుడిని మట్టి విగ్రహాలు, మోదకాలతో ఆహ్వానిస్తారు.",
  ),
  festival(
    "sharad-navratri-2027",
    "2027-10-01",
    "Sharad Navratri",
    "శరన్నవరాత్రులు",
    "Nine nights honour the nine forms of the Divine Mother and culminate in Vijayadashami.",
    "దేవీ మాత యొక్క తొమ్మిది రూపాలను తొమ్మిది రాత్రులు పూజిస్తారు.",
    "Navratri",
    "2027-10-09",
  ),
  festival(
    "dussehra-2027",
    "2027-10-10",
    "Vijayadashami / Dussehra",
    "విజయదశమి",
    "The tenth day celebrates the victory of Durga over Mahishasura and Rama over Ravana.",
    "దుర్గాదేవి మహిషాసురుడిపై, రాముడు రావణుడిపై సాధించిన విజయానికి చిహ్నం.",
  ),
  festival(
    "diwali-2027",
    "2027-10-29",
    "Deepavali",
    "దీపావళి",
    "The festival of lights celebrates Sri Rama's return to Ayodhya and the victory of light over darkness.",
    "శ్రీరాముడు అయోధ్యకు తిరిగి వచ్చిన సందర్భం, చీకటిపై వెలుగు విజయానికి చిహ్నం.",
  ),
];

export function festivalsOn(date: string): Festival[] {
  return FESTIVALS.filter(
    (item) => date >= item.date && date <= (item.endDate ?? item.date),
  );
}

export function upcomingFestivals(
  today: string,
  count = 5,
  source: Festival[] = FESTIVALS,
): Festival[] {
  const todayDate = DateTime.fromISO(today, { zone: IST }).startOf("day");
  return source.filter((item) => {
    const end = DateTime.fromISO(item.endDate ?? item.date, {
      zone: IST,
    }).startOf("day");
    return end.isValid && end >= todayDate;
  })
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .slice(0, count);
}
