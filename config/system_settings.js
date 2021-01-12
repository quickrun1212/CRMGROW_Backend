const system_settings = {
  SUBSCRIPTION_MONTHLY_PLAN: {
    BASIC: '29',
    TEAM: '25',
  },
  EMAIL_ONE_TIME: 15,
  EMAIL_DAILY_LIMIT: {
    BASIC: 500,
    GMAIL: 500,
    GSUIT: 1500,
    OUTLOOK: 300,
    MICROSOFT: 2000,
  },
  TEXT_ONE_TIME: 5,
  TEXT_MONTHLY_LIMIT: {
    BASIC: 250,
  },
  CONTACT_UPLOAD_LIMIT: {
    BASIC: 3000,
  },
  MATERIAL_UPLOAD_LIMIT: {
    BASIC: 15,
  },
  PASSWORD: {
    USER: process.env.DEFAULT_PASS || 'admin123',
    ADMIN: process.env.ADMIN_DEFAULT_PASS || 'admin123',
  },
  COMPANY: {
    DEFAULT: 'eXp Realty',
  },
  ADMIN_ACCOUNT: 'support@crmgrow.com',
  LEAD: '5f16d58d0af09220208b6e11',
  AUTO_FOLLOW_UP: 'has reviewed material',
  AUTOMATION: 2000,
  THUMBNAIL: {
    WIDTH: 400,
    HEIGHT: 220,
  },
  IMAP_PORT: 587,
  ONBOARD_PRICING_30_MINS: 5000,
  ONBOARD_PRICING_1_HOUR: 9500,
  SCHEDULE_LINK_30_MINS: 'https://calendly.com/coachwithdaniel/crm-grow-30',
  SCHEDULE_LINK_1_HOUR: 'https://calendly.com/coachwithdaniel/crm-grow',
  CAMPAIGN_MAIL_START: {
    GMAIL: 150,
    GSUIT: 500,
    OUTLOOK: 150,
    MICROSOFT: 500,
    AWS: 5000,
  },
  CAMPAIGN_MAIL_LIMIT: {
    GMAIL: 400,
    GSUIT: 1500,
    OUTLOOK: 250,
    MICROSOFT: 1000,
    AWS: 5000,
  },
  WEBINAR_LINK:
    'https://zoom.us/meeting/register/tJ0ldumrrT4vGtYOOCiiMpjNJbvSLE4NWBad',
  TIME_ZONE: 'America/New York',
};

module.exports = system_settings;
