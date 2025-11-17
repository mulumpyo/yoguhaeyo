import { NextResponse } from 'next/server';

const proxy = (req) => {
  const token = req.cookies.get('access_token');

  if (token) {
    return NextResponse.redirect(new URL('/app', req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/'],
};

export default proxy;