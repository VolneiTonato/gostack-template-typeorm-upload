import fs from 'fs';
import csvParse from 'csv-parse';
import { getRepository, In, getCustomRepository } from 'typeorm';
import TransactionRepositoy from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface TransactionImportI {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const contacts = fs.createReadStream(filePath);

    const categoryRepository = getRepository(Category);

    const transactionRepository = getCustomRepository(TransactionRepositoy);

    const parses = csvParse({ from_line: 2 });

    const parseCSV = contacts.pipe(parses);

    const transactions: TransactionImportI[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const categoriesExists = await categoryRepository.find({
      where: {
        title: In(categories.map(category => category)),
      },
    });

    const existsCategoriesTitles: string[] = categoriesExists.map(
      (category: Category) => category.title,
    );

    const addCategoriesTitles = categories
      .filter(category => !existsCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoryRepository.create(
      addCategoriesTitles.map(category => ({
        title: category,
      })),
    );

    await categoryRepository.save(newCategories);

    const finalCategories = [...newCategories, ...categoriesExists];

    const createTransaction = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepository.save(createTransaction);

    return createTransaction;
  }
}

export default ImportTransactionsService;
