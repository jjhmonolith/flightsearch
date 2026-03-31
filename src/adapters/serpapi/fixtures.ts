/**
 * SerpApi Google Flights response fixture.
 * Based on: https://serpapi.com/google-flights-results
 */
export const serpApiSearchFixture = {
  search_metadata: {
    id: "test-search-id",
    status: "Success",
    json_endpoint: "https://serpapi.com/search.json?engine=google_flights",
    created_at: "2026-05-01 00:00:00 UTC",
    processed_at: "2026-05-01 00:00:01 UTC",
    google_flights_url: "https://www.google.com/travel/flights?q=...",
    total_time_taken: 2.5,
  },
  search_parameters: {
    engine: "google_flights",
    departure_id: "ICN",
    arrival_id: "NRT",
    outbound_date: "2026-05-01",
    return_date: "2026-05-08",
    currency: "KRW",
    type: "1",
  },
  best_flights: [
    {
      flights: [
        {
          departure_airport: {
            name: "Incheon International Airport",
            id: "ICN",
            time: "2026-05-01 09:00",
          },
          arrival_airport: {
            name: "Narita International Airport",
            id: "NRT",
            time: "2026-05-01 11:30",
          },
          duration: 150,
          airplane: "Boeing 777",
          airline: "Korean Air",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/KE.png",
          travel_class: "Economy",
          flight_number: "KE 701",
          extensions: ["Average legroom (31 in)"],
        },
      ],
      layovers: [],
      total_duration: 150,
      carbon_emissions: {
        this_flight: 150000,
        typical_for_this_route: 160000,
        difference_percent: -6,
      },
      price: 285000,
      type: "Round trip",
      booking_token: "serpapi-booking-token-1",
    },
    {
      flights: [
        {
          departure_airport: {
            name: "Incheon International Airport",
            id: "ICN",
            time: "2026-05-01 06:00",
          },
          arrival_airport: {
            name: "Fukuoka Airport",
            id: "FUK",
            time: "2026-05-01 07:30",
          },
          duration: 90,
          airplane: "Boeing 737",
          airline: "T'way Air",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/TW.png",
          travel_class: "Economy",
          flight_number: "TW 201",
          extensions: [],
        },
        {
          departure_airport: {
            name: "Fukuoka Airport",
            id: "FUK",
            time: "2026-05-01 09:00",
          },
          arrival_airport: {
            name: "Narita International Airport",
            id: "NRT",
            time: "2026-05-01 11:00",
          },
          duration: 120,
          airplane: "Boeing 787",
          airline: "All Nippon Airways",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/NH.png",
          travel_class: "Economy",
          flight_number: "NH 456",
          extensions: [],
        },
      ],
      layovers: [
        {
          duration: 90,
          name: "Fukuoka Airport",
          id: "FUK",
          overnight: false,
        },
      ],
      total_duration: 300,
      carbon_emissions: {
        this_flight: 180000,
        typical_for_this_route: 160000,
        difference_percent: 12,
      },
      price: 195000,
      type: "Round trip",
      booking_token: "serpapi-booking-token-2",
    },
  ],
  other_flights: [],
};

/**
 * Fixture for the return flights response.
 * SerpApi requires a separate call with departure_token to get return flights.
 * For simplicity, we embed return leg info in a combined fixture.
 */
export const serpApiReturnFixture = {
  best_flights: [
    {
      flights: [
        {
          departure_airport: {
            name: "Narita International Airport",
            id: "NRT",
            time: "2026-05-08 14:00",
          },
          arrival_airport: {
            name: "Incheon International Airport",
            id: "ICN",
            time: "2026-05-08 17:00",
          },
          duration: 180,
          airplane: "Boeing 777",
          airline: "Korean Air",
          airline_logo: "https://www.gstatic.com/flights/airline_logos/70px/KE.png",
          travel_class: "Economy",
          flight_number: "KE 702",
          extensions: [],
        },
      ],
      layovers: [],
      total_duration: 180,
      price: 285000,
      type: "Round trip",
      booking_token: "serpapi-return-token-1",
    },
  ],
  other_flights: [],
};
