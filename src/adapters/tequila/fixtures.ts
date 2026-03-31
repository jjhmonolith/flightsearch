/**
 * Tequila API response fixture for testing.
 * Based on the Tequila/Kiwi.com Search API v2 response format.
 */
export const tequilaSearchFixture = {
  search_id: "test-search-id",
  currency: "KRW",
  data: [
    {
      id: "tequila-flight-1",
      price: 285000,
      deep_link: "https://www.kiwi.com/deep?from=ICN&to=NRT&flightsId=test1",
      route: [
        {
          flyFrom: "ICN",
          flyTo: "NRT",
          cityFrom: "Seoul",
          cityTo: "Tokyo",
          local_departure: "2026-05-01T09:00:00.000Z",
          local_arrival: "2026-05-01T11:30:00.000Z",
          airline: "KE",
          flight_no: 701,
          return: 0,
        },
        {
          flyFrom: "NRT",
          flyTo: "ICN",
          cityFrom: "Tokyo",
          cityTo: "Seoul",
          local_departure: "2026-05-08T14:00:00.000Z",
          local_arrival: "2026-05-08T17:00:00.000Z",
          airline: "KE",
          flight_no: 702,
          return: 1,
        },
      ],
      duration: {
        departure: 9000,
        return: 10800,
      },
      booking_token: "test-booking-token-1",
    },
    {
      id: "tequila-flight-2",
      price: 195000,
      deep_link: "https://www.kiwi.com/deep?from=ICN&to=NRT&flightsId=test2",
      route: [
        {
          flyFrom: "ICN",
          flyTo: "FUK",
          cityFrom: "Seoul",
          cityTo: "Fukuoka",
          local_departure: "2026-05-01T06:00:00.000Z",
          local_arrival: "2026-05-01T07:30:00.000Z",
          airline: "TW",
          flight_no: 201,
          return: 0,
        },
        {
          flyFrom: "FUK",
          flyTo: "NRT",
          cityFrom: "Fukuoka",
          cityTo: "Tokyo",
          local_departure: "2026-05-01T09:00:00.000Z",
          local_arrival: "2026-05-01T11:00:00.000Z",
          airline: "NH",
          flight_no: 456,
          return: 0,
        },
        {
          flyFrom: "NRT",
          flyTo: "ICN",
          cityFrom: "Tokyo",
          cityTo: "Seoul",
          local_departure: "2026-05-08T18:00:00.000Z",
          local_arrival: "2026-05-08T21:00:00.000Z",
          airline: "7C",
          flight_no: 1102,
          return: 1,
        },
      ],
      duration: {
        departure: 18000,
        return: 10800,
      },
      booking_token: "test-booking-token-2",
    },
  ],
};
