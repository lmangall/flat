export type Category = 'coffee' | 'food' | 'walks' | 'museums'

export interface Place {
  id: string
  category: Category
  name: string
  emoji: string
  description: { en: string; pl: string }
  url: string
  lat: number
  lng: number
  tgtg?: boolean
}

/** Flat location */
export const FLAT_COORDS = {
  lat: parseFloat(process.env.NEXT_PUBLIC_FLAT_LAT ?? '0'),
  lng: parseFloat(process.env.NEXT_PUBLIC_FLAT_LNG ?? '0'),
} as const

/** Category colors keyed to the design system */
export const categoryColors: Record<Category, string> = {
  coffee: '#1B6B6D',  // mer
  food: '#D4785C',    // sunset
  walks: '#5C8A4D',   // olive green
  museums: '#8B6B9C', // muted plum
}

export const places: Place[] = [
  {
    id: 'nomads',
    category: 'coffee',
    name: 'Nomads Coffee',
    emoji: '☕',
    description: {
      en: 'Our favourite specialty coffee spot. Chill vibes, good music, great place to sit and work or just enjoy a proper flat white.',
      pl: 'Nasz ulubiony lokal ze specialty coffee. Spokojny klimat, dobra muzyka — idealne miejsce, żeby usiąść z komputerem lub po prostu wypić porządną kawę.',
    },
    url: 'https://maps.app.goo.gl/mQSXwVzkSRWwGdrY6',
    lat: 43.5808805,
    lng: 7.1271802,
  },
  {
    id: 'petit-monsieur',
    category: 'coffee',
    name: 'Petit Monsieur',
    emoji: '☕',
    description: {
      en: 'Cosy hipster café with excellent coffee and good snacks. A neighbourhood gem.',
      pl: 'Przytulna kawiarnia z doskonałą kawą i dobrymi przekąskami. Prawdziwy klejnot w tej okolicy.',
    },
    url: 'https://maps.app.goo.gl/jxv2xMBN4kza2GM97',
    lat: 43.5803396,
    lng: 7.1249806,
  },
  {
    id: 'pizza',
    category: 'food',
    name: 'Our favourite pizza',
    emoji: '🍕',
    description: {
      en: 'The best pizza in town as far as we\'re concerned. Go, you\'ll understand.',
      pl: 'Najlepsza pizza w mieście, według nas. Idźcie, sami zobaczycie.',
    },
    url: 'https://maps.app.goo.gl/bArcAb6PFyRmuN49A',
    lat: 43.5829721,
    lng: 7.1266607,
  },
  {
    id: 'pan-bagnat-cheap',
    category: 'food',
    name: 'Pan Bagnat (budget-friendly)',
    emoji: '🥖',
    description: {
      en: 'Pan bagnat is the local sandwich — tuna, vegetables, olive oil. A must-try. This is the more affordable version.',
      pl: 'Pan bagnat to lokalna kanapka — tuńczyk, warzywa, oliwa z oliwek. Trzeba spróbować. Tu jest tańsza opcja.',
    },
    url: 'https://maps.app.goo.gl/fgbapKqvpEtKDfQb6',
    lat: 43.573298,
    lng: 7.1240704,
  },
  {
    id: 'pan-bagnat-sea',
    category: 'food',
    name: 'Pan Bagnat by the Sea',
    emoji: '🥖',
    description: {
      en: 'Same delicious local sandwich, but you eat it with a view of the Mediterranean. Worth every extra cent.',
      pl: 'Ta sama pyszna lokalna kanapka, ale jesz ją z widokiem na Morze Śródziemne. Warta każdego dodatkowego euro.',
    },
    url: 'https://maps.app.goo.gl/HskFf88ofWqgtFhJ8',
    lat: 43.5744859,
    lng: 7.1247388,
  },
  {
    id: 'lighthouse',
    category: 'walks',
    name: 'Walk to the Lighthouse',
    emoji: '🌲',
    description: {
      en: 'A gorgeous walk through the pine forest along Cap d\'Antibes, ending at the lighthouse with stunning sea views. One of our favourites.',
      pl: 'Piękny spacer przez sosnowy las wzdłuż Cap d\'Antibes, kończący się przy latarni morskiej z niesamowitymi widokami. Jeden z naszych ulubionych.',
    },
    url: 'https://maps.app.goo.gl/nYjbUFDdWxi2MB9T7',
    lat: 43.5643925,
    lng: 7.1327301,
  },
  {
    id: 'fort-carre',
    category: 'walks',
    name: 'Fort Carré Loop',
    emoji: '🏰',
    description: {
      en: 'Walk along the harbour, then enter the Fort Carré park when you spot the stadium. Great views, interesting history, and a lovely green area.',
      pl: 'Spacer wzdłuż portu, potem wejście do parku Fort Carré przy stadionie. Świetne widoki, ciekawa historia i piękny zielony teren.',
    },
    url: 'https://maps.app.goo.gl/U49uQdXKzR5nYj6a7',
    lat: 43.5901006,
    lng: 7.1274227,
  },
  {
    id: 'beaches',
    category: 'walks',
    name: 'Walk to the Beautiful Beaches',
    emoji: '🏖️',
    description: {
      en: 'Head towards some of the most beautiful beaches in the area — crystal clear water and stunning scenery. Perfect for a longer afternoon.',
      pl: 'Trasa do jednych z najpiękniejszych plaż w okolicy — krystalicznie czysta woda i cudowna sceneria. Idealne na dłuższe popołudnie.',
    },
    url: 'https://maps.app.goo.gl/3XLbyN1u9S4wiok18',
    lat: 43.5552772,
    lng: 7.1402535,
  },
  {
    id: 'river-forest',
    category: 'walks',
    name: 'River Forest Walk',
    emoji: '🌊',
    description: {
      en: 'A refreshing walk in the forest beside a river — cool, quiet and totally off the tourist track. Perfect on a hot day.',
      pl: 'Orzeźwiający spacer w lesie przy rzece — chłodny, cichy i zupełnie z dala od turystów. Idealne na gorący dzień.',
    },
    url: 'https://maps.app.goo.gl/jmmxwzpnLedAwuyD6',
    lat: 43.6264079,
    lng: 7.0659628,
  },
  {
    id: 'picasso',
    category: 'museums',
    name: 'Musée Picasso',
    emoji: '🎨',
    description: {
      en: 'Picasso spent time in Antibes and the museum is housed in the stunning Grimaldi castle overlooking the sea. Genuinely unmissable.',
      pl: 'Picasso spędził czas w Antibes, a muzeum mieści się w pięknym zamku Grimaldi z widokiem na morze. Absolutnie obowiązkowy punkt.',
    },
    url: 'https://maps.app.goo.gl/6McDACiWt7ZJJUst5',
    lat: 43.5808431,
    lng: 7.1283493,
  },
  {
    id: 'archaeology',
    category: 'museums',
    name: "Musée d'Archéologie",
    emoji: '🏛️',
    description: {
      en: "Antibes has a fascinating ancient history — the museum showcases Greek and Roman finds from the area. More interesting than you'd expect.",
      pl: 'Antibes ma fascynującą starożytną historię — muzeum prezentuje greckie i rzymskie znaleziska z okolicy. Bardziej interesujące, niż myślicie.',
    },
    url: 'https://maps.app.goo.gl/rUChbiyW2CLWCi7z7',
    lat: 43.5774737,
    lng: 7.1260853,
  },
  {
    id: 'lerins',
    category: 'walks',
    name: 'Lérins Islands Day Trip',
    emoji: '🏝️',
    description: {
      en: 'A gorgeous day trip by boat to the islands just off the coast. The ticket is a bit pricey but totally worth it — stunning nature, clear water, and a peaceful escape from the mainland.',
      pl: 'Wspaniała wycieczka łodzią na wyspy tuż przy wybrzeżu. Bilet jest trochę droższy, ale zdecydowanie warto — piękna przyroda, czysta woda i spokojny odpoczynek od stałego lądu.',
    },
    url: 'https://maps.app.goo.gl/D1bmE7aNL5dLNads8',
    lat: 43.5141874,
    lng: 7.0525374,
  },
  {
    id: 'perrin-tgtg',
    category: 'food',
    name: 'Maison Perrin',
    emoji: '🍝',
    description: {
      en: 'We know this place through Too Good To Go. Artisanal fresh pasta and ravioli shop on the other side of Cours Masséna — great way to grab pasta at a discount.',
      pl: 'Znamy to miejsce dzięki Too Good To Go. Rzemieślniczy sklep ze świeżym makaronem i ravioli po drugiej stronie Cours Masséna — świetny sposób na tańszy makaron.',
    },
    url: 'https://www.google.com/maps/search/?api=1&query=Perrin+Ravioli+29+Cours+Massena+Antibes',
    lat: 43.5814,
    lng: 7.1277,
    tgtg: true,
  },
  {
    id: 'nki-sushi-tgtg',
    category: 'food',
    name: 'NKI Sushi',
    emoji: '🍣',
    description: {
      en: 'We know this place through Too Good To Go. Sushi spot — but the bags drop really late, usually around 9 pm or later. Good for a late-night surprise.',
      pl: 'Znamy to miejsce dzięki Too Good To Go. Sushi — ale paczki pojawiają się naprawdę późno, zwykle około 21:00 lub później. Dobre na wieczorną niespodziankę.',
    },
    url: 'https://www.google.com/maps/search/?api=1&query=NKI+Sushi+20+Boulevard+Gustave+Chancel+Antibes',
    lat: 43.5806,
    lng: 7.1195,
    tgtg: true,
  },
  {
    id: 'ponzo-tgtg',
    category: 'food',
    name: 'Ponzo',
    emoji: '🍕',
    description: {
      en: 'We know this place through Too Good To Go. Roman-style pizza by the slice — bags available around 5–6 pm, but the pickup window is really short. It\'s very close to the flat, so be quick!',
      pl: 'Znamy to miejsce dzięki Too Good To Go. Rzymska pizza na kawałki — paczki dostępne około 17–18, ale okno odbioru jest naprawdę krótkie. Jest bardzo blisko mieszkania, więc trzeba się pospieszyć!',
    },
    url: 'https://www.google.com/maps/search/?api=1&query=Ponzo+13+Rue+Thuret+Antibes',
    lat: 43.5821,
    lng: 7.1264,
    tgtg: true,
  },
  {
    id: 'bonnefoi-1',
    category: 'food',
    name: 'Lilian Bonnefoi (Old Town)',
    emoji: '🍰',
    description: {
      en: 'We know this place through Too Good To Go. Local and refined pastry & chocolaterie — a chance to grab beautiful pastries at a discount.',
      pl: 'Znamy to miejsce dzięki Too Good To Go. Lokalna i wyrafinowana cukiernia i czekoladeria — okazja na piękne wypieki w niższej cenie.',
    },
    url: 'https://maps.app.goo.gl/XegC8WR2ed6coFCCA',
    lat: 43.5788372,
    lng: 7.1261011,
    tgtg: true,
  },
  {
    id: 'bonnefoi-2',
    category: 'food',
    name: 'Lilian Bonnefoi (2nd location)',
    emoji: '🍰',
    description: {
      en: 'We know this place through Too Good To Go. Second location of this excellent local pastry & chocolaterie.',
      pl: 'Znamy to miejsce dzięki Too Good To Go. Druga lokalizacja tej doskonałej lokalnej cukierni i czekoladerii.',
    },
    url: 'https://maps.app.goo.gl/5NHRsdQwzjrRHB6U8',
    lat: 43.5813376,
    lng: 7.1205657,
    tgtg: true,
  },
  {
    id: 'naturalia',
    category: 'food',
    name: 'Naturalia',
    emoji: '🥬',
    description: {
      en: 'If you\'re vegetarian or vegan, Naturalia is an organic food shop with a much wider selection of plant-based options than a regular supermarket.',
      pl: 'Jeśli jesteście wegetarianami lub weganami, Naturalia to sklep z ekologiczną żywnością z dużo większym wyborem opcji roślinnych niż zwykły supermarket.',
    },
    url: 'https://www.google.com/maps/search/?api=1&query=Naturalia+2+Rue+Championnet+Antibes',
    lat: 43.5809,
    lng: 7.1231,
  },
]
