import { Router } from 'express';
import nodemailer from 'nodemailer';
import { NodemailerMailAdapter } from './adapters/nodemailer/nodemailer-mail-adapter';
import { prisma } from './prisma';
import { PrismaFeedbacksRepository } from './repositories/prisma/prisma-feedback-repository';
import { SubmitFeedbackUseCase } from './use-cases/submit-feedback-use-case';

const routes = Router();

routes.post('/feedbacks', async (req, res) => {
    const { type, comment, screenshot } = req.body;


    try {

        const primaFeedbacksRepository = new PrismaFeedbacksRepository()
        const nodemailerMailAdapter = new NodemailerMailAdapter()

        const submitFeedbackUseCase = new SubmitFeedbackUseCase(
            primaFeedbacksRepository,
            nodemailerMailAdapter,
        )

        await submitFeedbackUseCase.execute({
            type,
            comment,
            screenshot,
        })

        return res.status(201).send()
    } catch (err) {
        console.log(err)
        return res.status(400).send()

    }

});

export default routes;