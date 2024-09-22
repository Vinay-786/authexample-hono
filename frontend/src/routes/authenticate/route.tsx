import TabSwticher from "@/components/TabSwitchter";
import SignInForm from "./-SignInForm";
import SignUpForm from "./-SignUpForm";
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/authenticate')({
    component: Authenticate
})

function Authenticate() {
    return (
        <div className="relative flex w-full h-screen bg-background">
            <div className="max-w-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <TabSwticher SignInTab={<SignInForm />} SignUpTab={<SignUpForm />} />
            </div>
        </div >
    );
}


