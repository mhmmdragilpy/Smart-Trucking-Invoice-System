import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
    try {
        const userEmail = "admin@tml.com";
        const password = "admintml";
        const name = "Admin TML";

        // Check if user already exists
        // better-auth doesn't have a direct "findUser" in the public API easily accessible without detailed docs, 
        // but signUp will fail if email is taken usually.

        // We can use the auth.api.signUpEmail
        // It requires a request-like context or we can just call it.
        // For better-auth v1+, we might need to conform to their API structure.

        // Let's try calling the internal sign-up 
        const res = await auth.api.signUpEmail({
            body: {
                email: userEmail,
                password: password,
                name: name,
            },
            headers: await headers()
        });

        if (!res || !res.user) {
            return NextResponse.json({
                success: false,
                message: "Failed to create user or user already exists.",
                error: res
            });
        }

        return NextResponse.json({
            success: true,
            message: "Admin user created successfully",
            email: userEmail
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Error seeding user",
            error: error.message
        });
    }
}
