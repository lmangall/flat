export type Lang = 'en' | 'pl'

const blob = process.env.NEXT_PUBLIC_BLOB_URL ?? ''

export const translations = {
  en: {
    nav: {
      flat: 'The Flat',
      araki: 'Araki',
      around: 'Getting Around',
      explore: 'Explore',
      contact: 'Contact',
    },
    hero: {
      welcome: 'Welcome to our place',
      address: process.env.NEXT_PUBLIC_ADDRESS ?? '',
      subtitle: "Make yourself at home — here's everything you need to know for your stay.",
    },
    flat: {
      sectionLabel: 'Section 01',
      title: 'The Flat',
      humidity: {
        title: 'Open the windows',
        emoji: '🪟',
        text: "It's really important to open the windows regularly — especially upstairs, where humidity builds up fast. Same story in the bathroom: we usually leave the towels outside to dry rather than keeping them in there.",
      },
      location: {
        title: 'Location',
        emoji: '📍',
        text: "Antibes is one of the most charming towns on the coast — the old town is a postcard come to life. The flat sits right on the Marché Provençal, next to the Picasso Museum, and 20 meters from the seaside promenade. It's bright and sunny most of the day, with a sea view for your morning coffee — and surprisingly quiet despite being so central. The train runs east to Italy and west to Marseille, so the whole coast is yours to explore.",
      },
      practical: {
        title: 'Practical info',
        emoji: '🛏️',
        text: "Bedsheets, towels, hairdryer, and a fully equipped kitchen are all here (no dishwasher). Bathroom has a bathtub; toilet is separate. Fast internet. No elevator — it's a 4th-floor walkup in a classic old town building. The upper part under the roof has very low ceilings — watch your head (we really mean it). The stairs can be slippery with socks, so be careful going up and down.",
      },
      oven: {
        title: 'Oven light',
        emoji: '💡',
        text: "Quick heads up: the oven light doesn't switch off on its own. Please remember to turn it off after using the oven so it doesn't stay on.",
      },
      gallery: {
        title: 'Photos',
        items: [
          { src: `${blob}/flat/flat-from-sky.png`, caption: 'The flat from the sky' },
          { src: `${blob}/flat/side-window-view.jpeg`, caption: 'Side window view' },
          { src: `${blob}/flat/araki-sunbathing.jpeg`, caption: 'Araki taking the sun (not allowed on the seat)' },
          { src: `${blob}/flat/araki-on-rug.jpg`, caption: 'Araki on the rug' },
          { src: `${blob}/flat/pink-sofa-and-rug.jpg`, caption: 'Pink sofa and rug' },
          { src: `${blob}/flat/living-room.jpg`, caption: 'Living room' },
          { src: `${blob}/flat/yellow-shelves.jpg`, caption: 'Yellow shelves' },
          { src: `${blob}/flat/wooden-beam-mimosa.jpg`, caption: 'Wooden beam with mimosa' },
          { src: `${blob}/flat/les-remparts.jpeg`, caption: 'Les remparts' },
          { src: `${blob}/flat/room-view.jpeg`, caption: 'Room view' },
          { src: `${blob}/flat/our-door.jpeg`, caption: 'Our door' },
          { src: `${blob}/flat/ears-in-the-air.jpeg`, caption: 'Ears in the air' },
          { src: `${blob}/flat/flat-from-sky-2.png`, caption: 'The flat from the sky' },
        ],
        video: { src: `${blob}/flat/view-video.mp4`, caption: 'The view' },
      },
    },
    araki: {
      sectionLabel: 'Section 02',
      title: 'Araki',
      intro: "Araki is part of the deal and we know you love him. Here's everything you need to know.",
      processionaryAlert: {
        kicker: 'Important warning',
        title: 'Pine processionary caterpillars',
        text: 'Dangerous caterpillars active January–May. Please read before walking Araki.',
        cta: 'Read the warning',
      },
      stuff: {
        title: 'Thank you',
        emoji: '❤️',
        text: "Thank you so much for taking care of Araki — it means the world to us!",
      },
      food: {
        title: 'Feeding',
        emoji: '🍽️',
        text: "He has to be sitting at his place while you prepare his food. Give him one dose and a little bit of his kibble (about 1.25 doses total), plus the green powder on top.",
      },
      walks: {
        title: 'Walks',
        emoji: '🦮',
        text: "Araki prefers to come with you everywhere, but you can leave him home and explore on your own. He needs at least 2 walks a day.",
      },
      night: {
        title: 'At night',
        emoji: '🌙',
        text: 'Araki might come during the night and ask to sleep with you — don\'t let him! Tell him "dobranoc" or "na miejsce" and he\'ll go back to his spot.',
      },
    },
    processionary: {
      title: 'Pine processionary',
      intro: 'A dangerous caterpillar. Read this before walking Araki between January and May.',
      back: '← Back to the guide',
      warning: {
        title: 'Important warning',
        text: 'Pine processionary caterpillars are extremely dangerous to dogs. Their microscopic hairs cause severe burns, swelling and possible tongue necrosis. This is a real veterinary emergency.',
      },
      season: {
        title: 'When',
        text: 'On the Mediterranean coast the caterpillars descend from pines between January and May, with peak risk February to April. They travel nose-to-tail in long processions on the ground — Araki will be very curious. Do not let him near them, even after they look dead.',
      },
      identify: {
        title: 'What they look like',
        text: 'Up to 4 cm long, brown-black with reddish patches and a yellow underside, very hairy. They move in single-file processions of dozens of individuals. A solitary hairy caterpillar is probably not one of them — they live in groups, in silky nests at the tip of pine branches.',
        caption: 'Pine processionary caterpillars in procession.',
      },
      dangerForDog: {
        title: 'Risk for Araki',
        text: 'Symptoms appear within 2 hours of contact: sudden heavy drooling, vomiting, face scratching, very painful swelling of the tongue and lips. Without rapid treatment the tongue can turn black within 24–48 h with possible necrosis (partial amputation may be required). Inhaled hairs can cause respiratory distress and shock.',
        symptomsCaption: 'Typical symptoms.',
        dogCaption: 'Affected dog — heavy salivation, swollen tongue.',
      },
      dangerForHuman: {
        title: 'Risk for you too',
        intro: 'Animals are more often affected, but the hairs are also harmful to humans. The toxin (histamine) attaches easily to skin, mucous membranes and clothing. Repeated exposures can trigger allergic reactions that worsen each time. The hairs remain urticant for several months after the caterpillars are gone — abandoned nests are still dangerous.',
        skin: {
          title: 'Skin contact',
          text: 'Within 1–12 h: painful rash, intense itching, possible swelling of the face (mouth, eyelids). The hairs spread via sweat, scratching, rubbing or clothing. Symptoms can last 10–18 days.',
        },
        eyes: {
          title: 'Eye contact',
          text: 'Within 1–4 h: conjunctivitis (red, painful, watery eyes), possibly corneal lesion (keratitis). Symptoms last 2–15 days; if hairs cross the cornea, irritation can persist for years.',
        },
        breathing: {
          title: 'Inhalation',
          text: 'Hairs irritate the airways: sneezing, sore throat, difficulty swallowing, sometimes respiratory distress (pharyngeal or laryngeal edema).',
        },
        ingestion: {
          title: 'Ingestion',
          text: 'Inflammation of the mouth and intestinal lining: hypersalivation, vomiting, abdominal pain.',
        },
        severe: {
          title: 'Severe reactions',
          text: 'In rare cases, anaphylactic shock can occur — call 15 or 112 immediately, this is a life-threatening emergency. If you carry an adrenaline auto-injector (EpiPen) for another allergy, use it.',
        },
      },
      whatToDo: {
        title: 'What to do — emergency',
        intro: 'If Araki has been in contact with one, every minute counts:',
        steps: [
          'Put on gloves before touching his mouth (the hairs sting you too).',
          'Rinse his mouth abundantly with cold water or saline for 10 to 15 minutes. Carefully remove hairs from eyes, nose, mouth — do not rub.',
          'Call a vet immediately — this is a true emergency. The vet may need to hospitalise him.',
        ],
      },
      prevention: {
        title: 'Prevention',
        text: 'If you spot a procession on the ground or a silky cocoon-like nest in a pine tree above, keep Araki on a short leash and change your walking route. Traps placed around pine trunks (pictured) are a sign that processionaries are active nearby.',
        caption: 'Pine trunk trap — sign of an active area.',
      },
      contacts: {
        title: 'Emergency numbers',
        text: 'Severe skin reaction on yourself: poison control center or doctor. Breathing difficulty (you or Araki): call 15 or 112 without delay.',
      },
    },
    around: {
      sectionLabel: 'Section 03',
      title: 'Getting Around',
      airport: {
        title: 'From the airport',
        emoji: '✈️',
        steps: [
          'Exit the terminal and board the free tram.',
          'If you land on T2 — take 1 stop to T1 and walk to the train station, OR 2 stops to "Railroad Station" and walk back.',
          '(Make sure the tram you board goes through "Railroad Station".)',
          "Don't lose time: buy your train ticket while still on the tram!",
        ],
      },
      trains: {
        title: 'Trains',
        emoji: '🚆',
        text: "Use SNCF Connect to book tickets — it takes a bit of time since you need to enter a lot of details. Trains are frequent and some run all the way from Marseille to Italy, so the whole coast is easy to explore.",
        card: {
          eyebrow: 'Save on train fares',
          title: 'Carte Zou Malin',
          price: '20 € / year',
          text: "30% off for you and a companion — valid for one year. When booking, select whether each passenger is the cardholder or the \"accompagnant\". Worth it if you plan to take the train more than a couple of times.",
          cta: 'Get the Zou Malin card →',
          url: 'https://www.ter.sncf.com/sud-provence-alpes-cote-d-azur/tarifs-cartes/cartes-reduction/carte-zou-malin',
        },
      },
      buses: {
        title: 'Buses',
        emoji: '🚌',
        text: 'Buses can be cheaper and sometimes cover longer routes that trains don\'t. They run less frequently but are worth checking.',
      },
      maps: {
        title: 'Google Maps',
        emoji: '📍',
        text: 'Google Maps works perfectly here for public transport — just drop in your destination and it gives you trains, buses and walking options.',
      },
    },
    explore: {
      sectionLabel: 'Section 04',
      title: 'Explore Antibes',
      all: 'All',
      categories: {
        coffee: 'Coffee',
        food: 'Food',
        walks: 'Walks',
        museums: 'Museums',
        'local-specialties': 'Local Specialties',
      },
      openMaps: 'Open in Maps →',
    },
    contact: {
      sectionLabel: 'Section 05',
      title: 'Contact',
      subtitle: "Got a question? We're always on WhatsApp.",
      address: process.env.NEXT_PUBLIC_ADDRESS ?? '',
      leo: 'Message Leo',
      martyna: 'Message Martyna',
      group: 'Group chat',
      groupNote: 'Ask us for the link',
    },
    login: {
      title: 'Welcome',
      subtitle: 'Enter the password to access the guide',
      placeholder: 'Password',
      button: 'Enter',
      error: 'Wrong password. Try again.',
    },
  },

  pl: {
    nav: {
      flat: 'Mieszkanie',
      araki: 'Araki',
      around: 'Jak się poruszać',
      explore: 'Zwiedzanie',
      contact: 'Kontakt',
    },
    hero: {
      welcome: 'Witajcie w naszym miejscu',
      address: process.env.NEXT_PUBLIC_ADDRESS ?? '',
      subtitle: 'Jak u siebie — tu znajdziecie wszystko, co musicie wiedzieć przed pobytem.',
    },
    flat: {
      sectionLabel: 'Sekcja 01',
      title: 'Mieszkanie',
      humidity: {
        title: 'Otwierajcie okna',
        emoji: '🪟',
        text: 'Naprawdę ważne, żeby regularnie otwierać okna — szczególnie na górze, gdzie wilgoć zbiera się bardzo szybko. Tak samo w łazience: zwykle zostawiamy ręczniki na zewnątrz do schnięcia, zamiast trzymać je w środku.',
      },
      location: {
        title: 'Lokalizacja',
        emoji: '📍',
        text: 'Antibes to jedno z najbardziej urokliwych miasteczek na wybrzeżu — stare miasto wygląda jak z pocztówki. Mieszkanie jest na samym Marché Provençal, obok Muzeum Picassa, 20 metrów od nadmorskiej promenady. Jasne i słoneczne przez większość dnia, z widokiem na morze do porannej kawy — i zaskakująco ciche mimo centralnej lokalizacji. Pociąg jedzie na wschód do Włoch i na zachód do Marsylii, więc całe wybrzeże jest do zwiedzania.',
      },
      practical: {
        title: 'Informacje praktyczne',
        emoji: '🛏️',
        text: 'Pościel, ręczniki, suszarka i w pełni wyposażona kuchnia (bez zmywarki). Łazienka z wanną; toaleta osobno. Szybki internet. Bez windy — 4. piętro w klasycznym budynku starego miasta. Górna część pod dachem ma bardzo niskie sufity — uważaj na głowę (naprawdę bardzo). Schody mogą być śliskie w skarpetkach, więc ostrożnie przy wchodzeniu i schodzeniu.',
      },
      oven: {
        title: 'Lampka piekarnika',
        emoji: '💡',
        text: 'Mała uwaga: lampka piekarnika nie gaśnie sama. Pamiętajcie wyłączyć ją po użyciu piekarnika, żeby nie świeciła cały czas.',
      },
      gallery: {
        title: 'Zdjęcia',
        items: [
          { src: `${blob}/flat/flat-from-sky.png`, caption: 'Mieszkanie z góry' },
          { src: `${blob}/flat/side-window-view.jpeg`, caption: 'Widok z bocznego okna' },
          { src: `${blob}/flat/araki-sunbathing.jpeg`, caption: 'Araki na słońcu (nie wolno mu na fotel)' },
          { src: `${blob}/flat/araki-on-rug.jpg`, caption: 'Araki na dywanie' },
          { src: `${blob}/flat/pink-sofa-and-rug.jpg`, caption: 'Różowa sofa i dywan' },
          { src: `${blob}/flat/living-room.jpg`, caption: 'Salon' },
          { src: `${blob}/flat/yellow-shelves.jpg`, caption: 'Żółte półki' },
          { src: `${blob}/flat/wooden-beam-mimosa.jpg`, caption: 'Drewniana belka z mimozą' },
          { src: `${blob}/flat/les-remparts.jpeg`, caption: 'Mury obronne' },
          { src: `${blob}/flat/room-view.jpeg`, caption: 'Widok pokoju' },
          { src: `${blob}/flat/our-door.jpeg`, caption: 'Nasze drzwi' },
          { src: `${blob}/flat/ears-in-the-air.jpeg`, caption: 'Uszy w górze' },
          { src: `${blob}/flat/flat-from-sky-2.png`, caption: 'Mieszkanie z góry' },
        ],
        video: { src: `${blob}/flat/view-video.mp4`, caption: 'Widok' },
      },
    },
    araki: {
      sectionLabel: 'Sekcja 02',
      title: 'Araki',
      intro: 'To jest Araki — nasz pies. Jest częścią pakietu i wiemy, że go pokochacie. Tu znajdziecie wszystko, co musicie wiedzieć.',
      processionaryAlert: {
        kicker: 'Ważne ostrzeżenie',
        title: 'Procesjonarka sosnowa',
        text: 'Niebezpieczne gąsienice aktywne od stycznia do maja. Przeczytajcie zanim wyjdziecie z Arakim.',
        cta: 'Przeczytaj ostrzeżenie',
      },
      stuff: {
        title: 'Dziękujemy',
        emoji: '🐾',
        text: 'Bardzo dziękujemy za opiekę nad Arakim — to naprawdę wiele dla nas znaczy!',
      },
      food: {
        title: 'Karmienie',
        emoji: '🍽️',
        text: 'Musi siedzieć na swoim miejscu, kiedy przygotowujecie mu jedzenie. Dawajcie mu jedną porcję i trochę karmy (około 1,25 porcji w sumie) plus zielony proszek na wierzch.',
      },
      walks: {
        title: 'Spacery',
        emoji: '🦮',
        text: 'Araki woli chodzić z wami wszędzie, ale możecie go zostawić w domu i zwiedzać na własną rękę. Potrzebuje minimum 2 spacerów dziennie.',
      },
      night: {
        title: 'W nocy',
        emoji: '🌙',
        text: 'Araki może przyjść w nocy i chcieć spać z wami — nie pozwalajcie mu! Powiedzcie mu „dobranoc" albo „na miejsce" i wróci na swoje miejsce.',
      },
    },
    processionary: {
      title: 'Procesjonarka sosnowa',
      intro: 'Niebezpieczna gąsienica. Przeczytajcie to zanim wyjdziecie z Arakim między styczniem a majem.',
      back: '← Wróć do przewodnika',
      warning: {
        title: 'Ważne ostrzeżenie',
        text: 'Gąsienice procesjonarki sosnowej są bardzo niebezpieczne dla psów. Ich mikroskopijne włoski powodują poważne oparzenia, opuchliznę i mogą prowadzić do martwicy języka. To prawdziwy nagły wypadek weterynaryjny.',
      },
      season: {
        title: 'Kiedy',
        text: 'Na Wybrzeżu Lazurowym gąsienice schodzą z sosen od stycznia do maja, ze szczytem ryzyka od lutego do kwietnia. Idą jedna za drugą w długich procesjach po ziemi — Araki będzie bardzo ciekawy. Nie pozwalajcie mu się do nich zbliżać, nawet jeśli wyglądają na martwe.',
      },
      identify: {
        title: 'Jak wyglądają',
        text: 'Do 4 cm długości, brązowoczarne z rdzawymi plamami i żółtym spodem, bardzo włochate. Poruszają się w pojedynczych procesjach kilkudziesięciu osobników. Pojedyncza włochata gąsienica raczej nią nie jest — żyją w grupach, w jedwabnych gniazdach na końcach gałęzi sosen.',
        caption: 'Gąsienice procesjonarki w procesji.',
      },
      dangerForDog: {
        title: 'Ryzyko dla Arakiego',
        text: 'Objawy pojawiają się w ciągu 2 godzin od kontaktu: nagłe obfite ślinienie, wymioty, drapanie pyska, bardzo bolesna opuchlizna języka i warg. Bez szybkiego leczenia język może sczernieć w ciągu 24–48 h z możliwą martwicą (może być konieczna częściowa amputacja). Wdychanie włosków może powodować trudności z oddychaniem i wstrząs.',
        symptomsCaption: 'Typowe objawy.',
        dogCaption: 'Chory pies — obfite ślinienie, opuchnięty język.',
      },
      dangerForHuman: {
        title: 'Ryzyko też dla was',
        intro: 'Zwierzęta są częściej narażone, ale włoski są również szkodliwe dla ludzi. Toksyna (histamina) łatwo przylepia się do skóry, błon śluzowych i ubrań. Powtarzające się kontakty mogą wywołać reakcje alergiczne, które za każdym razem się nasilają. Włoski pozostają parzące przez kilka miesięcy po odejściu gąsienic — opuszczone gniazda nadal są niebezpieczne.',
        skin: {
          title: 'Kontakt ze skórą',
          text: 'W ciągu 1–12 h: bolesna wysypka, silny świąd, możliwy obrzęk twarzy (usta, powieki). Włoski rozprzestrzeniają się przez pot, drapanie, pocieranie i ubrania. Objawy mogą trwać 10–18 dni.',
        },
        eyes: {
          title: 'Kontakt z oczami',
          text: 'W ciągu 1–4 h: zapalenie spojówek (czerwone, bolesne, łzawiące oczy), możliwe uszkodzenie rogówki (zapalenie rogówki). Objawy trwają 2–15 dni; jeśli włoski przejdą przez rogówkę, podrażnienie może utrzymywać się latami.',
        },
        breathing: {
          title: 'Wdychanie',
          text: 'Włoski drażnią drogi oddechowe: kichanie, ból gardła, trudności z przełykaniem, czasami trudności z oddychaniem (obrzęk gardła lub krtani).',
        },
        ingestion: {
          title: 'Połknięcie',
          text: 'Zapalenie błony śluzowej jamy ustnej i jelit: nadmierne ślinienie, wymioty, bóle brzucha.',
        },
        severe: {
          title: 'Ciężkie reakcje',
          text: 'W rzadkich przypadkach może wystąpić wstrząs anafilaktyczny — natychmiast zadzwońcie pod 15 lub 112, to zagrożenie życia. Jeśli macie autoiniektor adrenaliny (EpiPen) z powodu innej alergii, użyjcie go.',
        },
      },
      whatToDo: {
        title: 'Co robić — nagły wypadek',
        intro: 'Jeśli Araki miał kontakt z gąsienicą, liczy się każda minuta:',
        steps: [
          'Załóżcie rękawiczki, zanim dotkniecie jego pyska (włoski parzą też was).',
          'Przepłuczcie obficie pysk zimną wodą lub solą fizjologiczną przez 10–15 minut. Ostrożnie usuńcie włoski z oczu, nosa, pyska — nie pocierajcie.',
          'Natychmiast zadzwońcie do weterynarza — to prawdziwy nagły wypadek. Weterynarz może być zmuszony go hospitalizować.',
        ],
      },
      prevention: {
        title: 'Profilaktyka',
        text: 'Jeśli zobaczycie procesję na ziemi albo jedwabne gniazdo na sośnie powyżej, trzymajcie Arakiego na krótkiej smyczy i zmieńcie trasę spaceru. Pułapki założone wokół pni sosen (na zdjęciu) są oznaką, że procesjonarki są aktywne w okolicy.',
        caption: 'Pułapka na pniu sosny — znak aktywności w okolicy.',
      },
      contacts: {
        title: 'Numery alarmowe',
        text: 'Silna reakcja skórna u was: centrum kontroli zatruć lub lekarz. Trudności z oddychaniem (u was lub Arakiego): natychmiast zadzwońcie pod 15 lub 112.',
      },
    },
    around: {
      sectionLabel: 'Sekcja 03',
      title: 'Jak się poruszać',
      airport: {
        title: 'Z lotniska',
        emoji: '✈️',
        steps: [
          'Wyjdźcie z terminalu i wsiądźcie w darmowy tramwaj.',
          'Jeśli lądujecie na T2 — jedźcie 1 przystanek do T1 i idźcie piechotą na dworzec LUB 2 przystanki do "Railroad Station" i zawróćcie.',
          '(Upewnijcie się, że tramwaj jedzie przez "Railroad Station".)',
          'Nie traćcie czasu: kupcie bilet kolejowy jeszcze w tramwaju!',
        ],
      },
      trains: {
        title: 'Pociągi',
        emoji: '🚆',
        text: 'Bilety kupujcie przez SNCF Connect — zajmuje to chwilę, bo trzeba podać dużo danych. Pociągi jeżdżą często, a niektóre kursują nawet z Marsylii do Włoch, więc całe wybrzeże jest łatwo dostępne.',
        card: {
          eyebrow: 'Oszczędź na pociągach',
          title: 'Karta Zou Malin',
          price: '20 € / rok',
          text: '30% zniżki dla was i towarzysza — ważna przez rok. Przy rezerwacji wybierzcie, czy dany pasażer jest posiadaczem karty, czy „accompagnant". Opłaca się, jeśli planujecie jeździć pociągiem więcej niż parę razy.',
          cta: 'Kup kartę Zou Malin →',
          url: 'https://www.ter.sncf.com/sud-provence-alpes-cote-d-azur/tarifs-cartes/cartes-reduction/carte-zou-malin',
        },
      },
      buses: {
        title: 'Autobusy',
        emoji: '🚌',
        text: 'Autobusy mogą być tańsze i czasem obsługują dłuższe trasy, których nie ma pociąg. Jeżdżą rzadziej, ale warto sprawdzić.',
      },
      maps: {
        title: 'Google Maps',
        emoji: '📍',
        text: 'Google Maps działa tu świetnie do szukania transportu publicznego — wpisz cel i aplikacja pokaże pociągi, autobusy i opcje piesze.',
      },
    },
    explore: {
      sectionLabel: 'Sekcja 04',
      title: 'Zwiedzaj Antibes',
      all: 'Wszystko',
      categories: {
        coffee: 'Kawa',
        food: 'Jedzenie',
        walks: 'Spacery',
        museums: 'Muzea',
        'local-specialties': 'Lokalne Specjały',
      },
      openMaps: 'Otwórz w Maps →',
    },
    contact: {
      sectionLabel: 'Sekcja 05',
      title: 'Kontakt',
      subtitle: 'Macie pytanie? Zawsze jesteśmy na WhatsApp.',
      address: process.env.NEXT_PUBLIC_ADDRESS ?? '',
      leo: 'Napisz do Leo',
      martyna: 'Napisz do Martyny',
      group: 'Czat grupowy',
      groupNote: 'Poproście nas o link',
    },
    login: {
      title: 'Witaj',
      subtitle: 'Wpisz hasło, żeby zobaczyć przewodnik',
      placeholder: 'Hasło',
      button: 'Wejdź',
      error: 'Złe hasło. Spróbuj ponownie.',
    },
  },
} as const
