import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  // Rotas que requerem autenticação
  const protectedRoutes = ['/dashboard', '/profile', '/progress', '/onboarding'];

  // Verificar se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    try {
      // Criar cliente Supabase para verificar sessão
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        // Se não há credenciais configuradas, redirecionar para auth
        return NextResponse.redirect(new URL('/auth', request.url));
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Verificar se há uma sessão válida
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        // Não há sessão, redirecionar para login
        return NextResponse.redirect(new URL('/auth', request.url));
      }

      // Verificar se é primeira vez (onboarding)
      if (request.nextUrl.pathname === '/dashboard') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('age_range')
          .eq('id', session.user.id)
          .single();

        // Se não completou onboarding, redirecionar
        if (!profile?.age_range) {
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }
      }

    } catch (error) {
      console.error('Erro no middleware:', error);
      // Em caso de erro, redirecionar para login
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // Verificar se usuário logado tentando acessar auth
  if (request.nextUrl.pathname === '/auth') {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // Usuário já logado, verificar onboarding
          const { data: profile } = await supabase
            .from('profiles')
            .select('age_range')
            .eq('id', session.user.id)
            .single();

          if (profile?.age_range) {
            // Já completou onboarding, ir para dashboard
            return NextResponse.redirect(new URL('/dashboard', request.url));
          } else {
            // Ainda não completou onboarding
            return NextResponse.redirect(new URL('/onboarding', request.url));
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      // Em caso de erro, permitir acesso à página de auth
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};