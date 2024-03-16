import express from 'express';
import auth from '../../middlewares/auth';
import { ArtistsController } from './artists.controller';

const router = express.Router();
// auth middleware
router.use(auth());
router.post(
  '/',
  // validateRequest(ArtistsValidation.createArtistsJoiSchema),
  ArtistsController.insertIntoDB,
);
router.get('/', ArtistsController.getAllFromDB);

router.patch(
  '/:id',
  // validateRequest(ArtistsValidation.updateArtistsJoiSchema),
  ArtistsController.updateInDB,
);
router.delete('/:id', ArtistsController.deleteInDB);

export const ArtistsRoutes = router;
