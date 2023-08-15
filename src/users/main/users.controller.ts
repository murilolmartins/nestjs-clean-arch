import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Inject,
    Res,
} from '@nestjs/common'
import { SignupDto } from './dto/signup.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import {
    DeleteUserController,
    GetUserController,
    ListUsersController,
    SignInController,
    SignUpController,
    UpdatePasswordController,
    UpdateUserController,
} from '../presentation/controllers'
import { nestControllerAdapter } from '@/shared/infra/adapters/nest-controller.adapter'
import { FastifyReply } from 'fastify'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { ListUsersDto } from './dto/list-users.dto'

@Controller('users')
export class UsersController {
    @Inject(SignUpController.Controller)
    private signUpController: SignUpController.Controller

    @Inject(SignInController.Controller)
    private signInController: SignInController.Controller

    @Inject(GetUserController.Controller)
    private getUserController: GetUserController.Controller

    @Inject(UpdateUserController.Controller)
    private updateUserController: UpdateUserController.Controller

    @Inject(UpdatePasswordController.Controller)
    private updatePasswordController: UpdatePasswordController.Controller

    @Inject(ListUsersController.Controller)
    private listUsersController: ListUsersController.Controller

    @Inject(DeleteUserController.Controller)
    private deleteUserController: DeleteUserController.Controller

    @Post()
    async create(@Body() signupDto: SignupDto, @Res() response: FastifyReply) {
        return nestControllerAdapter<SignInController.Response>(
            this.signUpController,
        )({ body: signupDto }, response)
    }

    @Post('signin')
    async signin(
        @Body() signinDto: SignInController.Body,
        @Res() response: FastifyReply,
    ) {
        return nestControllerAdapter<SignInController.Response>(
            this.signInController,
        )({ body: signinDto }, response)
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Res() response: FastifyReply) {
        return nestControllerAdapter<GetUserController.Response>(
            this.getUserController,
        )({ params: { id } }, response)
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Res() response: FastifyReply,
    ) {
        return nestControllerAdapter<UpdateUserController.Response>(
            this.updateUserController,
        )({ params: { id }, body: updateUserDto }, response)
    }

    @Patch(':id/password')
    async updatePassword(
        @Param('id') id: string,
        @Body() updatePasswordDto: UpdatePasswordDto,
        @Res() response: FastifyReply,
    ) {
        return nestControllerAdapter<UpdatePasswordController.Response>(
            this.updatePasswordController,
        )({ params: { id }, body: updatePasswordDto }, response)
    }

    @Get()
    async findAll(
        @Body() listUsersDto: ListUsersDto,
        @Res() response: FastifyReply,
    ) {
        return nestControllerAdapter<ListUsersController.Response>(
            this.listUsersController,
        )({ body: listUsersDto }, response)
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Res() response: FastifyReply) {
        return nestControllerAdapter<DeleteUserController.Response>(
            this.deleteUserController,
        )({ params: { id } }, response)
    }
}
