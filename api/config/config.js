const Joi = require('joi');

// require('dotenv').config();
require('custom-env').env(process.env.NODE_ENV);

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'staging', 'production'])
    .default('development'),
  APP_URL: Joi.string().required(),
  RUN_LOCAL: Joi.string().optional().default('no'),
  UNIT_TESTING: Joi.string().optional().default('no'),
  HASH_SECRET_KEY: Joi.string().required(),
  DOMAIN_CDN: Joi.string().required(),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  appName: 'SCC API',
  env: envVars.NODE_ENV,
  port: envVars.PORT || 3001,
  runLocal: envVars.RUN_LOCAL === 'yes',
  testing: envVars.UNIT_TESTING === 'yes',
  appWelcome: envVars.APP_WELCOME,
  appUrl: envVars.APP_URL,
  hashSecretKey: envVars.HASH_SECRET_KEY,
  token: {
    key: 'Authorization',
    type: 'Bearer',
  },
  domain_cdn: envVars.DOMAIN_CDN,
  upload_apikey: envVars.UPLOAD_APIKEY,
  database: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    dialect: 'mssql',
  },
  sql: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },
  adminUserName: 'administrator',
  sendSms: {
    url: 'http://api.abenla.com/Service.asmx?wsdl',
    loginName: 'AB11B6M',
    pass: '1TLU5XE6N',
  },
  sendEmail: {
    hostname: 'api.sendgrid.com',
    apiKey:
      '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',
  },
  sendGmail: {
    user: 'devrubyfitness@gmail.com',
    pass: 'Des123456@',
  },
  website: process.env.WEBSITE,
  secretKey: process.env.SECRET_KEY,
  mail: {
    MAIL_SMTP_SERVER: process.env.MAIL_SERVER,
    MAIL_SMTP_PORT: process.env.MAIL_PORT,
    MAIL_SECURE: process.env.MAIL_SECURE,
    MAIL_SMTP_USER: process.env.MAIL_USER,
    MAIL_SMTP_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_FROM: process.env.MAIL_FROM,
  },
};

module.exports = config;
