import { Request, Response, NextFunction } from 'express';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || !req.user.roles || !req.user.roles.includes('admin')) {
    return res.status(403).json({
      error: {
        code: 'forbidden',
        message: 'Admin access required',
      },
    });
  }
  next();
}

