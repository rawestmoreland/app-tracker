import { Hono } from 'hono';
import { cloudflareRateLimiter } from '@hono-rate-limiter/cloudflare';
import { getPrisma } from './lib/prismaFunction';
import { renderer } from './renderer';

const MAX_LIMIT = 100;

type AppType = {
  Variables: {
    rateLimit: boolean;
  };
  Bindings: {
    DATABASE_URL: string;
    MY_RATE_LIMITER: RateLimit;
  };
};

const app = new Hono<AppType>().use(
  cloudflareRateLimiter<AppType>({
    rateLimitBinding: (c) => c.env.MY_RATE_LIMITER,
    keyGenerator: (c) => c.req.header('cf-connecting-ip') ?? '', // Method to generate custom identifiers for clients.
  }),
);

app.use('*', renderer);

app.get('/', (c) => {
  return c.render(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <h1>The App Track API</h1>
      <a
        href="https://documenter.getpostman.com/view/21796760/2sB3QFPXDP#e9f83982-5b57-4a4f-9a70-e496e45705e3"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: '14px',
          color: 'blue',
          textDecoration: 'underline',
          underlineOffset: '4px',
        }}
      >
        Documentation
      </a>
    </div>,
  );
});

app.get('/v1/companies', async (c) => {
  const limit = c.req.query('limit') ?? 10;
  const offset = c.req.query('offset') ?? 0;

  if (Number(limit) > MAX_LIMIT) {
    return c.json({ error: 'Limited to 100 companies per page' }, 400);
  }

  const prisma = getPrisma(c.env.DATABASE_URL);
  const total = await prisma.company.count({
    where: {
      visibility: 'GLOBAL',
    },
  });
  const companies = await prisma.company.findMany({
    where: {
      visibility: 'GLOBAL',
    },
    select: {
      id: true,
      name: true,
      website: true,
      description: true,
      plainTextDescription: true,
      industry: true,
      size: true,
      location: true,
      logo: true,
    },
    orderBy: {
      name: 'asc',
    },
    take: Number(limit),
    skip: Number(offset),
  });

  const returnedCompanies = companies.map((company) => ({
    id: company.id,
    name: company.name,
    website: company.website,
    description: company.plainTextDescription,
    industry: company.industry,
    size: company.size,
    location: company.location,
    logo: company.logo,
  }));

  return c.json({
    companies: returnedCompanies,
    total,
    limit: Number(limit),
    offset: Number(offset),
  });
});

app.get('/v1/companies/:id', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const company = await prisma.company.findUnique({
    where: { id: c.req.param('id') },
    select: {
      id: true,
      name: true,
      website: true,
      description: true,
      plainTextDescription: true,
      industry: true,
      size: true,
      location: true,
      logo: true,
    },
  });

  if (!company) {
    return c.json({ error: 'Company not found' }, 404);
  }

  return c.json({
    id: company?.id,
    name: company?.name,
    website: company?.website,
    industry: company?.industry,
    size: company?.size,
    location: company?.location,
    logo: company?.logo,
    description: company?.plainTextDescription ?? '',
  });
});

export default app;
