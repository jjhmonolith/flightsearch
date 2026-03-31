export interface Airport {
  readonly code: string;
  readonly name: string;
  readonly city: string;
  readonly country: string;
}

/**
 * Major international airports commonly searched for flights from Korea.
 */
export const AIRPORTS: readonly Airport[] = [
  // Korea
  { code: "ICN", name: "인천국제공항", city: "서울/인천", country: "한국" },
  { code: "GMP", name: "김포국제공항", city: "서울", country: "한국" },
  { code: "PUS", name: "김해국제공항", city: "부산", country: "한국" },
  { code: "CJU", name: "제주국제공항", city: "제주", country: "한국" },
  { code: "TAE", name: "대구국제공항", city: "대구", country: "한국" },
  { code: "CJJ", name: "청주국제공항", city: "청주", country: "한국" },
  { code: "MWX", name: "무안국제공항", city: "무안", country: "한국" },
  // Japan
  { code: "NRT", name: "Narita International", city: "Tokyo", country: "일본" },
  { code: "HND", name: "Haneda Airport", city: "Tokyo", country: "일본" },
  { code: "KIX", name: "Kansai International", city: "Osaka", country: "일본" },
  { code: "ITM", name: "Osaka Itami", city: "Osaka", country: "일본" },
  { code: "FUK", name: "Fukuoka Airport", city: "Fukuoka", country: "일본" },
  { code: "CTS", name: "New Chitose Airport", city: "Sapporo", country: "일본" },
  { code: "NGO", name: "Chubu Centrair", city: "Nagoya", country: "일본" },
  { code: "OKA", name: "Naha Airport", city: "Okinawa", country: "일본" },
  // China
  { code: "PVG", name: "Pudong International", city: "Shanghai", country: "중국" },
  { code: "SHA", name: "Hongqiao Airport", city: "Shanghai", country: "중국" },
  { code: "PEK", name: "Beijing Capital", city: "Beijing", country: "중국" },
  { code: "PKX", name: "Beijing Daxing", city: "Beijing", country: "중국" },
  { code: "CAN", name: "Guangzhou Baiyun", city: "Guangzhou", country: "중국" },
  { code: "SZX", name: "Shenzhen Baoan", city: "Shenzhen", country: "중국" },
  { code: "CTU", name: "Chengdu Tianfu", city: "Chengdu", country: "중국" },
  { code: "HKG", name: "Hong Kong International", city: "Hong Kong", country: "홍콩" },
  // Taiwan
  { code: "TPE", name: "Taiwan Taoyuan", city: "Taipei", country: "대만" },
  { code: "KHH", name: "Kaohsiung Airport", city: "Kaohsiung", country: "대만" },
  // Southeast Asia
  { code: "BKK", name: "Suvarnabhumi Airport", city: "Bangkok", country: "태국" },
  { code: "DMK", name: "Don Mueang Airport", city: "Bangkok", country: "태국" },
  { code: "CNX", name: "Chiang Mai Airport", city: "Chiang Mai", country: "태국" },
  { code: "SGN", name: "Tan Son Nhat", city: "Ho Chi Minh", country: "베트남" },
  { code: "HAN", name: "Noi Bai Airport", city: "Hanoi", country: "베트남" },
  { code: "DAD", name: "Da Nang Airport", city: "Da Nang", country: "베트남" },
  { code: "SIN", name: "Changi Airport", city: "Singapore", country: "싱가포르" },
  { code: "MNL", name: "Ninoy Aquino", city: "Manila", country: "필리핀" },
  { code: "CEB", name: "Mactan-Cebu", city: "Cebu", country: "필리핀" },
  { code: "KUL", name: "Kuala Lumpur International", city: "Kuala Lumpur", country: "말레이시아" },
  { code: "DPS", name: "Ngurah Rai Airport", city: "Bali", country: "인도네시아" },
  { code: "CGK", name: "Soekarno-Hatta", city: "Jakarta", country: "인도네시아" },
  { code: "REP", name: "Siem Reap Airport", city: "Siem Reap", country: "캄보디아" },
  { code: "PNH", name: "Phnom Penh Airport", city: "Phnom Penh", country: "캄보디아" },
  // Mongolia
  { code: "UBN", name: "Chinggis Khaan", city: "Ulaanbaatar", country: "몽골" },
  // South Asia
  { code: "DEL", name: "Indira Gandhi", city: "Delhi", country: "인도" },
  { code: "BOM", name: "Chhatrapati Shivaji", city: "Mumbai", country: "인도" },
  // Central Asia
  { code: "TAS", name: "Tashkent Airport", city: "Tashkent", country: "우즈베키스탄" },
  { code: "ALA", name: "Almaty Airport", city: "Almaty", country: "카자흐스탄" },
  // Middle East
  { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE" },
  { code: "DOH", name: "Hamad International", city: "Doha", country: "카타르" },
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "튀르키예" },
  // Oceania
  { code: "SYD", name: "Sydney Airport", city: "Sydney", country: "호주" },
  { code: "MEL", name: "Melbourne Airport", city: "Melbourne", country: "호주" },
  { code: "AKL", name: "Auckland Airport", city: "Auckland", country: "뉴질랜드" },
  { code: "GUM", name: "A.B. Won Pat Airport", city: "Guam", country: "괌" },
  // Europe
  { code: "LHR", name: "Heathrow Airport", city: "London", country: "영국" },
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", country: "프랑스" },
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "독일" },
  { code: "MUC", name: "Munich Airport", city: "Munich", country: "독일" },
  { code: "FCO", name: "Fiumicino Airport", city: "Rome", country: "이탈리아" },
  { code: "MXP", name: "Malpensa Airport", city: "Milan", country: "이탈리아" },
  { code: "MAD", name: "Adolfo Suárez", city: "Madrid", country: "스페인" },
  { code: "BCN", name: "El Prat Airport", city: "Barcelona", country: "스페인" },
  { code: "AMS", name: "Schiphol Airport", city: "Amsterdam", country: "네덜란드" },
  { code: "ZRH", name: "Zurich Airport", city: "Zurich", country: "스위스" },
  { code: "VIE", name: "Vienna Airport", city: "Vienna", country: "오스트리아" },
  { code: "PRG", name: "Václav Havel Airport", city: "Prague", country: "체코" },
  { code: "BUD", name: "Budapest Airport", city: "Budapest", country: "헝가리" },
  { code: "WAW", name: "Chopin Airport", city: "Warsaw", country: "폴란드" },
  { code: "HEL", name: "Helsinki Airport", city: "Helsinki", country: "핀란드" },
  { code: "CPH", name: "Copenhagen Airport", city: "Copenhagen", country: "덴마크" },
  { code: "ARN", name: "Arlanda Airport", city: "Stockholm", country: "스웨덴" },
  { code: "ATH", name: "Athens Airport", city: "Athens", country: "그리스" },
  // North America
  { code: "JFK", name: "John F. Kennedy", city: "New York", country: "미국" },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "미국" },
  { code: "SFO", name: "San Francisco International", city: "San Francisco", country: "미국" },
  { code: "ORD", name: "O'Hare International", city: "Chicago", country: "미국" },
  { code: "ATL", name: "Hartsfield-Jackson", city: "Atlanta", country: "미국" },
  { code: "SEA", name: "Seattle-Tacoma", city: "Seattle", country: "미국" },
  { code: "HNL", name: "Daniel K. Inouye", city: "Honolulu", country: "미국" },
  { code: "DFW", name: "Dallas/Fort Worth", city: "Dallas", country: "미국" },
  { code: "IAD", name: "Dulles International", city: "Washington DC", country: "미국" },
  { code: "YVR", name: "Vancouver International", city: "Vancouver", country: "캐나다" },
  { code: "YYZ", name: "Toronto Pearson", city: "Toronto", country: "캐나다" },
  // South America / Africa
  { code: "GRU", name: "Guarulhos Airport", city: "São Paulo", country: "브라질" },
  { code: "MEX", name: "Benito Juárez", city: "Mexico City", country: "멕시코" },
  { code: "CUN", name: "Cancún International", city: "Cancún", country: "멕시코" },
  { code: "NBO", name: "Jomo Kenyatta", city: "Nairobi", country: "케냐" },
  { code: "CPT", name: "Cape Town International", city: "Cape Town", country: "남아프리카" },
  { code: "CAI", name: "Cairo International", city: "Cairo", country: "이집트" },
  // Russia
  { code: "VVO", name: "Vladivostok Airport", city: "Vladivostok", country: "러시아" },
  { code: "SVO", name: "Sheremetyevo", city: "Moscow", country: "러시아" },
];

/**
 * Search airports by code, name, city, or country.
 */
export function searchAirports(
  query: string,
  limit = 10
): readonly Airport[] {
  const q = query.toLowerCase().trim();
  if (q.length === 0) return [];

  // Exact code match gets highest priority
  const exactCode = AIRPORTS.filter(
    (a) => a.code.toLowerCase() === q
  );

  // Then prefix matches on code
  const codePrefix = AIRPORTS.filter(
    (a) =>
      a.code.toLowerCase().startsWith(q) &&
      a.code.toLowerCase() !== q
  );

  // Then matches in name, city, country
  const textMatches = AIRPORTS.filter(
    (a) =>
      !a.code.toLowerCase().startsWith(q) &&
      (a.name.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q))
  );

  return [...exactCode, ...codePrefix, ...textMatches].slice(0, limit);
}
