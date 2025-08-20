import { getPrisma } from '@/lib/prismaFunction';
import { Hono } from 'hono';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

app.get('/', async (c) => {
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
      industry: true,
      size: true,
      location: true,
      logo: true,
    },
  });

  return c.json(companies);
});

app.get('/:id', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  const company = await prisma.company.findUnique({
    where: { id: c.req.param('id'), visibility: 'GLOBAL' },
    select: {
      id: true,
      name: true,
      website: true,
      description: true,
      industry: true,
      size: true,
      location: true,
      logo: true,
    },
  });

  return c.json(company);
});

export default app;
