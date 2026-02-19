'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import bcrypt from 'bcryptjs';

const ADMIN_USER = {
    username: 'admin',
    // Hashed password
    passwordHash: '$2b$10$oyLKap3LJaVPJxvx2kemleES8zr6KQI3hV2VnltfcKhxvEx75DWNK',
    name: 'Admin User',
};

const SESSION_COOKIE_NAME = 'auth_session';

export async function loginAction(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const isPasswordValid = await bcrypt.compare(password, ADMIN_USER.passwordHash);

    if (username === ADMIN_USER.username && isPasswordValid) {
        // Set HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE_NAME, 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return { success: true };
    }

    return { success: false, error: 'Invalid username or password' };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    redirect('/login');
}

export async function checkAuthAction() {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    return !!session;
}
