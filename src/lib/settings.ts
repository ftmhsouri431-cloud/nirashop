import { sql } from "./db";
import { DEFAULT_SETTINGS, ensureSeeded } from "./seed";
import type { ShopSettings } from "./types";

export async function getSettings(): Promise<ShopSettings> {
  await ensureSeeded();
  const rows = await sql<{ key: string; value: string }>(
    "select key, value from settings",
  );
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    shopName: map.shop_name || DEFAULT_SETTINGS.shopName,
    tagline: map.tagline || DEFAULT_SETTINGS.tagline,
    adminPassword: map.admin_password || "",
  };
}

export async function getPublicSettings(): Promise<
  Pick<ShopSettings, "shopName" | "tagline">
> {
  const s = await getSettings();
  return { shopName: s.shopName, tagline: s.tagline };
}

export async function updateSettings(input: {
  shopName?: string;
  tagline?: string;
  adminPassword?: string;
}): Promise<Pick<ShopSettings, "shopName" | "tagline">> {
  await ensureSeeded();
  if (input.shopName != null) {
    await sql(
      `insert into settings (key, value) values ('shop_name', $1)
       on conflict (key) do update set value = excluded.value`,
      [input.shopName.trim() || DEFAULT_SETTINGS.shopName],
    );
  }
  if (input.tagline != null) {
    await sql(
      `insert into settings (key, value) values ('tagline', $1)
       on conflict (key) do update set value = excluded.value`,
      [input.tagline.trim()],
    );
  }
  if (input.adminPassword != null && input.adminPassword.trim()) {
    await sql(
      `insert into settings (key, value) values ('admin_password', $1)
       on conflict (key) do update set value = excluded.value`,
      [input.adminPassword.trim()],
    );
  }
  return getPublicSettings();
}
