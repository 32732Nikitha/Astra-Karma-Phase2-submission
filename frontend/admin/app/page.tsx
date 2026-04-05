import { redirect } from 'next/navigation'

/** Legacy hub: deploy from `frontend/landingPage` instead; this app is admin-only when run standalone. */
export default function HomePage() {
  redirect('/admin/login')
}
