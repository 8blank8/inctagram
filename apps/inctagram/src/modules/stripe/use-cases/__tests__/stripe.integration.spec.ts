import { CreateAppForE2eTestsMain } from "@inctagram/src/utils/test/create-and-configure-app-for-e2e"
import { TestSeeder } from "@libs/tests/test-seeder"
import { TestUtils } from "@libs/tests/test-utils"
import { INestApplication } from "@nestjs/common"
import { TestingModule } from "@nestjs/testing"
import { QueryRunner } from "typeorm"
import { PaymentSystenType, TermSubscriptionType } from "@libs/enum/enum"
import { PaymentSubscriptionUseCase } from "@inctagram/src/modules/stripe/use-cases/create/payment-subscription.use-case"
import { PaymentSubscriptionCommand } from "@inctagram/src/modules/stripe/use-cases/create/dto/payment-subscription.command"

describe('user integration tests', () => {

    let _httpServer
    let app: INestApplication
    let _queryRunner: QueryRunner
    let manager
    let moduleRef: TestingModule
    let testSeeder: TestSeeder

    let paymentSubscriptionUseCase: PaymentSubscriptionUseCase

    beforeAll(async () => {

        ({
            httpServer: _httpServer,
            app: app,
            queryRunner: _queryRunner,
            manager: manager,
            moduleRef: moduleRef
        } = await CreateAppForE2eTestsMain()
        )
        testSeeder = new TestSeeder(manager)

        paymentSubscriptionUseCase = moduleRef.get<PaymentSubscriptionUseCase>(PaymentSubscriptionUseCase)

        await app.init()
        await TestUtils.dropDb(_queryRunner)
    })

    it('payment subscription on 1 day is success', async () => {

        const user = await testSeeder.createUser(testSeeder.getUserDto(1))

        const command: PaymentSubscriptionCommand = {
            paymentSystem: PaymentSystenType.STRIPE,
            term: TermSubscriptionType.ONE_DAY,
            userId: user.id,
            isSubscription: true
        }

        const res = await paymentSubscriptionUseCase.execute(command)

        expect(res.isSuccess).toBe(true)
        expect(res.value.url).not.toBe(null)

        console.log(res.value.url)

        const command1: PaymentSubscriptionCommand = {
            paymentSystem: PaymentSystenType.STRIPE,
            term: TermSubscriptionType.ONE_DAY,
            userId: user.id,
            isSubscription: true
        }

        const res1 = await paymentSubscriptionUseCase.execute(command1)
        console.log(res1.value.url)

    })
})