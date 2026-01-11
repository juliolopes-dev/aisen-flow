const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

pool.on('connect', (client) => {
  client.query("SET timezone = 'America/Sao_Paulo'");
  console.log('✅ Conectado ao PostgreSQL (Timezone: America/Sao_Paulo)');
});

pool.on('error', (err) => {
  console.error('❌ Erro na conexão com PostgreSQL:', err);
});

module.exports = pool;
