import { Request, Response } from 'express';
import argon2 from 'argon2';
import { addNewUser, getUserByUsername } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body as AuthRequest;

    if (await getUserByUsername(username)) {
        res.sendStatus(403);
        return;
    }

    const passwordHash = await argon2.hash(password);

    try {
        await addNewUser(username, passwordHash);
        res.redirect('/login')
    } catch (err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}

async function logIn(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body as AuthRequest;

    const user = await getUserByUsername(username);

    if (!user) {
        res.redirect('/login')
        return;
    }

    const { passwordHash } = user;
    if (!(await argon2.verify(passwordHash, password))) {
        res.sendStatus(403);
        return;
    }

    try {
        await req.session.clearSession();
        req.session.authenticatedUser = {
            userId: user.userId,
            username: user.username,
            isPro: user.isPro,
            isAdmin: user.isAdmin,
        }
        req.session.isLoggedIn = true;
        res.redirect('/shrink')
    } catch (err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }

}

export { registerUser, logIn }
