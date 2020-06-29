import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import AppError from '../errors/AppError';
import ImportTransactionsService from '../services/ImportTransactionsService';

interface TransactionRequest {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

export default class TransactionController {
  async index(req: Request, res: Response) {
    const transactionRepositoy = getCustomRepository(TransactionRepository);

    const transactions = await transactionRepositoy.find({
      relations: ['category'],
    });
    const balance = await transactionRepositoy.getBalance();

    res.json({ transactions, balance });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const transactionRepositoy = getCustomRepository(TransactionRepository);

    const transaction = await transactionRepositoy.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!transaction) throw new AppError('Transaction do not exists!');

    res.json(transaction);
  }

  async create(req: Request, res: Response) {
    const { body: transaction }: { body: TransactionRequest } = req;

    const transactionSave = await new CreateTransactionService().execute(
      transaction,
    );

    res.json(transactionSave);
  }

  async import(req: Request, res: Response) {
    const { path: filePath } = req.file;

    const transactions = await new ImportTransactionsService().execute(
      filePath,
    );

    res.json(transactions);
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;

    await new DeleteTransactionService().execute(id);

    res.status(200).send();
  }
}
