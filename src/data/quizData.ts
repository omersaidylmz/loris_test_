export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  image: string;
  profile: string[];
  imagePosition?: string;
}

export interface QuizStep {
  id: string;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

const image = {
  maskulen: "/images/cinsiyet/erkek.png",
  feminen: "/images/cinsiyet/kadın.png",
  texture: "/images/kumaş/ipek.png",
  linen: "/images/kumaş/keten.png",
  velvet: "/images/kumaş/kadife.png",
  leather: "/images/kumaş/deri.png",
  sea: "/images/oda_pencere/deniz1.png",
  forest: "/images/oda_pencere/orman.png",
  mountain: "/images/oda_pencere/portakal.png",
  desert: "/images/oda_pencere/baharat.png",
  rain: "https://images.pexels.com/photos/3728298/pexels-photo-3728298.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  waves: "https://images.pexels.com/photos/31093409/pexels-photo-31093409.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  fire: "https://images.pexels.com/photos/13588459/pexels-photo-13588459.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  cello: "https://images.pexels.com/photos/7095504/pexels-photo-7095504.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  morning: "https://images.pexels.com/photos/18228697/pexels-photo-18228697.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  sunset: "https://images.pexels.com/photos/29150580/pexels-photo-29150580.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  candle: "https://images.pexels.com/photos/161073/flame-church-wax-light-161073.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  moon: "https://images.pexels.com/photos/10884817/pexels-photo-10884817.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  geometric: "https://images.pexels.com/photos/30892556/pexels-photo-30892556.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  organic: "https://images.pexels.com/photos/943907/pexels-photo-943907.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  round: "https://images.pexels.com/photos/48600/pexels-photo-48600.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  layered: "https://images.pexels.com/photos/35652150/pexels-photo-35652150.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  ripple: "https://images.pexels.com/photos/36744232/pexels-photo-36744232.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  fabric: "https://images.pexels.com/photos/28601583/pexels-photo-28601583.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  smoke: "https://images.pexels.com/photos/9694698/pexels-photo-9694698.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  sparks: "https://images.pexels.com/photos/8813905/pexels-photo-8813905.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  citrus: "https://images.pexels.com/photos/1987010/pexels-photo-1987010.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  tea: "https://images.pexels.com/photos/11669662/pexels-photo-11669662.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  sweet: "https://images.pexels.com/photos/8793915/pexels-photo-8793915.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  coffee: "https://images.pexels.com/photos/9014065/pexels-photo-9014065.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  beach: "https://images.pexels.com/photos/14615236/pexels-photo-14615236.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  courtyard: "https://images.pexels.com/photos/32324084/pexels-photo-32324084.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  darkForest: "https://images.pexels.com/photos/7130754/pexels-photo-7130754.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  lounge: "https://images.pexels.com/photos/29530551/pexels-photo-29530551.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
};

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: "identity",
    title: "Size en yakın koku kimliği hangisi?",
    subtitle: "Maskülen veya feminen yönelimi seçin.",
    options: [
      { id: "maskulen", label: "Maskülen", image: image.maskulen, profile: ["Odunsu", "Topraksı & Dumanlı", "Sıcak & Yoğun"] },
      { id: "feminen", label: "Feminen", image: image.feminen, profile: ["Çiçeksi", "Meyvemsi & Tatlı", "Gourmand & Tatlı"] },
    ],
  },
  {
    id: "q1",
    title: "Elinize hangi doku daha yakın geliyor?",
    subtitle: "Sezgisel olarak size en yakın olanı seçin.",
    options: [
      { id: "ipek", label: "İpek", description: "Pürüzsüz ve zarif", image: image.texture, profile: ["Çiçeksi", "Meyvemsi & Tatlı"] },
      { id: "keten", label: "Keten", description: "Doğal ve hafif", image: image.linen, profile: ["Aromatik & Yeşil", "Akuatik & Ferah"] },
      { id: "kadife", label: "Kadife", description: "Zengin ve lüks", image: image.velvet, profile: ["Gourmand & Tatlı", "Amber & Reçineli"] },
      { id: "deri", label: "Deri", description: "Koyu ve yoğun", image: image.leather, profile: ["Topraksı & Dumanlı", "Odunsu"] },
    ],
  },
  {
    id: "q2",
    title: "Şu an hangi atmosferin içinde olmak isterdiniz?",
    subtitle: "Size en iyi hissettiren ortamı seçin.",
    options: [
      { id: "deniz", label: "Deniz Kenarı", image: image.sea, profile: ["Akuatik & Ferah", "Narenciye"] },
      { id: "orman", label: "Yağmur Sonrası Orman", image: image.forest, profile: ["Aromatik & Yeşil", "Topraksı & Dumanlı"] },
      { id: "portakal", label: "Portakal Bahçesi", image: image.mountain, profile: ["Narenciye", "Aromatik & Yeşil"] },
      { id: "col", label: "Sıcak Çöl Gün Batımı", image: image.desert, profile: ["Amber & Reçineli", "Baharatlı"] },
    ],
  },
  {
    id: "q3",
    title: "Size hangi ses dünyası daha yakın geliyor?",
    subtitle: "Sezgisel olarak size en yakın sesi seçin.",
    options: [
      { id: "yagmur", label: "Hafif Yağmur", image: image.rain, profile: ["Akuatik & Ferah", "Aromatik & Yeşil"] },
      { id: "dalgalar", label: "Deniz Dalgaları", image: image.waves, profile: ["Akuatik & Ferah", "Topraksı & Dumanlı"] },
      { id: "samine", label: "Şömine Çıtırtısı", image: image.fire, profile: ["Gourmand & Tatlı", "Topraksı & Dumanlı"] },
      { id: "yayli", label: "Derin Yaylı Müzik", image: image.cello, profile: ["Odunsu", "Amber & Reçineli"] },
    ],
  },
  {
    id: "q4",
    title: "Bulunduğunuz mekânın hangi ışıkla dolmasını isterdiniz?",
    subtitle: "Sizi en çok çeken ışık atmosferini seçin.",
    options: [
      { id: "sabah", label: "Sabah Işığı", image: image.morning, profile: ["Narenciye", "Aromatik & Yeşil"] },
      { id: "gunbatimi", label: "Gün Batımı", image: image.sunset, profile: ["Amber & Reçineli", "Gourmand & Tatlı"] },
      { id: "mum", label: "Mum Işığı", image: image.candle, profile: ["Çiçeksi", "Gourmand & Tatlı"] },
      { id: "ay", label: "Ay Işığı", image: image.moon, profile: ["Misk", "Odunsu"] },
    ],
  },
  {
    id: "q5",
    title: "Hangi form size daha yakın geliyor?",
    subtitle: "Sezgisel olarak size en çekici gelen biçimi seçin.",
    options: [
      { id: "geometrik", label: "İnce ve Geometrik", image: image.geometric, profile: ["Aromatik & Yeşil", "Baharatlı"] },
      { id: "organik", label: "Organik ve Doğal", image: image.organic, profile: ["Çiçeksi", "Aromatik & Yeşil"] },
      { id: "akiskan", label: "Yuvarlak ve Akışkan", image: image.round, profile: ["Misk", "Amber & Reçineli"] },
      { id: "katmanli", label: "Keskin ve Katmanlı", image: image.layered, profile: ["Odunsu", "Topraksı & Dumanlı"] },
    ],
  },
  {
    id: "q6",
    title: "Hangi hareket size daha yakın geliyor?",
    subtitle: "İzlemekten en çok keyif alacağınız hareketi seçin.",
    options: [
      { id: "dalga", label: "Suda Yayılan Dalga", image: image.ripple, profile: ["Akuatik & Ferah", "Misk"] },
      { id: "kumas", label: "Rüzgârda Uçan Kumaş", image: image.fabric, profile: ["Çiçeksi", "Akuatik & Ferah"] },
      { id: "duman", label: "Yavaş Yükselen Duman", image: image.smoke, profile: ["Topraksı & Dumanlı", "Odunsu"] },
      { id: "kivilcim", label: "Parlayan Kıvılcımlar", image: image.sparks, profile: ["Baharatlı", "Gourmand & Tatlı"] },
    ],
  },
  {
    id: "q7",
    title: "Hangi tat hissi size daha yakın geliyor?",
    subtitle: "Damak tadınıza en yakın karakteri seçin.",
    options: [
      { id: "eksimsi", label: "Canlı ve Ekşimsi", image: image.citrus, profile: ["Narenciye", "Aromatik & Yeşil"] },
      { id: "buruk", label: "Yeşil ve Buruk", image: image.tea, profile: ["Aromatik & Yeşil", "Baharatlı"] },
      { id: "yumustatli", label: "Yumuşak ve Tatlı", image: image.sweet, profile: ["Gourmand & Tatlı", "Meyvemsi & Tatlı"] },
      { id: "acibaharat", label: "Koyu ve Acı-Baharatlı", image: image.coffee, profile: ["Topraksı & Dumanlı", "Baharatlı"] },
    ],
  },
  {
    id: "q8",
    title: "Bugün sizi hangi dünya anlatıyor?",
    subtitle: "Kendinizi en çok içinde hissettiğiniz dünyayı seçin.",
    options: [
      { id: "aydinliksahil", label: "Aydınlık Sahil", image: image.beach, profile: ["Akuatik & Ferah", "Narenciye"] },
      { id: "avlu", label: "Çiçekli Sakin Avlu", image: image.courtyard, profile: ["Çiçeksi", "Aromatik & Yeşil"] },
      { id: "koyuorman", label: "Yağmur Sonrası Koyu Orman", image: image.darkForest, profile: ["Odunsu", "Topraksı & Dumanlı"] },
      { id: "gecesalonu", label: "Loş ve Sıcak Gece Salonu", image: image.lounge, profile: ["Gourmand & Tatlı", "Amber & Reçineli"] },
    ],
  },
];
