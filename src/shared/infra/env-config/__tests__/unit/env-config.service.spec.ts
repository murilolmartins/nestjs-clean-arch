import { Test, TestingModule } from '@nestjs/testing'
import { EnvConfigService } from '../../env-config.service'
import { EnvConfigModule } from '../../env-config.module'

describe('EnvConfigService unit test', () => {
    let sut: EnvConfigService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [EnvConfigModule.forRoot()],
            providers: [EnvConfigService],
        }).compile()

        sut = module.get<EnvConfigService>(EnvConfigService)
    })

    it('should return app port from test env', () => {
        expect(sut.getAppPort()).toBe(3000)
    })

    it('should return node env from test env', () => {
        expect(sut.getNodeEnv()).toBe('test')
    })
})
