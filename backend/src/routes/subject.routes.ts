import { Router } from 'express';
import { getSubjects, getSubjectDetails, getEnrollments, enrollSubject } from '../controllers/subject.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getSubjects);
router.get('/enrolled', authenticateJWT as any, getEnrollments);
router.get('/:id', getSubjectDetails);
router.post('/:id/enroll', authenticateJWT as any, enrollSubject);

export default router;
