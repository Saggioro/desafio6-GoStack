import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionRepository.findOne(id);
    if (!transaction) {
      throw new AppError(`No transactions of id ${id}`);
    }
    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
