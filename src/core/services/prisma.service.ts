import { Injectable, OnModuleInit, OnModuleDestroy, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    constructor() {
        super();
        this.$use(async (params, next) => {
            try {
                return await next(params);
            } catch (error) {
                this.handlePrismaError(error);
            }
        });
    }

    private handlePrismaError(error: any): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle known errors
            switch (error.code) {
                case 'P2002': // Unique constraint failed
                    throw new HttpException(
                        'The record already exists.',
                        HttpStatus.CONFLICT,
                    );
                case 'P2025': // Record not found
                    throw new HttpException(
                        'The requested record was not found.',
                        HttpStatus.NOT_FOUND,
                    );
                // Add more cases for other known error codes as needed
                default:
                    throw new HttpException(
                        `Database error: ${error.message}`,
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
            }
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            // Handle validation errors
            throw new HttpException(
                `Validation error: ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        } else {
            // Unknown error
            throw new HttpException(
                `Unexpected error: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
            
        }
    }
}
