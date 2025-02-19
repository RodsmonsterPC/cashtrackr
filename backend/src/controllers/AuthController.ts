
import type { Request, Response } from "express"
import User from "../models/Users"
import { hashPassword } from "../util/auth"
import { generateToken } from "../util/token"
import { AuthEmail } from "../email/AuthEmail"

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {

    const {email, password} = req.body

    //Prevenir duplicados

    const userExists = await User.findOne({where: {email}})

    if(userExists){
        const error = new Error('Un usuario con ese email ya esta registrado')
         res.status(409).json({error: error.message})
         return
    }
  try {

    const user = new User(req.body)

    user.password = await hashPassword(password)
    user.token = generateToken()
    await user.save()

    await AuthEmail.sendConfirmationEmail({
      name: user.name,
      email: user.email,
      token: user.token
    })

    res.json('Cuenta creada Correctamente')
  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'Hubo un error'})
  }

}


}
