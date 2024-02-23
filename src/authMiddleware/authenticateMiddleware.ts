// import { Request, Response, NextFunction } from 'express';
// const jwt = require('jsonwebtoken');

// const authenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {

//   try {
//     const authHeader = req.headers.authorization;

//     if(authHeader){
//         const token = authHeader.split(" ")[1]
//         const user = jwt.verify(token,process.env.SECRET_KEY as string)
//         next()
//     }else{
//         return res.json({"msg": "Autheader not provided"})
//     }
//   } catch (error) {
//     return res.status(401).json({ message: 'Unauthorized - Invalid or expired token' });
//   }
// };

// export default authenticateMiddleware;

import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

const authenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token; // Replace 'yourCookieName' with your actual cookie name

    if (token) {
      const user = jwt.verify(token, process.env.SECRET_KEY as string);
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized - Invalid or expired token' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid or expired token' });
  }
};

export default authenticateMiddleware;


