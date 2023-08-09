import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),
    colectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testMatch: ['**/__tests__/**/*.spec.ts'],
}
