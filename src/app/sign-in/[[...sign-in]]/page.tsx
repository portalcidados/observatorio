import { Header } from "@/components/header"
import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <>
      <Header className="bg-[#f9f9f6]" />
      <div className="flex min-h-screen items-center justify-center bg-[#eaedf5]">
        <SignIn />
      </div>
    </>
  )
}
