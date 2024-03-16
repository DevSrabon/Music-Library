import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AlbumController } from './album.controller';
import { AlbumValidation } from './album.validation';

const router = express.Router();
// auth middleware
router.use(auth());
router.post(
  '/',
  validateRequest(AlbumValidation.createAlbumJoiSchema),
  AlbumController.insertIntoDB,
);
router.get('/', AlbumController.getAllFromDB);

router.patch(
  '/:id',
  validateRequest(AlbumValidation.updateAlbumJoiSchema),
  AlbumController.updateInDB,
);
router.delete('/:id', AlbumController.deleteInDB);

export const AlbumRoutes = router;
