/**
 * Duffel API Offer Request response fixture.
 * Based on: https://duffel.com/docs/api/offer-requests/create-offer-request
 */
export const duffelSearchFixture = {
  data: {
    id: "orq_test_123",
    live_mode: false,
    created_at: "2026-05-01T00:00:00.000000Z",
    cabin_class: "economy",
    slices: [
      {
        origin: { iata_code: "ICN", name: "Incheon International Airport" },
        destination: { iata_code: "NRT", name: "Narita International Airport" },
        departure_date: "2026-05-01",
      },
      {
        origin: { iata_code: "NRT", name: "Narita International Airport" },
        destination: { iata_code: "ICN", name: "Incheon International Airport" },
        departure_date: "2026-05-08",
      },
    ],
    offers: [
      {
        id: "off_test_direct",
        live_mode: false,
        total_amount: "285000.00",
        total_currency: "KRW",
        base_amount: "260000.00",
        base_currency: "KRW",
        tax_amount: "25000.00",
        tax_currency: "KRW",
        expires_at: "2026-05-01T01:00:00.000000Z",
        owner: {
          name: "Korean Air",
          iata_code: "KE",
          logo_symbol_url: "https://assets.duffel.com/img/airlines/KE.svg",
        },
        slices: [
          {
            id: "sli_out_1",
            duration: "PT2H30M",
            origin: { iata_code: "ICN", name: "Incheon International Airport" },
            destination: { iata_code: "NRT", name: "Narita International Airport" },
            segments: [
              {
                id: "seg_out_1",
                departing_at: "2026-05-01T09:00:00",
                arriving_at: "2026-05-01T11:30:00",
                operating_carrier: {
                  name: "Korean Air",
                  iata_code: "KE",
                },
                operating_carrier_flight_number: "701",
                marketing_carrier: {
                  name: "Korean Air",
                  iata_code: "KE",
                },
                marketing_carrier_flight_number: "701",
                duration: "PT2H30M",
                origin: { iata_code: "ICN" },
                destination: { iata_code: "NRT" },
                aircraft: { name: "Boeing 777-300ER" },
              },
            ],
          },
          {
            id: "sli_ret_1",
            duration: "PT2H30M",
            origin: { iata_code: "NRT", name: "Narita International Airport" },
            destination: { iata_code: "ICN", name: "Incheon International Airport" },
            segments: [
              {
                id: "seg_ret_1",
                departing_at: "2026-05-08T14:00:00",
                arriving_at: "2026-05-08T16:30:00",
                operating_carrier: {
                  name: "Korean Air",
                  iata_code: "KE",
                },
                operating_carrier_flight_number: "702",
                marketing_carrier: {
                  name: "Korean Air",
                  iata_code: "KE",
                },
                marketing_carrier_flight_number: "702",
                duration: "PT2H30M",
                origin: { iata_code: "NRT" },
                destination: { iata_code: "ICN" },
                aircraft: { name: "Boeing 777-300ER" },
              },
            ],
          },
        ],
        passengers: [
          {
            id: "pas_test_1",
            type: "adult",
          },
        ],
      },
      {
        id: "off_test_connecting",
        live_mode: false,
        total_amount: "195000.00",
        total_currency: "KRW",
        base_amount: "175000.00",
        base_currency: "KRW",
        tax_amount: "20000.00",
        tax_currency: "KRW",
        expires_at: "2026-05-01T01:00:00.000000Z",
        owner: {
          name: "T'way Air",
          iata_code: "TW",
          logo_symbol_url: "https://assets.duffel.com/img/airlines/TW.svg",
        },
        slices: [
          {
            id: "sli_out_2",
            duration: "PT5H",
            origin: { iata_code: "ICN", name: "Incheon International Airport" },
            destination: { iata_code: "NRT", name: "Narita International Airport" },
            segments: [
              {
                id: "seg_out_2a",
                departing_at: "2026-05-01T06:00:00",
                arriving_at: "2026-05-01T07:30:00",
                operating_carrier: {
                  name: "T'way Air",
                  iata_code: "TW",
                },
                operating_carrier_flight_number: "201",
                marketing_carrier: {
                  name: "T'way Air",
                  iata_code: "TW",
                },
                marketing_carrier_flight_number: "201",
                duration: "PT1H30M",
                origin: { iata_code: "ICN" },
                destination: { iata_code: "FUK" },
                aircraft: { name: "Boeing 737-800" },
              },
              {
                id: "seg_out_2b",
                departing_at: "2026-05-01T09:00:00",
                arriving_at: "2026-05-01T11:00:00",
                operating_carrier: {
                  name: "All Nippon Airways",
                  iata_code: "NH",
                },
                operating_carrier_flight_number: "456",
                marketing_carrier: {
                  name: "All Nippon Airways",
                  iata_code: "NH",
                },
                marketing_carrier_flight_number: "456",
                duration: "PT2H",
                origin: { iata_code: "FUK" },
                destination: { iata_code: "NRT" },
                aircraft: { name: "Boeing 787-9" },
              },
            ],
          },
          {
            id: "sli_ret_2",
            duration: "PT3H",
            origin: { iata_code: "NRT", name: "Narita International Airport" },
            destination: { iata_code: "ICN", name: "Incheon International Airport" },
            segments: [
              {
                id: "seg_ret_2",
                departing_at: "2026-05-08T18:00:00",
                arriving_at: "2026-05-08T21:00:00",
                operating_carrier: {
                  name: "Jeju Air",
                  iata_code: "7C",
                },
                operating_carrier_flight_number: "1102",
                marketing_carrier: {
                  name: "Jeju Air",
                  iata_code: "7C",
                },
                marketing_carrier_flight_number: "1102",
                duration: "PT3H",
                origin: { iata_code: "NRT" },
                destination: { iata_code: "ICN" },
                aircraft: { name: "Boeing 737-800" },
              },
            ],
          },
        ],
        passengers: [
          {
            id: "pas_test_1",
            type: "adult",
          },
        ],
      },
    ],
  },
};
