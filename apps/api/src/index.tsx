import { Hono } from 'hono';
import { cloudflareRateLimiter } from '@hono-rate-limiter/cloudflare';
import { getPrisma } from './lib/prismaFunction';
import { renderer } from './renderer';
import { jsxRenderer } from 'hono/jsx-renderer';

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
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <h1>The App Track API</h1>
    </div>,
  );
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

  const returnedCompanies = companies.map((company) => ({
    id: company.id,
    name: company.name,
    website: company.website,
    plain_text_description: company.plainTextDescription,
    html_description: company.description,
    industry: company.industry,
    size: company.size,
    location: company.location,
    logo: company.logo,
  }));

  return c.json(returnedCompanies);
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
    plain_text_description: company?.plainTextDescription ?? '',
    html_description: company?.description ?? '',
  });
});

export default app;
