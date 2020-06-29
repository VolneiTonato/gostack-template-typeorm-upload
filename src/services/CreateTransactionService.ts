import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface TransactionServiceI {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute(param: TransactionServiceI): Promise<Transaction> {
    if (!['income', 'outcome'].includes(param.type))
      throw new AppError(`type is mandatory and needs to be income or outcome`);

    const transactionRepository = getCustomRepository(TransactionRepository);

    const { total } = await transactionRepository.getBalance();

    if (param.value <= 0)
      throw new AppError(
        `It is not allowed to carry out an operation with a negative or zero value`,
      );

    if (param.type === 'outcome' && total < param.value)
      throw new AppError(`You do not have enough balance`);

    const categoryRepositoy = getRepository(Category);

    let category = await categoryRepositoy.findOne({
      where: { title: param.category },
    });

    if (!category) {
      category = categoryRepositoy.create({ title: param.category });
      await categoryRepositoy.save(category);
    }

    const transactionModel = transactionRepository.create({
      title: param.title,
      category_id: category.id,
      type: param.type,
      value: param.value,
    });

    await transactionRepository.save(transactionModel);

    return transactionModel;
  }
}

export default CreateTransactionService;
