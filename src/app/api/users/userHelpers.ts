import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const DEFAULT_SITE_ID = '65e0123456789abcdef00001';

export interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

export async function resolveId(context: RouteContext): Promise<string> {
  const resolved = await Promise.resolve(context.params);
  return resolved.id;
}

export function getUserQuery(id: string) {
  return mongoose.isValidObjectId(id) ? { _id: id } : { email: id };
}

export function buildUsersListFilter(search: string, site: string, scope: string) {
  const filter: Record<string, any> = {};
  if (search.trim()) {
    const regex = { $regex: search.trim(), $options: 'i' };
    filter.$or = [{ name: regex }, { email: regex }];
  }
  if (site && site !== 'all' && scope !== 'all') {
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { site_id: site },
        { sites: site },
        { site_id: '' },
        { site_id: null },
        { site_id: { $exists: false } },
        { is_super_admin: true },
        { role: 'super_admin' },
      ],
    });
  }
  return filter;
}

export function buildNewUserDoc(body: Record<string, any>, email: string, defaultSiteId = DEFAULT_SITE_ID) {
  const name = body.name?.trim() || email.split('@')[0];
  const role = body.role || 'user';
  const siteId = body.site_id || defaultSiteId;
  const rawPassword = body.password?.trim() || '';
  const password = rawPassword
    ? (rawPassword.startsWith('$2') ? rawPassword : bcrypt.hashSync(rawPassword, 10))
    : '';

  return {
    name,
    email,
    password,
    role,
    is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
    site_id: siteId,
    sites: siteId ? [siteId] : [defaultSiteId],
    is_super_admin: role === 'super_admin' || !!body.is_super_admin,
  };
}

export function buildUserUpdateFields(body: Record<string, any>) {
  const fields: Record<string, any> = {};
  if (body.name !== undefined) fields.name = body.name.trim();
  if (body.email !== undefined) fields.email = body.email.trim().toLowerCase();
  if (body.role !== undefined) {
    fields.role = body.role;
    fields.is_super_admin = body.role === 'super_admin' || !!body.is_super_admin;
  }
  if (body.is_active !== undefined) fields.is_active = Boolean(body.is_active);
  if (body.password) {
    const raw = body.password.trim();
    fields.password = raw.startsWith('$2') ? raw : bcrypt.hashSync(raw, 10);
  }
  if (body.site_id !== undefined) {
    fields.site_id = body.site_id || DEFAULT_SITE_ID;
    fields.sites = [fields.site_id];
  }
  return fields;
}
