import { Request, Response } from 'express';
import { createLinkId, createNewLink, deleteLinkById, getLinkById, getLinksByUserId, getLinksByUserIdForOwnAccount, updateLinkVisits } from '../models/LinkModel'
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

async function getOriginalUrl(req: Request, res: Response): Promise<void> {
    const { targetLinkId } = req.params;
    const link = await getLinkById(targetLinkId)
    if (!(link)) {
        res.sendStatus(404);
        return;
    }

    try{
      await updateLinkVisits(link);
      res.redirect(301, link.originalURL);
    } catch (err) {
      console.error(err);
      const databaseErrorMessage = parseDatabaseError(err);
      res.status(500).json(databaseErrorMessage);
  }
}

async function getUserLinks(req: Request, res: Response): Promise<void> {
    const { userId } = req.session.authenticatedUser;
    const {targetUserId} = req.params;

    if (!(userId === targetUserId)){
      const links = await getLinksByUserId(userId);
      res.json(links);
      return;
    }

    try {
      const links = await getLinksByUserIdForOwnAccount(userId);
      res.json(links);
    } catch (err) {
      console.error(err);
      const databaseErrorMessage = parseDatabaseError(err);
      res.status(500).json(databaseErrorMessage);
    }

}

async function deleteLink(req: Request, res: Response): Promise<void> {
    const {userId, isAdmin} = req.session.authenticatedUser;
    const {targetUserId, targetLinkId} = req.params;

    if (!(userId === targetUserId || isAdmin)){
      res.sendStatus(401);
      return;
  }

    try {
      await deleteLinkById(targetLinkId);
      res.sendStatus(201);
  } catch (err) {
      console.error(err);
      const databaseErrorMessage = parseDatabaseError(err);
      res.status(500).json(databaseErrorMessage);
  }
}
export { shortenUrl, getOriginalUrl, getUserLinks, deleteLink };
