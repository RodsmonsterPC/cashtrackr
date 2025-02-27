import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthController } from "../../controllers/AuthController";
import User from "../../models/Users";
import * as authUtils from '../../util/auth'
import * as jwtUtils from '../../util/jws'
import { check } from "express-validator";
import { toWeb } from "form-data";

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

describe('Authentiction - Account Confirmation with Token', () => {

    it('Should display error if token is empty or token is not valid', async () => {
        const response = await request(server)
                                        .post('/api/auth/confirm-account')
                                        .send({
                                            token: 'Not_valid'
                                        })

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Token no válido')
    })

    it('Should display error if token doesn´t exists', async () => {
        const response = await request(server)
                                        .post('/api/auth/confirm-account')
                                        .send({
                                            token: '123456'
                                        })

        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Token no válido')
       expect(response.status).not.toBe(200)
    })

    it('Should confirm account with a valid token', async () => {

        const token = globalThis.cashTrackrConfirmationToken
        const response = await request(server)
                                        .post('/api/auth/confirm-account')
                                        .send({ token })

       expect(response.statusCode).toBe(200)
       expect(response.body).toBe("Cuenta confirmada correctamente")
       expect(response.status).not.toBe(401)
    })
})

describe('Authentication - Login', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('Should display validation errors when the form is empty', async () => {
        const response = await request(server)
                                        .post('/api/auth/login')
                                        .send({})

        const loginMock = jest.spyOn(AuthController, 'login')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.body.errors).not.toHaveLength(1)
        expect(loginMock).not.toHaveBeenCalled()
    })

    it('Should return 400 bad request when the email is invalid', async () => {
        const response = await request(server)
                                        .post('/api/auth/login')
                                        .send({
                                            "password": "password",
                                            "email": "not_valid"
                                        })

        const loginMock = jest.spyOn(AuthController, 'login')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Email no valido')

        expect(response.body.errors).not.toHaveLength(2)
        expect(loginMock).not.toHaveBeenCalled()
    })

    it('Should return 400 bad request when the email is invalid', async () => {
        const response = await request(server)
                                        .post('/api/auth/login')
                                        .send({
                                            "password": "password",
                                            "email": "user@test.com"
                                        })

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Usuario no encontrado')

        expect(response.status).not.toBe(200)
    })

    it('Should return 403 error if the user account is not confirmed', async () => {


        (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed:false,
                password: 'HashedPassword',
                email: 'user_not_confirmed@test.com'
            })
        const response = await request(server)
                                        .post('/api/auth/login')
                                        .send({
                                            "password": "password",
                                            "email": "user_not_confirmed@test.com"
                                        })

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('La cuenta no ha sido confirmada')

        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)
    })

    it('Should return 403 error if the user account is not confirmed', async () => {


       const userData = {
                id: 1,
                confirmed:false,
                password: 'HashedPassword',
                email: 'user_not_confirmed@test.com'
            };

        await request(server).post('/api/auth/create-account').send(userData)


        const response = await request(server)
                                        .post('/api/auth/login')
                                        .send({
                                            "password": userData.password,
                                            "email": userData.email
                                        })

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('La cuenta no ha sido confirmada')

        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)
    })

    it('Should return 401 error if the password is incorrect', async () => {


      const findOne =  (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed:true,
                password: 'HashedPassword'
            })

         const checkPassword =   jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(false)

        const response = await request(server)
                                        .post('/api/auth/login')
                                        .send({
                                            "password": "wrongPassword",
                                            "email": "test@test.com"
                                        })

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Password incorrecto')

        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(403)

        expect(findOne).toHaveBeenCalledTimes(1)
        expect(checkPassword).toHaveBeenCalledTimes(1)
    })

    it('Should return 401 error if the password is incorrect', async () => {


        const findOne =  (jest.spyOn(User, 'findOne') as jest.Mock)
              .mockResolvedValue({
                  id: 1,
                  confirmed:true,
                  password: 'HashedPassword'
              })
  
           const checkPassword =   jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(true)

           const generateJWT = jest.spyOn(jwtUtils, 'generateJWT').mockReturnValue('jwt_token')
  
          const response = await request(server)
                                          .post('/api/auth/login')
                                          .send({
                                              "password": "correctPassword",
                                              "email": "test@test.com"
                                          })

        expect(response.status).toBe(200)
        expect(response.body).toEqual('jwt_token')

        expect(findOne).toHaveBeenCalled()
        expect(findOne).toHaveBeenCalledTimes(1)

        expect(checkPassword).toHaveBeenCalled()
        expect(checkPassword).toHaveBeenCalledTimes(1)
        expect(checkPassword).toHaveBeenCalledWith('correctPassword', 'HashedPassword')

        expect(generateJWT).toHaveBeenCalled()
        expect(generateJWT).toHaveBeenCalledTimes(1)
        expect(generateJWT).toHaveBeenCalledWith(1)


      })
})


