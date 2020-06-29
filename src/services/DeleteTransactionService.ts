import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transactionModel = await transactionRepository.findOne({
      where: { id },
    });

    if (!transactionModel) throw new AppError(`Transaction dos not exits`);

    await transactionRepository.remove(transactionModel);

    Promise.resolve();
  }
}

export default DeleteTransactionService;
