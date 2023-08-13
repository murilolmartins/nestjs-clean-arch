import { Controller } from '@/shared/presentation/contracts/controller'
import { FastifyReply } from 'fastify'

interface NestRequest {
    body?: Record<string, any>
    params?: Record<string, any>
}

export const nestControllerAdapter = <T>(controller: Controller) => {
    return async (request: NestRequest, response: FastifyReply): Promise<T> => {
        const httpRequest = {
            body: request.body ?? {},
            params: request.params ?? {},
        }

        const httpResponse = await controller.handle(httpRequest)

        return response.status(httpResponse.statusCode).send(httpResponse)
    }
}
