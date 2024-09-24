import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { userQueryOptions } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

export const Route = createFileRoute('/_protected/profile')({
    component: Profile,
})

function Profile() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await api.authenticate.logout.$post()

            await router.invalidate()

            router.navigate({ to: '/authenticate' })
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }

    const { isPending, error, data } = useQuery(userQueryOptions)

    if (isPending) return 'loading'
    if (error) return 'Not logged in'

    return (
        <div className="p-2">
            <p> {data.user} </p>
            <Button className="my-4" onClick={handleLogout}>
                logout
            </Button>
        </div>
    )
}
