import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Lesson = {
  title: string;
  description: string;
  youtubeUrl: string;
  durationSeconds?: number;
};

type Section = {
  title: string;
  orderIndex: number;
  lessons: Lesson[];
};

type Course = {
  slug: string;
  title: string;
  description: string;
  sections: Section[];
};

const EMBED = (videoId: string, startSeconds?: number) =>
  `https://www.youtube.com/embed/${videoId}${
    startSeconds !== undefined ? `?start=${startSeconds}` : ''
  }`;

/*
 * ============================================================
 * COURSE 1
 * COMPLETE MACHINE LEARNING BOOTCAMP
 * ============================================================
 */

const machineLearningCourse: Course = {
  slug: 'complete-ml-bootcamp',
  title: 'Complete Machine Learning Bootcamp',
  description:
    'Learn supervised and unsupervised learning, regression, classification, model evaluation, and practical machine learning concepts.',
  sections: [
    {
      title: 'Introduction to ML',
      orderIndex: 0,
      lessons: [
        {
          title: 'A Gentle Introduction to Machine Learning',
          description:
            'Understand the fundamental ideas behind machine learning and how machines learn patterns from data.',
          youtubeUrl: EMBED('Gv9_4yMHFhI'),
        },
        {
          title: 'Linear Regression',
          description:
            'Learn how linear regression fits a line to data and how R-squared measures model fit.',
          youtubeUrl: EMBED('nk2CQITm_eo'),
        },
        {
          title: 'Gradient Descent',
          description:
            'Understand the optimization algorithm used to train many machine learning models.',
          youtubeUrl: EMBED('sDv4f4s2SB8'),
        },
        {
          title: 'Bias and Variance',
          description:
            'Understand underfitting, overfitting, bias, and variance in machine learning.',
          youtubeUrl: EMBED('EuBBz3bI-aA'),
        },
      ],
    },

    {
      title: 'Supervised Learning',
      orderIndex: 1,
      lessons: [
        {
          title: 'Linear Regression',
          description:
            'Learn the fundamentals of predicting continuous values using linear regression.',
          youtubeUrl: EMBED('nk2CQITm_eo'),
        },
        {
          title: 'Logistic Regression',
          description:
            'Learn how logistic regression is used for classification problems.',
          youtubeUrl: EMBED('yIYKR4sgzI8'),
        },
        {
          title: 'Decision Trees',
          description:
            'Understand how decision trees split data to perform classification.',
          youtubeUrl: EMBED('_L39rN6gz7Y'),
        },
        {
          title: 'Random Forests',
          description:
            'Learn how ensembles of decision trees improve predictive performance.',
          youtubeUrl: EMBED('J4Wdy0Wc_xQ'),
        },
      ],
    },

    {
      title: 'Unsupervised Learning',
      orderIndex: 2,
      lessons: [
        {
          title: 'K-Means Clustering',
          description:
            'Learn how K-means groups similar data points into clusters.',
          youtubeUrl: EMBED('4b5d3muPQmA'),
        },
        {
          title: 'Hierarchical Clustering',
          description:
            'Understand hierarchical clustering and how clusters can be built progressively.',
          youtubeUrl: EMBED('7xHsRkOdVwo'),
        },
        {
          title: 'Principal Component Analysis',
          description:
            'Learn how PCA reduces dimensionality while preserving important variation in the data.',
          youtubeUrl: EMBED('FgakZw6K1QQ'),
        },
        {
          title: 'PCA Practical Tips',
          description:
            'Explore practical considerations when applying PCA to real datasets.',
          youtubeUrl: EMBED('oRvgq966yZg'),
        },
      ],
    },

    {
      title: 'Model Evaluation',
      orderIndex: 3,
      lessons: [
        {
          title: 'Cross Validation',
          description:
            'Learn how cross validation helps estimate model performance and compare models.',
          youtubeUrl: EMBED('fSytzGwwBVw'),
        },
        {
          title: 'Confusion Matrix',
          description:
            'Understand true positives, true negatives, false positives, and false negatives.',
          youtubeUrl: EMBED('Kdsp6soqA7o'),
        },
        {
          title: 'Sensitivity and Specificity',
          description:
            'Learn two important metrics for evaluating classification models.',
          youtubeUrl: EMBED('vP06aMoz4v8'),
        },
        {
          title: 'ROC and AUC',
          description:
            'Understand ROC curves and AUC for evaluating classification performance.',
          youtubeUrl: EMBED('4jRBRDbJemM'),
        },
      ],
    },
  ],
};

