import express, {Request, Response} from 'express';
const router = express.Router();


function response(_req: Request, res: Response) {
  return res.status(201).json({
    code: 1
  });
}

router.post(
  '/login',
  response
);

export default router;
