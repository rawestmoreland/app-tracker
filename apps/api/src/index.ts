import { Hono } from 'hono';
import { cloudflareRateLimiter } from '@hono-rate-limiter/cloudflare';
import { getPrisma } from './lib/prismaFunction';

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

app.get('/', (c) => {
  return c.json({ message: 'Hello World' });
});

app.get('/v1/companies', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
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
  });
  return c.json({
    companies,
    plain_text_description: companies.map(
      (company) => company.plainTextDescription,
    ),
    html_description: companies.map((company) => company.description),
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
  return c.json({
    ...company,
    plain_text_description: company?.plainTextDescription ?? '',
    html_description: company?.description ?? '',
  });
});

export default app;
