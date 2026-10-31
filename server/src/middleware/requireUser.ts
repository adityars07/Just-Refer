import { Request, Response, NextFunction } from 'express';
import { User } from '../../../shared/types.js';
import { userRepo } from '../repo/userRepo.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function requireUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization || '';
    const isDemo = req.headers['x-demo-user'] === 'true' || req.query.demo === 'true';

    // If no auth header and not explicit demo mode, return 401
    if (!authHeader && !isDemo) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Not logged in. Please log in or provide authentication token.',
        },
      });
    }

    // If token provided or demo mode, load user
    const user = await userRepo.getCurrentUser();
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
