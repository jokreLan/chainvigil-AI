export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "ChainVigil AI API",
    version: "0.1.0",
    description:
      "ChainVigil AI V0 internal API contract. Responses are mock-safe until live data adapters are connected.",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local development",
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Service health",
        responses: {
          "200": {
            description: "API health and adapter readiness",
          },
        },
      },
    },
    "/api/v1/system/readiness": {
      get: {
        summary: "Read non-secret environment and dependency readiness",
        responses: {
          "200": {
            description:
              "Runtime readiness, missing env names, production security warnings, adapter states and cache state",
          },
        },
      },
    },
    "/api/v1/meta": {
      get: {
        summary: "Read non-secret service metadata",
        responses: {
          "200": {
            description: "Brand, V0 version, runtime mode and supported chains",
          },
        },
      },
    },
    "/api/v1/admin/audit/logs": {
      get: {
        summary: "Read mock admin audit logs",
        responses: {
          "200": {
            description: "Mock admin audit log list with redacted metadata",
          },
        },
      },
    },
    "/api/v1/admin/risk-review/queue": {
      get: {
        summary: "Read mock admin risk review queue",
        responses: {
          "200": {
            description: "Mock high-risk CA review queue for Admin skeleton",
          },
        },
      },
    },
    "/api/v1/admin/risk-labels": {
      get: {
        summary: "Read mock admin risk label catalog",
        responses: {
          "200": {
            description: "Mock token, deployer and spender risk labels for Admin skeleton",
          },
        },
      },
    },
    "/api/v1/admin/token-reports": {
      get: {
        summary: "Read mock admin token report index",
        responses: {
          "200": {
            description: "Mock token report index for Admin skeleton",
          },
        },
      },
    },
    "/api/v1/telegram/groups": {
      get: {
        summary: "Read mock Telegram group settings",
        responses: {
          "200": {
            description: "Mock Telegram group settings and daily usage summary",
          },
        },
      },
    },
    "/api/v1/telegram/commands": {
      get: {
        summary: "Read Telegram bot command list",
        responses: {
          "200": {
            description: "Telegram bot commands and descriptions",
          },
        },
      },
    },
    "/api/v1/token/check": {
      post: {
        summary: "Check a token contract address or DEX link",
        responses: {
          "200": {
            description: "Token risk report and pending VP event",
          },
          "400": {
            description: "Invalid chain or token input",
          },
          "429": {
            description: "Rate limited",
          },
        },
      },
    },
    "/api/v1/token/{chain}/{address}": {
      get: {
        summary: "Read a token risk report",
        responses: {
          "200": {
            description: "Token risk report",
          },
          "400": {
            description: "Invalid chain or address",
          },
        },
      },
    },
    "/api/v1/token/{chain}/{address}/data": {
      get: {
        summary: "Read raw token risk adapter bundle",
        responses: {
          "200": {
            description: "Mock/live-ready provider snapshots for debugging",
          },
          "400": {
            description: "Invalid chain or address",
          },
        },
      },
    },
    "/api/v1/wallet/health": {
      post: {
        summary: "Run a read-only wallet health check",
        responses: {
          "200": {
            description: "Wallet health report",
          },
          "400": {
            description: "Invalid wallet address",
          },
          "429": {
            description: "Rate limited",
          },
        },
      },
    },
    "/api/v1/wallet/{address}/health": {
      get: {
        summary: "Read a wallet health report",
        responses: {
          "200": {
            description: "Wallet health report",
          },
          "400": {
            description: "Invalid wallet address",
          },
        },
      },
    },
    "/api/v1/points/rules": {
      get: {
        summary: "Read Vigil Points rules",
        responses: {
          "200": {
            description: "VP rule table",
          },
        },
      },
    },
    "/api/v1/points/ledger": {
      get: {
        summary: "Read mock Vigil Points ledger summary",
        responses: {
          "200": {
            description: "Mock VP ledger totals, balances and recent events",
          },
        },
      },
    },
    "/api/v1/points/event": {
      post: {
        summary: "Record a pending VP event",
        responses: {
          "200": {
            description: "Pending VP event",
          },
          "400": {
            description: "Invalid VP event",
          },
          "429": {
            description: "Rate limited",
          },
        },
      },
    },
    "/api/v1/referral/event": {
      post: {
        summary: "Record referral attribution event",
        responses: {
          "200": {
            description: "Recorded referral event",
          },
          "429": {
            description: "Rate limited",
          },
        },
      },
    },
  },
} as const;
