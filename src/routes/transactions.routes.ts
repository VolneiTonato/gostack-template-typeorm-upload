import { Router } from 'express';
import multer from 'multer';
import TransactionController from '../controllers/TransactionController';
import uploadImportTransactionConfig from '../config/uploadImportTransactionConfig';

const transactionController = new TransactionController();

const router = Router();

const upload = multer(uploadImportTransactionConfig);

router.route('/').get(transactionController.index);
router.route('/:id').get(transactionController.show);
router
  .route('/import')
  .post(upload.single('file'), transactionController.import);
router.route('/').post(transactionController.create);
router.route('/:id').delete(transactionController.destroy);

export default {
  action: '/transactions',
  router,
};
