import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { MainLayout } from "@/components/layout/main-layout"
import { WelcomeHero } from "@/components/dashboard/welcome-hero"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect("/get-started")
  }

  return (
    <MainLayout showSidebar={false}>
      <div className="max-w-4xl mx-auto py-20 text-center">
        <WelcomeHero />
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild nativeButton={false}>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild nativeButton={false}>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
