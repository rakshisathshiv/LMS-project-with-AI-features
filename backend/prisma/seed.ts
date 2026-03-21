import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding sample data for LMS...');

  const c1 = await prisma.subject.create({
    data: {
      title: 'Full Stack Development 101',
      slug: 'full-stack-101',
      description: 'Learn modern web development using Next.js and Node.js from scratch.',
      is_published: true,
      price: 49.99,
      sections: {
        create: [
          {
            title: 'Introduction to Next.js',
            orderIndex: 0,
            videos: {
              create: [
                {
                  title: 'What is Next.js?',
                  description: 'A brief overview of the Next.js framework.',
                  youtubeUrl: 'https://www.youtube.com/embed/Sklc_fQBmcs',
                  orderIndex: 0,
                  durationSeconds: 600
                },
                {
                  title: 'Routing in Next.js',
                  description: 'Understanding the App Router.',
                  youtubeUrl: 'https://www.youtube.com/embed/YQZVNMAOU6Y',
                  orderIndex: 1,
                  durationSeconds: 1200
                }
              ]
            }
          }
        ]
      }
    }
  });

  const c2 = await prisma.subject.create({
    data: {
      title: 'Advanced React Patterns',
      slug: 'advanced-react-patterns',
      description: 'Master React state management and component composition.',
      is_published: true,
      price: 79.99,
      sections: {
        create: [
          {
            title: 'Hooks Deep Dive',
            orderIndex: 0,
            videos: {
              create: [
                {
                  title: 'Mastering useEffect',
                  description: 'Learn when and how to use the useEffect hook properly.',
                  youtubeUrl: 'https://www.youtube.com/embed/0ZJgIjIuY7U',
                  orderIndex: 0,
                  durationSeconds: 950
                },
                {
                  title: 'Custom Hooks',
                  description: 'Creating reusable logic with custom hooks.',
                  youtubeUrl: 'https://www.youtube.com/embed/6ThIvnfpXI',
                  orderIndex: 1,
                  durationSeconds: 820
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Seeding complete. Subjects created:', c1.title, ',', c2.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
