import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Welcome to Skill Sprint Platform</h1>
      <p className="text-lg text-gray-600">Turn your free time into productive sprints!</p>
      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-2 bg-green-500 text-white rounded">Login</Link>
        <Link href="/register" className="px-4 py-2 bg-blue-500 text-white rounded">Register</Link>
      </div>
    </div>
  )
}