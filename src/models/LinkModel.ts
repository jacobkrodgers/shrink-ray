import { createHash } from 'crypto';
import { AppDataSource } from '../dataSource';
import { Link } from '../entities/Link';

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

export { getLinkById, createLinkId }