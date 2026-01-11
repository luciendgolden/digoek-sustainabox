import UserRepository from '../repositories/userRepository';
import type { Preference, User } from '../models';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ProductRepository from '../repositories/productRepository';
import ApiRepository from '../repositories/apiRepository';

class UserService {
    private static readonly JWT_SECRET = process.env.JWT_SECRET ?? 'secret';

    private static readonly SALT_ROUNDS = process.env.SALT_ROUNDS ?? 10;

    private readonly userRepository: UserRepository;
    private readonly productRepository: ProductRepository;
    private readonly apiRepository: ApiRepository;

    constructor () {
        this.userRepository = new UserRepository();
        this.productRepository = new ProductRepository();
        this.apiRepository = new ApiRepository();
    }

    async deletePreferences (userId: string): Promise<any | null> {
        // Find the user
        const user = await this.userRepository.getUserById(userId);

        if (user == null) {
            throw new Error('User not found');
        }

        if (user.role.type !== 'user') {
            throw new Error('Only users can delete their preferences');
        }

        // Delete preferences
        const deletedPreferences = await this.userRepository.deletePreferences(userId);

        if (deletedPreferences == null) {
            throw new Error('Could not delete user preferences');
        }

        return deletedPreferences;
    }

    async updatePreferences (userId: string, items: any): Promise<any | null> {
        // Find the user
        const user = await this.userRepository.getUserById(userId);

        if (user == null) {
            throw new Error('User not found');
        }

        if (user.role.type !== 'user') {
            throw new Error('Only users can update their preferences');
        }

        // Reference categoryId
        items.forEach((preference: any) => {
            preference.categoryId = new ObjectId(String(preference.categoryId));
        });

        // Update user preferences
        const preferences = user.preferences;

        items.forEach((item: Preference) => {
            const index = preferences.findIndex(preference => preference.categoryId.toString() === item.categoryId.toString());
            if (index === -1) {
                preferences.push(item);
            } else {
                preferences[index] = item;
            }
        });

        // Check if preferences are valid
        const validPreferences = await this.userRepository.validatePreferences(preferences);

        if (!validPreferences) {
            throw new Error('Invalid preferences');
        }

        // Update preferences
        const updatedPreferences = await this.userRepository.updatePreferences(userId, preferences);

        if (updatedPreferences == null) {
            throw new Error('Could not update user preferences');
        }

        return updatedPreferences;
    }

    async recommendAboBox (userId: string): Promise<any | null> {
        // Fetch user preferences with weights
        const user = await this.userRepository.getUserById(userId);
        const userPreferences = user?.preferences ?? [];

        if (user == null) {
            throw new Error('User not found');
        }

        // Map preferences to products with weights
        const preferenceMap = userPreferences.reduce((acc: Record<string, number>, pref) => {
            acc[pref.categoryId.toString()] = pref.preferenceLevel;
            return acc;
        }, {});

        // Get all products to match preferences against
        const allProducts = await this.productRepository.getAllProducts();

        if (allProducts == null) {
            throw new Error('No products found');
        }

        // Calculate weights for each product based on user preferences
        const weightedProducts = allProducts?.map(product => {
            const weight = product.categories.reduce((total, categoryId) => {
                return total + (preferenceMap[categoryId.toString()] ?? 0);
            }, 0);
            return { ...product, weight };
        });

        // Sort products by weight
        weightedProducts.sort((a, b) => b.weight - a.weight);

        // Match AboBox
        const aboboxes = await this.apiRepository.getAboboxesDetails();

        if (aboboxes == null) {
            throw new Error('No aboboxes found');
        }

        // Calculate weights for each abobox based on products
        const weightedAboBoxes = aboboxes.map(abobox => {
            const weight = abobox.products.reduce((total: number, product: any) => {
                const weightedProduct = weightedProducts.find(wp => wp._id.toString() === product._id.toString());
                return total + (weightedProduct?.weight ?? 0);
            }, 0);
            return { ...abobox, weight };
        });

        // Sort aboboxes by weight
        weightedAboBoxes.sort((a, b) => b.weight - a.weight);

        return { userId, recommended_boxes: weightedAboBoxes };
    }

    async login (obj: any): Promise<any | null> {
        const email: string = obj.email;
        const password: string = obj.password;

        const user = await this.userRepository.findByEmail(email);

        if (user == null) {
            throw new Error('User not found');
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ id: user._id, role: user.role.type }, String(UserService.JWT_SECRET), { expiresIn: '24h' });

        const fullUserDetails = await this.userRepository.getUserDetailsById(user._id.toString());

        return { status: 'success', token, user: fullUserDetails[0] };
    }

    async register (user: User): Promise<{ _id: ObjectId } | null> {
        // Check if user already exists
        const existingUser = await this.userRepository.userExists(user.email);

        if (existingUser) {
            throw new Error('User already exists');
        }

        // Check if role is not present if so set to user
        if (user.role == null) {
            user.role = { type: 'user', description: 'Regular user with access to subscription boxes.' };
        }

        // Set subscription status to false if not present
        if (user.subscriptionStatus == null) {
            user.subscriptionStatus = false;
        }

        // Reference categoryId

        user.preferences.forEach((preference) => {
            preference.categoryId = new ObjectId(preference.categoryId);
        });

        // Check if preferences are valid
        const validPreferences = await this.userRepository.validatePreferences(user.preferences);

        if (!validPreferences) {
            throw new Error('Invalid preferences');
        }

        // Hash the password
        user.password = bcrypt.hashSync(user.password, Number(UserService.SALT_ROUNDS));

        // Insert the user
        const newUser = await this.userRepository.insertOneUser(user);

        return newUser;
    }

    async getAllUsers (): Promise<any[] | null> {
        return await this.userRepository.getAllUsersDetails();
    }

    async getUserById (userId: string): Promise<any | null> {
        const user = await this.userRepository.getUserDetailsById(userId);

        return user;
    }

    async updateUser (userId: string, user: User): Promise<any | null> {
        // Hash the password
        if (user.password != null) {
            user.password = bcrypt.hashSync(user.password, Number(UserService.SALT_ROUNDS));
        }
        const updatedUser = await this.userRepository.updateOneUser(userId, user);

        return updatedUser;
    }

    async deleteUser (userId: string): Promise<any | null> {
        const deletedUser = await this.userRepository.deleteOneUser(userId);
        return deletedUser;
    }
}

export default UserService;
