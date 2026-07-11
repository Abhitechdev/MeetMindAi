import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)
    
    if (session?.user?.email) {
      const email = session.user.email.toLowerCase();
      const allowedDomains = ['gmail.com', 'outlook.com', 'hotmail.com'];
      const isEdu = email.endsWith('.edu') || email.includes('.edu.');
      const domain = email.split('@')[1];
      
      if (!allowedDomains.includes(domain) && !isEdu) {
        // Not an allowed email provider - sign out and redirect with error
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL('/login?error=Only+Gmail,+Outlook,+or+.edu+emails+are+allowed.+Temporary+emails+are+blocked.', request.url))
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/', request.url))
}
