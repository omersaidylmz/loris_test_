export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  image: string;
  profile: string[];
  weight?: number;
}

export interface QuizStep {
  id: string;
  title: string;
  subtitle: string;
  options: QuizOption[];
  multi?: boolean;
  min?: number;
  max?: number;
}

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: "cinsiyet",
    title: "Sana en yakın tarzı seç",
    subtitle: "Parfüm önerilerini kişiselleştirmek için bir tarz seç.",
    options: [
      { id: "erkek", label: "Erkek", image: "https://images.pexels.com/photos/12848293/pexels-photo-12848293.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Maskulin"] },
      { id: "kadin", label: "Kadın", image: "https://images.pexels.com/photos/27952727/pexels-photo-27952727.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Feminin"] },
      { id: "unisex", label: "Unisex", image: "https://images.pexels.com/photos/28924247/pexels-photo-28924247.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Unisex"] },
    ],
  },
  {
    id: "tekstil",
    title: "Teninde hangi tekstil hoşuna gider?",
    subtitle: "Cildine en çok hitap eden dokuyu seç.",
    options: [
      { id: "saten", label: "Saten", description: "Pürüzsüz ve parlak", image: "https://images.pexels.com/photos/31650443/pexels-photo-31650443.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Çiçeksi","Meyvemsi & Tatlı"] },
      { id: "keten", label: "Keten", description: "Doğal ve hafif", image: "https://images.pexels.com/photos/7794365/pexels-photo-7794365.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Aromatik & Yeşil","Akuatik & Ferah"] },
      { id: "kadife", label: "Kadife", description: "Zengin ve lüks", image: "https://images.pexels.com/photos/7717505/pexels-photo-7717505.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Gourmand & Tatlı","Amber & Reçineli"] },
      { id: "deri", label: "Deri", description: "Koyu ve yoğun", image: "https://images.pexels.com/photos/30989203/pexels-photo-30989203.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Topraksı & Dumanlı","Odunsu"] },
    ],
  },
  {
    id: "mekan",
    title: "Hangi mekânda kendini en iyi hissedersin?",
    subtitle: "Hayalindeki ortamı seç.",
    options: [
      { id: "deniz", label: "Deniz kenarı", description: "Tuzlu ve ferah", image: "https://images.pexels.com/photos/585024/pexels-photo-585024.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Akuatik & Ferah","Narenciye"] },
      { id: "orman", label: "Yağmur sonrası orman", description: "Yaş ve yeşil", image: "https://images.pexels.com/photos/17562473/pexels-photo-17562473.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Aromatik & Yeşil","Topraksı & Dumanlı"] },
      { id: "dag", label: "Dağ zirvesi", description: "Temiz ve keskin", image: "https://images.pexels.com/photos/17476985/pexels-photo-17476985.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Akuatik & Ferah","Aromatik & Yeşil"] },
      { id: "col", label: "Çöl gurubu", description: "Sıcak ve amber", image: "https://images.pexels.com/photos/33442715/pexels-photo-33442715.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Amber & Reçineli","Baharatlı"] },
    ],
  },
  {
    id: "hava",
    title: "Hangi hava durumu seni cezbeder?",
    subtitle: "Bir atmosfer seç.",
    options: [
      { id: "yagmur", label: "Hafif yağmur", description: "Serin ve ıslak", image: "https://images.pexels.com/photos/3728298/pexels-photo-3728298.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Akuatik & Ferah","Aromatik & Yeşil"] },
      { id: "firtina", label: "Deniz dalgaları", description: "Güçlü ve derin", image: "https://images.pexels.com/photos/31093409/pexels-photo-31093409.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Akuatik & Ferah","Topraksı & Dumanlı"] },
      { id: "ates", label: "Çıtırdayan şömine", description: "Sıcak ve dumanlı", image: "https://images.pexels.com/photos/13588459/pexels-photo-13588459.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Gourmand & Tatlı","Topraksı & Dumanlı"] },
      { id: "cello", label: "Karanlık ve çello", description: "Derin ve gizemli", image: "https://images.pexels.com/photos/7095504/pexels-photo-7095504.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Odunsu","Amber & Reçineli"] },
    ],
  },
  {
    id: "isik",
    title: "Hangi ışık seni cezbeder?",
    subtitle: "Bir ışık atmosferi seç.",
    options: [
      { id: "sabah", label: "Sabah güneşi", description: "Aydınlık ve taze", image: "https://images.pexels.com/photos/18228697/pexels-photo-18228697.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Narenciye","Aromatik & Yeşil"] },
      { id: "gurub", label: "Gurup güneşi", description: "Sıcak ve altın", image: "https://images.pexels.com/photos/29150580/pexels-photo-29150580.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Amber & Reçineli","Gourmand & Tatlı"] },
      { id: "mum", label: "Mum ışığı", description: "Yumuşak ve romantik", image: "https://images.pexels.com/photos/161073/flame-church-wax-light-161073.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Çiçeksi","Gourmand & Tatlı"] },
      { id: "ay", label: "Ay ışığı", description: "Gizemli ve serin", image: "https://images.pexels.com/photos/10884817/pexels-photo-10884817.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Misk","Odunsu"] },
    ],
  },
  {
    id: "form",
    title: "Hangi form seni cezbeder?",
    subtitle: "Bir geometrik biçim seç.",
    options: [
      { id: "kati", label: "Keskin ve geometrik", description: "Modern ve net", image: "https://images.pexels.com/photos/30892556/pexels-photo-30892556.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Aromatik & Yeşil","Baharatlı"] },
      { id: "organik", label: "Organik ve doğal", description: "Yumuşak ve akışkan", image: "https://images.pexels.com/photos/943907/pexels-photo-943907.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Çiçeksi","Aromatik & Yeşil"] },
      { id: "yuvarlak", label: "Yuvarlak ve pürüzsüz", description: "Dengeli ve sakin", image: "https://images.pexels.com/photos/48600/pexels-photo-48600.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Misk","Amber & Reçineli"] },
      { id: "tabakali", label: "Tabakalı ve derin", description: "Karmaşık ve zengin", image: "https://images.pexels.com/photos/35652150/pexels-photo-35652150.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Odunsu","Topraksı & Dumanlı"] },
    ],
  },
  {
    id: "devinim",
    title: "Hangi devinim seni cezbeder?",
    subtitle: "Bir hareket türü seç.",
    options: [
      { id: "su", label: "Suda yayılan dalgalar", description: "Sakin ve ritmik", image: "https://images.pexels.com/photos/36744232/pexels-photo-36744232.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Akuatik & Ferah","Misk"] },
      { id: "ruzgar", label: "Rüzgârda uçuşan kumaş", description: "Hafif ve akıcı", image: "https://images.pexels.com/photos/28601583/pexels-photo-28601583.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Çiçeksi","Akuatik & Ferah"] },
      { id: "duman", label: "Yükselen duman", description: "Gizemli ve yoğun", image: "https://images.pexels.com/photos/9694698/pexels-photo-9694698.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Topraksı & Dumanlı","Odunsu"] },
      { id: "kor", label: "Kıvılcımlar", description: "Enerjik ve sıcak", image: "https://images.pexels.com/photos/8813905/pexels-photo-8813905.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Baharatlı","Gourmand & Tatlı"] },
    ],
  },
  {
    id: "tat",
    title: "Hangi tat seni cezbeder?",
    subtitle: "Bir lezzet profili seç.",
    options: [
      { id: "eksi", label: "Eksi & Narenciye", description: "Ferah ve canlı", image: "https://images.pexels.com/photos/1987010/pexels-photo-1987010.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Narenciye","Aromatik & Yeşil"] },
      { id: "aci", label: "Acı & Yeşil", description: "Keskin ve bitkisel", image: "https://images.pexels.com/photos/11669662/pexels-photo-11669662.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Aromatik & Yeşil","Baharatlı"] },
      { id: "tatli", label: "Tatlı & Karamel", description: "Sıcak ve şekerli", image: "https://images.pexels.com/photos/8793915/pexels-photo-8793915.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Gourmand & Tatlı","Amber & Reçineli"] },
      { id: "kahve", label: "Kahve & Acı baharat", description: "Koyu ve yoğun", image: "https://images.pexels.com/photos/9014065/pexels-photo-9014065.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Gourmand & Tatlı","Topraksı & Dumanlı"] },
    ],
  },
  {
    id: "yasam",
    title: "Hangi yaşam alanı sana yakın?",
    subtitle: "Hayalindeki yaşam tarzını seç.",
    options: [
      { id: "sahil", label: "Sahil kasabası", description: "Açık ve ferah", image: "https://images.pexels.com/photos/14615236/pexels-photo-14615236.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Akuatik & Ferah","Narenciye"] },
      { id: "avlü", label: "Çiçekli avlü", description: "Huzurlu ve doğal", image: "https://images.pexels.com/photos/32324084/pexels-photo-32324084.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Çiçeksi","Aromatik & Yeşil"] },
      { id: "koyu", label: "Koyu orman", description: "Gizemli ve derin", image: "https://images.pexels.com/photos/7130754/pexels-photo-7130754.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Odunsu","Topraksı & Dumanlı"] },
      { id: "salon", label: "Sıcak bir salon", description: "Kapalı ve şık", image: "https://images.pexels.com/photos/29530551/pexels-photo-29530551.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Gourmand & Tatlı","Amber & Reçineli"] },
    ],
  },
  {
    id: "koku",
    title: "Hangi koku seni cezbeder?",
    subtitle: "Bir koku atmosferi seç.",
    options: [
      { id: "narenciye", label: "Narenciye bahçesi", description: "Taze ve canlı", image: "https://images.pexels.com/photos/4038717/pexels-photo-4038717.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Narenciye","Aromatik & Yeşil"] },
      { id: "cicek", label: "Çiçek tarlası", description: "Yumuşak ve romantik", image: "https://images.pexels.com/photos/175249/pexels-photo-175249.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Çiçeksi","Meyvemsi & Tatlı"] },
      { id: "odunsu", label: "Odunsu orman", description: "Sıcak ve derin", image: "https://images.pexels.com/photos/6661717/pexels-photo-6661717.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Odunsu","Topraksı & Dumanlı"] },
      { id: "parfum", label: "Lüks parfüm", description: "Karmaşık ve şık", image: "https://images.pexels.com/photos/16239693/pexels-photo-16239693.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", profile: ["Amber & Reçineli","Gourmand & Tatlı"] },
    ],
  },
];
