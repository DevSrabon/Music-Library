import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SongController } from './song.controller';
import { SongValidation } from './song.validation';

const router = express.Router();
// auth middleware
router.use(auth());
router.post(
  '/',
  validateRequest(SongValidation.createSongJoiSchema),
  SongController.insertIntoDB,
);
router.get('/', SongController.getAllFromDB);

router.patch(
  '/:id',
  validateRequest(SongValidation.updateSongJoiSchema),
  SongController.updateInDB,
);
router.delete('/:id', SongController.deleteInDB);

export const SongRoutes = router;
