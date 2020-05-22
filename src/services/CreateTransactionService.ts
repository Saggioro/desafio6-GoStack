// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'outcome' | 'income';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // TODO
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionsRepository.getBalance();
    if (type === 'outcome') {
      if (value > balance.total) {
        throw new AppError('not enough founds', 400);
      }
    }
    const categoryRepository = getRepository(Category);
    let sameCategory = await categoryRepository.findOne({
      where: { title: category },
    });
    if (!sameCategory) {
      sameCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(sameCategory);
    }

    const transaction = await transactionsRepository.save({
      title,
      value,
      type,
      category_id: sameCategory.id,
    });

    return transaction;
  }
}

export default CreateTransactionService;
