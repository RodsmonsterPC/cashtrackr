import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthController } from "../../controllers/AuthController";

describe('Authentication - Create Account', () => {

    it('Should display validation errors when form is empty', async () =>{
        const response = await request(server)
        .post('/api/auth/create-account')
        .send({})

        const createAccountMock= jest.spyOn(AuthController, 'createAccount')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(3)
        expect(createAccountMock).not.toHaveBeenCalled()
    })

    it('Should return 400 when the email is invalid', async () =>{
        const response = await request(server)
        .post('/api/auth/create-account')
        .send({
            "name": "Juan",
            "password": "12345678",
            "email": "not_valid_email"
        })

        const createAccountMock= jest.spyOn(AuthController, 'createAccount')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(createAccountMock).not.toHaveBeenCalled()
        expect(response.body.errors[0].msg).toBe('E-mail no válido')
    })

    it('Should return 400 when the password is less than 8 characters', async () =>{
        const response = await request(server)
        .post('/api/auth/create-account')
        .send({
            "name": "Juan",
            "password": "short",
            "email": "test@test.com"
        })

        const createAccountMock= jest.spyOn(AuthController, 'createAccount')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(createAccountMock).not.toHaveBeenCalled()
        expect(response.body.errors[0].msg).toBe('El password es muy corto, mínimo 8 caracteres')
    })

    it('Should return 201 when all is correct', async () =>{


        const userData ={
                "name": "Juan",
                "password": "12345678",
                "email": "test@test.com"
        }

        const response = await request(server)
        .post('/api/auth/create-account')
        .send(userData)

       

        expect(response.status).toBe(201)
        expect(response.body).not.toHaveProperty('errors')
      
       
    })

    it('Should return 409 conflict when a user is already registered', async () =>{


        const userData ={
                "name": "Juan",
                "password": "12345678",
                "email": "test@test.com"
        }

        const response = await request(server)
        .post('/api/auth/create-account')
        .send(userData)

       

        expect(response.status).toBe(409)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Un usuario con ese email ya esta registrado')
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(201)
        expect(response.body).not.toHaveProperty('errors')
      
       
    })
})