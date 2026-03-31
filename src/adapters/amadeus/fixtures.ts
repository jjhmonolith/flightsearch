/**
 * Amadeus Flight Offers Search API v2 response fixture.
 * Based on: GET /v2/shopping/flight-offers
 */
export const amadeusSearchFixture = {
  meta: { count: 2 },
  data: [
    {
      type: "flight-offer",
      id: "1",
      source: "GDS",
      itineraries: [
        {
          duration: "PT2H30M",
          segments: [
            {
              departure: {
                iataCode: "ICN",
                at: "2026-05-01T09:00:00",
              },
              arrival: {
                iataCode: "NRT",
                at: "2026-05-01T11:30:00",
              },
              carrierCode: "KE",
              number: "701",
              duration: "PT2H30M",
            },
          ],
        },
        {
          duration: "PT2H30M",
          segments: [
            {
              departure: {
                iataCode: "NRT",
                at: "2026-05-08T14:00:00",
              },
              arrival: {
                iataCode: "ICN",
                at: "2026-05-08T16:30:00",
              },
              carrierCode: "KE",
              number: "702",
              duration: "PT2H30M",
            },
          ],
        },
      ],
      price: {
        currency: "KRW",
        total: "285000.00",
        grandTotal: "285000.00",
      },
    },
    {
      type: "flight-offer",
      id: "2",
      source: "GDS",
      itineraries: [
        {
          duration: "PT5H",
          segments: [
            {
              departure: {
                iataCode: "ICN",
                at: "2026-05-01T06:00:00",
              },
              arrival: {
                iataCode: "FUK",
                at: "2026-05-01T07:30:00",
              },
              carrierCode: "TW",
              number: "201",
              duration: "PT1H30M",
            },
            {
              departure: {
                iataCode: "FUK",
                at: "2026-05-01T09:00:00",
              },
              arrival: {
                iataCode: "NRT",
                at: "2026-05-01T11:00:00",
              },
              carrierCode: "NH",
              number: "456",
              duration: "PT2H",
            },
          ],
        },
        {
          duration: "PT3H",
          segments: [
            {
              departure: {
                iataCode: "NRT",
                at: "2026-05-08T18:00:00",
              },
              arrival: {
                iataCode: "ICN",
                at: "2026-05-08T21:00:00",
              },
              carrierCode: "7C",
              number: "1102",
              duration: "PT3H",
            },
          ],
        },
      ],
      price: {
        currency: "KRW",
        total: "195000.00",
        grandTotal: "195000.00",
      },
    },
  ],
  dictionaries: {
    carriers: {
      KE: "KOREAN AIR",
      TW: "T'WAY AIR",
      NH: "ALL NIPPON AIRWAYS",
      "7C": "JEJU AIR",
    },
  },
};

export const amadeusTokenFixture = {
  type: "amadeusOAuth2Token",
  username: "test@example.com",
  application_name: "test-app",
  client_id: "test-client-id",
  token_type: "Bearer",
  access_token: "test-access-token-12345",
  expires_in: 1799,
  state: "approved",
  scope: "",
};
