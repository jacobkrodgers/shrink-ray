import { Request, Response } from 'express';
import { createLinkId, createNewLink } from '../models/LinkModel'
import { getUserById } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function shortenUrl(req: Request, res: Response): Promise<void> {

    if (!(req.session.isLoggedIn)) {
        res.sendStatus(401);
        return;
    }

    const { userId } = req.session.authenticatedUser;
    const user = await getUserById(userId)

    if (!user) {
        res.sendStatus(404);
        return;
    }

    if (!(user.isAdmin || user.isPro) && user.links.length === 5) {
        res.sendStatus(401);
        return;
    }

    const { originalUrl } = req.body as NewLinkRequest;
    const linkId = createLinkId(originalUrl, userId)

    try {
        await createNewLink(originalUrl, linkId, user);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}

export { shortenUrl };