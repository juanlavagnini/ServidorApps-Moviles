import { Request, Response, NextFunction } from 'express';

export function validatePassword(req: Request, res: Response, next: NextFunction) {
  const { password } = req.body;

  if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).send({ errors: [{ message: "Password must be at least 8 characters long and include at least one uppercase letter and one number." }] });
  }

  next();
}


export function validationEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
  
    // Expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        errors: [{ message: "Invalid email format." }],
      });
    }
  
    // Si el formato es válido, continúa con la siguiente función
    next();
  }