import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(UserValidation.createUserJoiSchema),
  UserController.insertIntoDB,
);

// auth middleware
router.use(auth());

router.get('/', UserController.getAllFromDB);
router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserJoiSchema),
  UserController.updateInDB,
);
router.delete('/:id', UserController.deleteInDB);

export const UserRoutes = router;
