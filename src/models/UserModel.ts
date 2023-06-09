import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

async function getUserByUsername(username: string): Promise<User | null> {
    const user = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.links', 'links')
        .where('user.username = :username', { username })
        .getOne();

    return user;
}

async function getUserById(userId: string): Promise<User | null> {
    const user = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.links', 'links')
        .where('user.userId = :userId', { userId })
        .getOne();

    return user;
}

async function addNewUser(username: string, passwordHash: string): Promise<User | null> {
    let newUser = new User();
    newUser.username = username;
    newUser.passwordHash = passwordHash;

    newUser = await userRepository.save(newUser);

    return newUser;
}

export { getUserByUsername, getUserById, addNewUser }