import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_adminroute/main')({
    component: () => <div>Hello /_adminroute/main!</div>,
})
