import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const YOUTUBE_URLS = [
  'https://www.youtube.com/embed/aircAruvnKk',
  'https://www.youtube.com/embed/IHZwWFHWa-w',
  'https://www.youtube.com/embed/Ilg3gGewQ5U',
  'https://www.youtube.com/embed/tIeHLnjs5U8',
  'https://www.youtube.com/embed/JcI5Vnw0b2c'
];

function generateVideos(sectionTitle: string) {
  return [
    { title: `${sectionTitle} - Part 1: Concepts`, description: `Fundamental concepts of ${sectionTitle}`, youtubeUrl: YOUTUBE_URLS[0], orderIndex: 0, durationSeconds: 600 },
    { title: `${sectionTitle} - Part 2: Applications`, description: `Practical applications of ${sectionTitle}`, youtubeUrl: YOUTUBE_URLS[1], orderIndex: 1, durationSeconds: 800 },
    { title: `${sectionTitle} - Part 3: Deep Dive`, description: `Advanced theoretical overview.`, youtubeUrl: YOUTUBE_URLS[2], orderIndex: 2, durationSeconds: 950 },
    { title: `${sectionTitle} - Part 4: Implementation`, description: `Coding and real-world implementation.`, youtubeUrl: YOUTUBE_URLS[3], orderIndex: 3, durationSeconds: 1200 },
  ];
}

async function main() {
  console.log('Seeding new AI/ML courses...');

  const coursesParams = [
    {
      title: "Complete Machine Learning Bootcamp",
      slug: "complete-ml-bootcamp",
      description: "Learn supervised, unsupervised learning, regression, classification, and real-world ML projects.",
      price: 1999,
      sections: ["Introduction to ML", "Supervised Learning", "Unsupervised Learning", "Model Evaluation"]
    },
    {
      title: "Artificial Intelligence Fundamentals",
      slug: "ai-fundamentals",
      description: "Understand AI concepts, search algorithms, knowledge representation, and real-world AI applications.",
      price: 1499,
      sections: ["Introduction to AI", "Search Algorithms", "Knowledge Representation", "AI Applications"]
    },
    {
      title: "Deep Learning with Neural Networks",
      slug: "deep-learning-nn",
      description: "Master neural networks, CNNs, RNNs, and deep learning frameworks.",
      price: 2499,
      sections: ["Neural Network Basics", "Convolutional Neural Networks (CNN)", "Recurrent Neural Networks (RNN)", "Advanced Deep Learning"]
    }
  ];

  for (const c of coursesParams) {
    // Avoid unique constraint errors by using upsert or checking first
    const existing = await prisma.subject.findUnique({ where: { slug: c.slug } });
    if (!existing) {
      await prisma.subject.create({
        data: {
          title: c.title,
          slug: c.slug,
          description: c.description,
          price: c.price,
          is_published: true,
          sections: {
            create: c.sections.map((secLabel, idx) => ({
              title: secLabel,
              orderIndex: idx,
              videos: {
                create: generateVideos(secLabel)
              }
            }))
          }
        }
      });
      console.log(`Created course: ${c.title}`);
    } else {
      console.log(`Course ${c.slug} already exists, skipping.`);
    }
  }

  console.log('Finished seeding new courses.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
