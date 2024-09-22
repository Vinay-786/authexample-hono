import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function logout() {
    return api.authenticate.logout.$post();
}

function getUser() {
    return api.authenticate.getUser.$get();
}

function Index() {
    return (
        <div className="p-2 flex flex-col gap-5 w-[250px]">
            <h3>Welcome Home!</h3>
            <Button onClick={logout}>
                Logout
            </Button>
            <Button onClick={getUser}>
                whoami
            </Button>
        </div>
    )
}
