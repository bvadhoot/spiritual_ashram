export const site = {
  name: "Poojya Sri Dr. Basavalinga Avadhoota",
  shortName: "Sri Basavalinga Avadhoota Ashram",
  ashramName: "Mallayyagiri Ashram",
  teluguName: "శ్రీ బసవలింగ అవధూత ఆశ్రమం",
  teluguPlace: "మలయగిరి",
  tagline: "A Divine Abode for Peace, Devotion and Spiritual Transformation",
  description:
    "The official home of Sri Dr. Basavalinga Avadhoota and the Mallayyagiri Ashram — a living tradition of satsang, sadhana, annadanam and service in Jharasangam, Telangana.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://basavalingaavadhoota.org",
  location: "Kuppa Nagar, Jharasangam, Telangana",
  address: {
    line1: "Mallayyagiri Ashram, Kuppanagar–Chillapalli",
    line2: "Jharasangam Mandal, Zaheerabad Taluk",
    line3: "Sangareddy District, Telangana 585307",
  },
  secondAshram: {
    name: "Degalmadi Ashram",
    address: "Chincholi Taluk, Kalburgi District, Karnataka 585307",
  },
  phones: [
    { label: "+91 63052 90187", href: "+916305290187" },
    { label: "+91 97014 76573", href: "+919701476573" },
  ],
  email: "basavalingavadhoot@gmail.com",
  socials: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/sribasavalingaavadhoota.ashram/",
      icon: "facebook" as const,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/sri.basavalinga_avadhoota/",
      icon: "instagram" as const,
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/channel/UCu9l6DAQTXW5kSoRjSefulQ",
      icon: "youtube" as const,
    },
  ],
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Sri+Basavalinga+Avadhoota+Ashram+Mallayyagiri",
  mapEmbed:
    "https://www.google.com/maps?q=Sri%20Basavalinga%20Avadhoota%20Ashram%20Mallayyagiri&output=embed",
  donation: {
    min: 100,
    max: 500000,
    presets: [100, 501, 1100, 2500, 5100],
    designations: [
      "Annadanam Seva",
      "Goshala Seva",
      "Ashram Upkeep",
      "Education & Youth",
      "General Donation",
    ],
    // Add the UPI ID and bank details once the ashram office confirms them.
    // While these are blank, the form asks the donor to request the details
    // from the office instead of showing incomplete payment information.
    giving: {
      upiId: "",
      upiName: "Sri Basavalinga Avadhoota Ashram",
      bank: {
        accountName: "Sri Basavalinga Avadhoota Ashram",
        accountNumber: "",
        ifsc: "",
        bankName: "",
        branch: "",
      },
    },
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About Guru", href: "/about" },
    { label: "Ashram", href: "/ashram" },
    { label: "Teachings", href: "/teachings" },
    { label: "Books", href: "/books" },
    { label: "Aarti", href: "/aarti" },
    { label: "Gallery", href: "/gallery" },
    { label: "Events", href: "/events" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export const stats = [
  { value: "2,500+", label: "Villages & towns reached with Guru Vani" },
  { value: "10,000+", label: "Devotees gathered on Pournami days" },
  { value: "5", label: "Languages of discourse" },
  { value: "3", label: "Ashrams in Telangana & Karnataka" },
] as const;
