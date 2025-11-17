export async function register({name, email, password}) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, email, password}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;  // { account, token }
}

export async function login({email, password}) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;  // { account, token }
}

export async function me(token) {
  const res = await fetch('/api/me', {
    headers: {Authorization: `Bearer ${token}`},
  });
  if (res.status === 401) return null;
  const data = await res.json();
  return data.account;
}