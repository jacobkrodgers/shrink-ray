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

export { getLinkById }