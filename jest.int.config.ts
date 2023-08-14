import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

export default {
    moduleFileExtensions: ['js', 'json', 'ts'],
    testEnvironment: 'node',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testRegex: '.*\\.int-spec\\.(t|j)s$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
}
