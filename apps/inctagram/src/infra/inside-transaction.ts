import { Result } from "../../../../libs/core/result";
import { DataSource, EntityManager } from "typeorm";

type InsideTransactionReturnType<O> = Promise<Result<O>>;

type OperationInsideTransaction<I, O> = (
    inputData: I,
    manager: EntityManager
) => InsideTransactionReturnType<O>;

export class TransactionDecorator {
    constructor(
        private readonly dataSource: DataSource,
    ) { }

    public async doOperation<D, R>(
        data: D,
        operation: OperationInsideTransaction<D, R>,
    ): InsideTransactionReturnType<R> {

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const res = await operation(data, queryRunner.manager);

            if (res.isSuccess) {
                await queryRunner.commitTransaction();
            } else {
                await queryRunner.rollbackTransaction();
            }

            return res;
        } catch (e) {
            console.log('in TransactionDecoreator catch e', e);
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }
}
