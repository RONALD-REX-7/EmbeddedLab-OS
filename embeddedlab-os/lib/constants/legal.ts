/**
 * EmbeddedLab OS — lib/constants/legal.ts
 *
 * Source of truth for verified project information, contact endpoints,
 * privacy disclosures, and cookie/storage classifications.
 *
 * NOTE: Only verified information from the project repository is used.
 * Where formal corporate registry details do not exist, clear placeholders
 * ([BUSINESS_NAME], [LEGAL_ADDRESS], etc.) are defined.
 */

export const LEGAL_CONFIG = {
  appName: "EmbeddedLab OS",
  authorName: "Ronald Rex",
  developerHandle: "@RONALD-REX-7",
  verifiedContactEmail: "ronaldrexch@gmail.com",
  repositoryUrl: "https://github.com/RONALD-REX-7/EmbeddedLab-OS",
  websiteUrl: "https://github.com/RONALD-REX-7/EmbeddedLab-OS",

  /** Placeholders for formal legal/business entities if officially registered */
  legalEntityName: "[BUSINESS_NAME]",
  legalAddress: "[LEGAL_ADDRESS]",
  effectiveDate: "October 4, 2026",
  lastUpdated: "October 4, 2026",

  /** Operational nature */
  isCommercial: false, // Free educational virtual lab; no paid products, donations, or transactions
  hasThirdPartyTracking: false, // Zero tracking pixels, zero analytics SDKs, zero advertising cookies
  hasMarketingEmails: false, // Zero marketing campaigns or newsletters

  /** Cookie & Storage Specifications */
  storageItems: [
    {
      name: "sb-*-auth-token",
      type: "Cookie / LocalStorage (Supabase)",
      category: "Strictly Necessary",
      purpose:
        "Maintains encrypted user authentication session and token refresh for registered student accounts.",
      retention: "Session / Persisted until sign-out",
      provider: "EmbeddedLab OS (Supabase Auth)",
    },
    {
      name: "embeddedlab_challenge_progress_*",
      type: "LocalStorage",
      category: "Functional / Strictly Necessary",
      purpose:
        "Saves student laboratory challenge completion status, hints revealed, and scores in offline demo mode.",
      retention: "Persistent until student clicks 'Clear Data' or wipes browser cache",
      provider: "EmbeddedLab OS (Client-Side)",
    },
    {
      name: "embeddedlab_attempts_*",
      type: "LocalStorage",
      category: "Functional / Strictly Necessary",
      purpose:
        "Records timestamped validation attempts and scores per laboratory for the local student progress dashboard.",
      retention: "Persistent until student clicks 'Clear Data' or wipes browser cache",
      provider: "EmbeddedLab OS (Client-Side)",
    },
    {
      name: "embeddedlab_ch_*",
      type: "LocalStorage",
      category: "Functional / Strictly Necessary",
      purpose:
        "Persists the active challenge index and working state across page refreshes.",
      retention: "Persistent until student clears local storage",
      provider: "EmbeddedLab OS (Client-Side)",
    },
  ],

  /** Third Party Processors */
  thirdPartyServices: [
    {
      name: "Supabase Inc.",
      purpose: "User authentication and optional cloud progress database persistence.",
      dataShared: "Email, user ID, hashed password (never plaintext), challenge completion scores.",
      privacyUrl: "https://supabase.com/privacy",
    },
    {
      name: "Google Gemini AI (Google Cloud)",
      purpose:
        "Contextual embedded-systems tutoring assistance (Explain, Hint, Debug).",
      dataShared:
        "Technical hardware state parameters only (pin voltage, frequency, duty cycle, UART baud rate, error logs). No personal names, emails, or user IDs are transmitted.",
      privacyUrl: "https://policies.google.com/privacy",
    },
    {
      name: "Next.js Google Fonts",
      purpose: "Typography (Inter, JetBrains Mono).",
      dataShared:
        "None. Fonts are downloaded at application build time and self-hosted locally from the application origin. No client requests are sent to Google Font servers.",
      privacyUrl: "https://nextjs.org/docs/app/building-your-application/optimizing/fonts",
    },
  ],
} as const;
