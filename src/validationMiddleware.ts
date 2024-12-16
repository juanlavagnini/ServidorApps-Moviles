import { Request, Response, NextFunction } from 'express';

export function validatePassword(req: Request, res: Response, next: NextFunction) {
  const { password } = req.body;

  if (!password || password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    console.log('pswd doesnt match')
    return res.status(400).send(
        { errors: [{ 
            field: "password",
            message: "Password must be at least 8 characters long and include at least one uppercase letter and one number."
         }] 
    });
  }

  next();
}


export function validationEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
  
    // Expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        errors: [{ 
            field: "email",
            message: "Invalid email format." }],
      });
    }
  
    // Si el formato es válido, continúa con la siguiente función
    next();
  }

  export function validateQuantity(req: Request, res: Response, next: NextFunction) {
    const { quantity } = req.body;
  
    // Validar que `quantity` esté definido, sea un número y sea mayor que 0
    if (quantity == null || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        errors: [
          {
            field: "quantity",
            message: "Quantity must be a number greater than 0.",
          },
        ],
      });
    }
  
    // Continuar si la validación pasa
    next();
  }

  export function validateProductName(req: Request, res: Response, next: NextFunction) {
    const { name } = req.body;
  
    // Validar que `quantity` esté definido, sea un número y sea mayor que 0
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        errors: [
          {
            field: "name",
            message: "You must complete the Product Name field.",
          },
        ],
      });
    }
  
    // Continuar si la validación pasa
    next();
  }
  export function validateProductBrand(req: Request, res: Response, next: NextFunction) {
    const { brand } = req.body;
  
    // Validar que `quantity` esté definido, sea un número y sea mayor que 0
    if (!brand || typeof brand !== 'string' || brand.trim() === '') {
      return res.status(400).json({
        errors: [
          {
            field: "brand",
            message: "You must complete the Product Brand field.",
          },
        ],
      });
    }
  
    // Continuar si la validación pasa
    next();
  }