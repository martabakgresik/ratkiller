import { signToken } from '../utils/jwt';

export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;
    const body = await request.json() as { password?: string };

    if (!body.password) {
      return new Response(JSON.stringify({ error: 'Password is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (body.password !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!env.JWT_SECRET) {
       return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Sign the token
    const token = await signToken({ role: 'admin' }, env.JWT_SECRET);

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to authenticate' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
