import type { Request, Response } from "express";
import User from "../models/Users";
import { checkPassword, hashPassword } from "../util/auth";
import { generateToken } from "../util/token";
import { AuthEmail } from "../email/AuthEmail";
import { generateJWT } from "../util/jws";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    //Prevenir duplicados

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      const error = new Error("Un usuario con ese email ya esta registrado");
      res.status(409).json({ error: error.message });
      return;
    }
    try {
      const user = await User.create(req.body);

      user.password = await hashPassword(password);
      const token = generateToken();

      if (process.env.NODE_ENV !== "production") {
        globalThis.cashTrackrConfirmationToken = token;
      }

      user.token = token;
      await user.save();

      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      });

      res.status(201).json("Cuenta creada Correctamente");
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body;

    const user = await User.findOne({ where: { token } });

    if (!user) {
      const error = new Error("Token no válido");
      res.status(401).json({ error: error.message });
      return;
    }
    user.confirmed = true;
    user.token = null;

    await user.save();
    res.json("Cuenta confirmada correctamente");
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    //Validar si usuario existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }

    if (!user.confirmed) {
      const error = new Error("La cuenta no ha sido confirmada");
      res.status(403).json({ error: error.message });
      return;
    }

    const isPasswordCorrect = await checkPassword(password, user.password);

    if (!isPasswordCorrect) {
      const error = new Error("Password incorrecto");
      res.status(401).json({ error: error.message });
      return;
    }

    const token = generateJWT(user.id);
    res.json(token);
  };

  static forgotPassword = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    //Validar si usuario existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("Usuario no encontrado");
      res.status(409).json({ error: error.message });
      return;
    }

    user.token = generateToken();
    await user.save();

    await AuthEmail.sendPasswordResetToken({
      name: user.name,
      email: user.email,
      token: user.token,
    });

    res.json("Revisa tu email, para más instrucciones");
  };

  static validateToken = async (req: Request, res: Response) => {
    const { token } = req.body;

    const tokenExists = await User.findOne({ where: { token } });

    if (!tokenExists) {
      const error = new Error("Token no válido");
      res.status(404).json({ error: error.message });
      return;
    }

    res.json("Token válido, asigne un nuevo password");
  };

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ where: { token } });

    if (!user) {
      const error = new Error("Token no válido");
      res.status(404).json({ error: error.message });
      return;
    }

    //Asignar el nuevo password

    user.password = await hashPassword(password);
    user.token = null;

    await user.save();

    res.json("El password se modificó correctamente");
  };

  static user = async (req: Request, res: Response) => {
    res.json(req.user);
  };
  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;

    const { id } = req.user;

    const user = await User.findByPk(id);

    const isPasswordCorrect = await checkPassword(password, user.password);

    if (!isPasswordCorrect) {
      const error = new Error("EL pasword actual es incorrecto");
      res.status(401).json({ error: error.message });
      return;
    }

    res.json("Password correcto");
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;

    const { id } = req.user;

    const user = await User.findByPk(id);

    const isPasswordCorrect = await checkPassword(
      current_password,
      user.password
    );

    if (!isPasswordCorrect) {
      const error = new Error("El pasword actual es incorrecto");
      res.status(401).json({ error: error.message });
      return;
    }

    user.password = await hashPassword(password);
    await user.save();

    res.json("El password se actualizo correctamente");
  };

  static updateUser = async (req: Request, res: Response) => {
    
    const { name, email } = req.body;
    
    try {

      //Prevenir duplicados

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser && existingUser.id !== req.user.id) {
        const error = new Error("Ese email, ya esta registrado por otro usuario");
        res.status(409).json({ error: error.message });
        return;
      }
      
      await User.update({email, name}, {
        where: {id: req.user.id}
      })

      res.json("Los datos se actualizaron correctamente");
    } catch (error) {
      res.status(500).json("Hubo un error");
    }
  };
}