let jwt: string

async function authenticateUser(){
    const response = await request(server)
    .post('/api/auth/login')
    .send({
        email: 'test@test.com',
        password: '12345678'
    })
jwt = response.body

expect(response.status).toBe(200)
}

describe('GET /api/budgets', () => {



    beforeAll(() => {
        jest.restoreAllMocks() //restaurar las funciones de los jes.spy a su implementacion original
    })

    beforeAll(async () => {
           await authenticateUser()
    })

    it('should reject unathenticate access to budgets without a jwt', async () => {
        const response = await request(server)
                                       .get('/api/budgets')

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No autorizado')
    })

    it('should allow authenticate to budgets with a valid jwt', async () => {
        const response = await request(server)
                                       .get('/api/budgets')
                                        .auth('not_valid', {type: 'bearer'})

        
        expect(response.status).toBe(500)
        expect(response.body.error).not.toBe('Token no valido')
    })

    it('should allow authenticate to budgets with a valid jwt', async () => {
        
        const response = await request(server)
                                       .get('/api/budgets/1')
                                        .auth(jwt, {type: 'bearer'})

        
        expect(response.body).toHaveLength(0)
        expect(response.status).not.toBe(401)
        expect(response.body.error).not.toBe('No autorizado')
    })

    
})

describe('POST /api/budgets', () => {


    beforeAll(async () => {
          await authenticateUser()
    })

    it('should reject authenticate post request to budgets without a jwt', async () => {
        const response = await request(server)
                                       .post('/api/budgets')
                                       
  
        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No autorizado')
    })

    it('should display validation when the form is submitted with invalid data', async () => {
        const response = await request(server)
                                       .post('/api/budgets')
                                       .auth(jwt, {type: 'bearer'})
                                       .send({})
                                       
  
        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(4)
    })
  
})


describe('Get /api/budgets/:id', () => {
    beforeAll(async () => {
        await authenticateUser()
  })

  it('should reject authenticate get request to budget id withour a jwt', async () => {
      const response = await request(server)
                                     .get('/api/budgets/1')
                                     

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('No autorizado')
  })

  it('should return 400 bad request when id is not valid', async () => {
    const response = await request(server)
                                   .get('/api/budgets/not_valid')
                                   .auth(jwt, {type: 'bearer'})
                                   

    expect(response.status).toBe(400)
    expect(response.status).not.toBe(401)
    expect(response.body.error).not.toBe('No autorizado')
    expect(response.body.errors).toBeDefined()
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('Id no válido')
})

it('should return 404 when budget is not found', async () => {
    const response = await request(server)
                                   .get('/api/budgets/300')
                                   .auth(jwt, {type: 'bearer'})
                                   

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Presupuesto no encontrado')
    expect(response.status).not.toBe(400)
    expect(response.status).not.toBe(401)

})

it('should return a single budget by id', async () => {
    const response = await request(server)
                                   .get('/api/budgets/1')
                                   .auth(jwt, {type: 'bearer'})
                                   

    expect(response.status).toBe(200)
    expect(response.status).not.toBe(400)
    expect(response.status).not.toBe(401)
    expect(response.status).not.toBe(404)

})
})


describe('PATCH /api/budgets/:id', () => {
    beforeAll(async () => {
        await authenticateUser()
  })

  it('should reject authenticate patch request to budget id withour a jwt', async () => {
      const response = await request(server)
                                     .patch('/api/budgets/1')
                                     

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('No autorizado')
  })


  it('should display validation errors if the form is empty', async () => {
    const response = await request(server)
                                   .patch('/api/budgets/1')
                                   .auth(jwt, {type: 'bearer'})
                                   .send({})
                                   

    expect(response.status).toBe(400)
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(4)

})

it('should update a budget by id and return a success message', async () => {
    const response = await request(server)
                                   .patch('/api/budgets/1')
                                   .auth(jwt, {type: 'bearer'})
                                   .send({
                                    name: 'Budget update',
                                    amount:300
                                   })
                                   

    expect(response.status).toBe(200)
    expect(response.body).toBe("Presupuesto actualizado correctamente")

})

})