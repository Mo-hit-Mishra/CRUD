import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import User from '../models/user.model';
import { generateRandomToken } from '../genToken/tokenUtils';
import nodemailer from 'nodemailer';

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ fullname: fullName, username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    // Secret key for JWT
    const secretKey = process.env.SECRET_KEY; 

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey , {
      expiresIn: '1d', // Token expiration time (adjust as needed)
    });

    res.json({ token, data: user, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get user by ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Find user by ID in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


  // Update user by ID
  const updateUserById = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const { fullname, username, email, password } = req.body;

      // Find user by ID in the database
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user fields
      user.fullname = fullname || user.fullname;
      user.username = username || user.username;
      user.email = email || user.email;
      user.password = password || user.password;

      // Save the updated user to the database
      await user.save();

      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      console.error('Error updating user by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete user by ID
  const deleteUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Find user by ID in the database and remove it
    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    console.error('Error deleting user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Generate a unique reset token
    const resetToken = generateRandomToken();

    // TODO: Save the resetToken and its expiration time in the user's document in the database.
    // You might want to add a field like 'resetToken' and 'resetTokenExpiration' to the User model.

    // For example:
    // user.resetToken = resetToken;
    // user.resetTokenExpiration = new Date(Date.now() + 3600000); // Token expires in 1 hour
    // await user.save();

    // Send the reset token to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'datapirates0411@gmail.com',
        pass: 'caqe rvjs rgzy fdbb', // Replace with your email password
      },
    });

    const htmtBody = `<!-- reset-password-email.html -->

    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
    
      <h2>Password Reset</h2>
      <p>Hello,</p>
      <p>You have requested to reset your password. Please follow the instructions below:</p>
    

        <li>Click on the following link to reset your password:</li>
        <li>If you did not request a password reset, you can ignore this email.</li>
        <a href="${process.env.xyz}+${resetToken}" target="_blank">Reset Password</a> 

    
      <p>Thank you!</p>
    
    </body>
    </html>
    `
    const existUser = await User.findOne({ email });
    if(!existUser){
      res.status(400).json({ error: 'User Not found' });
    }else{
      existUser.resetToken = resetToken;
      existUser.save();
    }


    

    const mailOptions = {
      from: 'datapirates0411@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Your password reset token is: ${resetToken}`,
      html: htmtBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send reset email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ message: 'Password reset initiated. Check your email for further instructions.' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};
const handleResetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const {token} = req.params;
    console.log(token);
    

    // Find the user by email and reset token
    const user = await User.findOne({ email, token });

    if (!user) {
      res.status(404).json({ error: 'Invalid reset token or user not found' });
      return;
    }

    // TODO: Validate the reset token expiration time if you saved it in the user's document

    // Set the new password and clear the reset token
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export {login,registerUser,updateUserById,deleteUserById,getUserById, resetPassword,handleResetPassword};
