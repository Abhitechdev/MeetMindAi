import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

// ponytail: skip auth middleware on static public pages — saves TTFB on every navigation
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|blog|about|contact|legal|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
