import { Request, Response } from 'express';
import argon2 from 'argon2';
import { addNewUser, getUserByUsername } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body as AuthRequest;

    if (getUserByUsername(username)) {
        res.sendStatus(403);
        return;
    }

    const passwordHash = await argon2.hash(password);

    try {
        await addNewUser(username, passwordHash);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}

export { registerUser }