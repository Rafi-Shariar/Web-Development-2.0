import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <div className="relative">
        {/* Giant background text effect */}
        <h1 className="text-[10rem] font-black text-gray-200/60 select-none sm:text-[14rem] leading-none">
          404
        </h1>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Lost in cyberspace?
          </h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base max-w-sm">
            We couldn&apos;t find the resource you requested. Let&apos;s get you back on track.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return Home
        </Link>
      </div>
    </main>
  )
}