import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { userQueryOptions } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

export const Route = createFileRoute('/_protected/profile')({
    component: Profile,
})

function Profile() {

    const { isPending, error, data } = useQuery(userQueryOptions)

    const queryClient = useQueryClient()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await api.authenticate.logout.$post();

            await queryClient.invalidateQueries({ queryKey: userQueryOptions.queryKey })
            queryClient.removeQueries({ queryKey: userQueryOptions.queryKey })
            router.navigate({ to: '/' })
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    if (isPending) return 'loading'
    if (error) return 'Not logged in'

    return (
        <div className="p-2">
            <p> {data?.user} </p>
            <Button className="my-4" onClick={handleLogout}>
                logout
            </Button>
        </div>
    )
}
