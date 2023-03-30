import { createHash } from 'crypto';
import { AppDataSource } from '../dataSource';
import { Link } from '../entities/Link';
import { User } from '../entities/User';

const linkRepository = AppDataSource.getRepository(Link);

async function getLinkById(linkId: string): Promise<Link | null> {
    const link = await linkRepository
        .createQueryBuilder('link')
        .leftJoinAndSelect('link.user', 'user')
        .where('link.linkId = :linkId', { linkId })
        .getOne();

    return link;
}

function createLinkId(originalUrl: string, userId: string): string {
    const md5 = createHash('md5');
    md5.update(originalUrl + userId);
    const urlHash = md5.digest('base64url');
    const linkId = urlHash.slice(0, 9);

    return linkId;
}

async function createNewLink(originalUrl: string, linkId: string, creator: User): Promise<Link> {
    let newLink = new Link();
    newLink.linkId = linkId;
    newLink.originalURL = originalUrl;
    newLink.user = creator;

    newLink = await linkRepository.save(newLink);

    return newLink;
}

async function updateLinkVisits(link: Link): Promise<Link> {
    const updatedLink = link;

    updatedLink.numHits += 1;
    updatedLink.lastAccessedOn = Date();

    await linkRepository
        .createQueryBuilder()
        .update(link)
        .set({ numHits: updatedLink.numHits, lastAccessedOn: updatedLink.lastAccessedOn })
        .where({ linkId: updatedLink.linkId })
        .execute();

    return updatedLink;
}

async function getLinksByUserId(userId: string): Promise<Link[]> {
  const links = await linkRepository
    .createQueryBuilder('link')
    .where({ user: { userId } }) // NOTES: This is how you do nested WHERE clauses
    .leftJoin('link.user', 'user')
    .select(['link.id', 'link.originalURL', 'link.user.userId', 'link.user.username', 'link.user.isAdmin'])
    .getMany();

  return links;
}

async function getLinksByUserIdForOwnAccount(userId: string): Promise<Link[]> {
  const links = await linkRepository
    .createQueryBuilder('link')
    .where({ user: { userId } }) // NOTES: This is how you do nested WHERE clauses
    .leftJoin('link.user', 'user')
    .select(['link.id', 'link.originalURL', 'link.numHits', 'link.lastAccessedOn', 'link.originalURL', 'link.user.userId', 'link.user.username', 'link.user.isPro', 'link.user.isAdmin'])
    .getMany();

  return links;
}

async function deleteLinkById(linkId: string): Promise<void> {
  await linkRepository
    .createQueryBuilder('link')
    .delete()
    .where('linkId = :linkId', { linkId })
    .execute();
}

export { getLinkById, createLinkId, createNewLink, updateLinkVisits, getLinksByUserId, getLinksByUserIdForOwnAccount, deleteLinkById }
