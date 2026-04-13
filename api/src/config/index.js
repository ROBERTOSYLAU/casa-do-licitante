module.exports = {
  mode: process.env.MODE || 'api',
  api: {
    port: Number(process.env.PORT || 3001)
  },
  db: {
    host: process.env.DB_HOST || 'postgres',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'casa',
    password: process.env.DB_PASSWORD || 'CasaLicitante2026!Seguro',
    database: process.env.DB_NAME || 'casa_licitante'
  },
  pncp: {
    dataInicial: process.env.PNCP_DATA_INICIAL || '20250101',
    dataFinal: process.env.PNCP_DATA_FINAL || '20251231',
    modalidade: process.env.PNCP_MODALIDADE || '5',
    paginaSize: Number(process.env.PNCP_PAGINA_SIZE || 50),
    maxPaginas: Number(process.env.PNCP_MAX_PAGINAS || 10)
  },
  portals: {
    comprasnetBaseUrl:
      process.env.COMPRASNET_BASE_URL ||
      'https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-web/public/compras'
  }
};