/*
 * ============================================================
 * COURSE 2
 * ARTIFICIAL INTELLIGENCE FUNDAMENTALS
 * ============================================================
 *
 * CS50 AI lectures are used with timestamps where appropriate.
 * This gives each lesson a different starting point while
 * keeping the curriculum tied to the correct lecture.
 */

const aiFundamentalsCourse: Course = {
  slug: 'ai-fundamentals',
  title: 'Artificial Intelligence Fundamentals',
  description:
    'Understand the foundations of artificial intelligence, search algorithms, knowledge representation, optimization, and practical AI applications.',
  sections: [
    {
      title: 'Introduction to AI',
      orderIndex: 0,
      lessons: [
        {
          title: 'What Is Artificial Intelligence?',
          description:
            'Introduction to artificial intelligence and intelligent systems.',
          youtubeUrl: EMBED('WbzNRTTrX0g', 15),
        },
        {
          title: 'Solving Problems with AI',
          description:
            'Learn how AI systems formulate and solve computational problems.',
          youtubeUrl: EMBED('WbzNRTTrX0g', 14 * 60 + 17),
        },
        {
          title: 'Artificial Intelligence in Practice',
          description:
            'Explore how AI techniques support game playing, recognition, and intelligent decision making.',
          youtubeUrl: EMBED('WbzNRTTrX0g', 0),
        },
        {
          title: 'Foundations of Intelligent Systems',
          description:
            'Build a foundation for understanding modern AI algorithms.',
          youtubeUrl: EMBED('WbzNRTTrX0g', 3 * 60 + 14),
        },
      ],
    },

    {
      title: 'Search Algorithms',
      orderIndex: 1,
      lessons: [
        {
          title: 'Depth-First Search',
          description:
            'Understand depth-first search and how it explores a problem space.',
          youtubeUrl: EMBED('WbzNRTTrX0g', 25 * 60 + 57),
        },
        {
          title: 'Breadth-First Search',
          description:
            'Learn breadth-first search and how it differs from depth-first search.',
          youtubeUrl: EMBED('WbzNRTTrX0g', 28 * 60 + 30),
        },
        {
          title: 'Greedy Best-First Search',
          description:
            'Learn how heuristic information guides greedy search.',
          youtubeUrl: EMBED('WbzNRTTrX0g', 54 * 60 + 29),
        },
        {
          title: 'A* Search',
          description:
            'Understand A* search and how it combines path cost with heuristic estimates.',
          youtubeUrl: EMBED('WbzNRTTrX0g', 65 * 60 + 15),
        },
      ],
    },

    {
      title: 'Knowledge Representation',
      orderIndex: 2,
      lessons: [
        {
          title: 'Propositional Logic',
          description:
            'Learn how knowledge can be represented using propositions and logical statements.',
          youtubeUrl: EMBED('HWQLez87vqM', 4 * 60 + 52),
        },
        {
          title: 'Inference',
          description:
            'Understand how AI systems derive new information from existing knowledge.',
          youtubeUrl: EMBED('HWQLez87vqM', 21 * 60 + 47),
        },
        {
          title: 'Knowledge Engineering',
          description:
            'Learn how knowledge bases can be designed and structured for AI systems.',
          youtubeUrl: EMBED('HWQLez87vqM', 40 * 60 + 6),
        },
        {
          title: 'First-Order Logic',
          description:
            'Explore first-order logic and its role in representing complex knowledge.',
          youtubeUrl: EMBED('HWQLez87vqM', 98 * 60 + 25),
        },
      ],
    },

    {
      title: 'AI Applications',
      orderIndex: 3,
      lessons: [
        {
          title: 'Optimization and Local Search',
          description:
            'Explore local search and optimization techniques used by AI systems.',
          youtubeUrl: EMBED('TA5ZJm1ZYS4', 60),
        },
        {
          title: 'Machine Learning in AI',
          description:
            'Explore supervised, unsupervised, and reinforcement learning within AI.',
          youtubeUrl: EMBED('E4M_IQG0d9g', 75),
        },
        {
          title: 'Computer Vision',
          description:
            'Understand how neural networks and convolutional methods are used for computer vision.',
          youtubeUrl: EMBED('mFZazxxCKbw', 53 * 60 + 1),
        },
        {
          title: 'Natural Language Processing',
          description:
            'Explore language representation, tokenization, n-grams, information retrieval, and word embeddings.',
          youtubeUrl: EMBED('_hAVVULrZ0Q', 15),
        },
      ],
    },
  ],
};

