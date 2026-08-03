'use client'
import AuthForm from "./AuthForm";
import { useAuthRedirect } from "./useAuthRedirect";

const Auth = () => {
    useAuthRedirect();

    return (
        <section className="flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md rounded-lg bg-background-card border border-card-border shadow-sm p-8">
                <AuthForm />
            </div>
        </section>
    );
};

export default Auth;
