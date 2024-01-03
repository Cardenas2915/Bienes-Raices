import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos

    //Enviar EMAIL
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
        <p> Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>
        <p> Tu cuenta ya casi esta lista, solo debes confirmarla en el siguiente enlace:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a>
        </p>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje </p>
        `
    })
}

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos

    //Enviar EMAIL
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Recupera tu acceso en BienesRaices.com',
        text: 'Recupera tu acceso en BienesRaices.com',
        html: `
        <p> Hola ${nombre}, recupera tu acceso en BienesRaices.com</p>
        <p> Sigue el siguiente enlace para generar un nuevo password:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-Password/${token}">Generar nuevo password</a>
        </p>
        <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje </p>
        `
    })
}

export {
    emailRegistro,
    emailOlvidePassword
}