/*
 * ============================================================
 * COURSE 3
 * DEEP LEARNING WITH NEURAL NETWORKS
 * ============================================================
 */

const deepLearningCourse: Course = {
  slug: 'deep-learning-nn',
  title: 'Deep Learning with Neural Networks',
  description:
    'Master neural networks, backpropagation, convolutional neural networks, recurrent neural networks, and practical deep learning concepts.',
  sections: [
    {
      title: 'Neural Network Basics',
      orderIndex: 0,
      lessons: [
        {
          title: 'What Is a Neural Network?',
          description:
            'Build intuition for neurons, layers, weights, biases, and neural-network representations.',
          youtubeUrl: EMBED('aircAruvnKk'),
        },
        {
          title: 'Gradient Descent for Neural Networks',
          description:
            'Understand how gradient descent enables neural networks to learn.',
          youtubeUrl: EMBED('IHZwWFHWa-w'),
        },
        {
          title: 'Backpropagation Main Ideas',
          description:
            'Learn the core idea behind backpropagation and how errors are propagated through a network.',
          youtubeUrl: EMBED('IN2XmBhILt4'),
        },
        {
          title: 'ReLU Activation Functions',
          description:
            'Understand the role of ReLU activation functions in neural networks.',
          youtubeUrl: EMBED('68BZ5f7P94E'),
        },
      ],
    },

    {
      title: 'Convolutional Neural Networks (CNN)',
      orderIndex: 1,
      lessons: [
        {
          title: 'What Is a Convolution?',
          description:
            'Build intuition for convolution and how it is used in image processing.',
          youtubeUrl: EMBED('KuXjwB4LzSA'),
        },
        {
          title: 'Image Classification with CNNs',
          description:
            'Learn how convolutional neural networks classify images.',
          youtubeUrl: EMBED('HGwBXDKFk9I'),
        },
        {
          title: 'Computer Vision with Neural Networks',
          description:
            'Explore how neural networks are applied to computer vision tasks.',
          youtubeUrl: EMBED('mFZazxxCKbw', 53 * 60 + 1),
        },
        {
          title: 'CNN Architecture',
          description:
            'Understand convolutional layers and how they form a complete image-classification network.',
          youtubeUrl: EMBED('HGwBXDKFk9I'),
        },
      ],
    },

    {
      title: 'Recurrent Neural Networks (RNN)',
      orderIndex: 2,
      lessons: [
        {
          title: 'Recurrent Neural Networks',
          description:
            'Learn how recurrent neural networks process sequential information.',
          youtubeUrl: EMBED('AsNTP8Kwu80'),
        },
        {
          title: 'Long Short-Term Memory Networks',
          description:
            'Understand how LSTMs address limitations of basic recurrent neural networks.',
          youtubeUrl: EMBED('YCzL96nL7j0'),
        },
        {
          title: 'RNNs in Deep Learning',
          description:
            'Explore recurrent networks and their role in sequence-based problems.',
          youtubeUrl: EMBED('mFZazxxCKbw', 87 * 60 + 3),
        },
        {
          title: 'Sequence Modeling',
          description:
            'Understand how neural networks can process information that arrives sequentially.',
          youtubeUrl: EMBED('AsNTP8Kwu80'),
        },
      ],
    },

    {
      title: 'Advanced Deep Learning',
      orderIndex: 3,
      lessons: [
        {
          title: 'Overfitting in Neural Networks',
          description:
            'Learn how overfitting affects neural networks and how it can be identified.',
          youtubeUrl: EMBED('mFZazxxCKbw', 36 * 60 + 27),
        },
        {
          title: 'TensorFlow for Neural Networks',
          description:
            'Explore TensorFlow as a framework for implementing neural networks.',
          youtubeUrl: EMBED('mFZazxxCKbw', 38 * 60 + 52),
        },
        {
          title: 'Computer Vision with Deep Learning',
          description:
            'Understand practical computer-vision applications of deep learning.',
          youtubeUrl: EMBED('mFZazxxCKbw', 53 * 60 + 1),
        },
        {
          title: 'CNN and RNN Applications',
          description:
            'Review practical applications of convolutional and recurrent neural networks.',
          youtubeUrl: EMBED('mFZazxxCKbw', 68 * 60 + 18),
        },
      ],
    },
  ],
};

/*
 * ============================================================
 * SAFE UPDATE LOGIC
 * ============================================================
 *
 * IMPORTANT:
 * - No deleteMany()
 * - No database reset
 * - No user modifications
 * - No enrollment modifications
 * - No progress modifications
 * - No schema modifications
 *
 * Existing sections/videos are updated by orderIndex.
 * Missing sections/videos are created.
 */

async function updateCourse(course: Course) {
  const subject = await prisma.subject.findUnique({
    where: {
      slug: course.slug,
    },
  });

  if (!subject) {
    console.log(
      `Course not found: ${course.slug}. Skipping instead of creating a duplicate.`
    );
    return;
  }

  console.log(`\nUpdating course: ${subject.title}`);

  for (const sectionData of course.sections) {
    let section = await prisma.section.findFirst({
      where: {
        subjectId: subject.id,
        orderIndex: sectionData.orderIndex,
      },
    });

    if (!section) {
      section = await prisma.section.create({
        data: {
          subjectId: subject.id,
          title: sectionData.title,
          orderIndex: sectionData.orderIndex,
        },
      });

      console.log(`  Created section: ${sectionData.title}`);
    } else {
      section = await prisma.section.update({
        where: {
          id: section.id,
        },
        data: {
          title: sectionData.title,
          orderIndex: sectionData.orderIndex,
        },
      });

      console.log(`  Updated section: ${sectionData.title}`);
    }

    for (const [lessonIndex, lesson] of sectionData.lessons.entries()) {
      const existingVideo = await prisma.video.findFirst({
        where: {
          sectionId: section.id,
          orderIndex: lessonIndex,
        },
      });

      if (existingVideo) {
        await prisma.video.update({
          where: {
            id: existingVideo.id,
          },
          data: {
            title: lesson.title,
            description: lesson.description,
            youtubeUrl: lesson.youtubeUrl,
            orderIndex: lessonIndex,
          },
        });

        console.log(`    Updated lesson ${lessonIndex + 1}: ${lesson.title}`);
      } else {
        await prisma.video.create({
          data: {
            sectionId: section.id,
            title: lesson.title,
            description: lesson.description,
            youtubeUrl: lesson.youtubeUrl,
            orderIndex: lessonIndex,
            durationSeconds: lesson.durationSeconds ?? null,
          },
        });

        console.log(`    Created lesson ${lessonIndex + 1}: ${lesson.title}`);
      }
    }
  }

  console.log(`Finished: ${course.title}`);
}

async function main() {
  console.log('==============================================');
  console.log('Safe LMS Course Content Update');
  console.log('==============================================');

  console.log('\nNo records will be deleted.');
  console.log('Existing users, enrollments and progress will be preserved.');

  await updateCourse(machineLearningCourse);
  await updateCourse(aiFundamentalsCourse);
  await updateCourse(deepLearningCourse);

  console.log('\n==============================================');
  console.log('Course content update completed successfully.');
  console.log('==============================================');
}

main()
 .catch((error) => {
  console.error('\nCourse content update failed:');
  console.error(error);
  throw error;
})
  .finally(async () => {
    await prisma.$disconnect();
  });