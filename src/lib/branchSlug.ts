// src/lib/branchSlug.ts
export type BranchLike = { _id: string; name: string };

export function slugifyName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Compute a unique slug for a branch based on all branches.
 * If duplicates exist, append -{id6} to disambiguate.
 */
export function toBranchSlug(branch: BranchLike, all: BranchLike[]) {
  const base = slugifyName(branch.name || "branch");
  const dupCount = all.filter(b => slugifyName(b.name) === base).length;
  return dupCount > 1 ? `${base}-${branch._id.slice(0, 6)}` : base;
}

/** Resolve slug back to a branch.
 * Tries exact unique slug first; then falls back to base slug match.
 */
export function findBranchBySlug(slug: string, all: BranchLike[]) {
  // 1) exact match on unique slug
  const exact = all.find(b => toBranchSlug(b, all) === slug);
  if (exact) return exact;

  // 2) fallback by base slug (before -id6)
  const base = slug.split("-").slice(0, -1).join("-") || slug;
  return all.find(b => slugifyName(b.name) === base) ?? null;
}

/** Replace the first path segment with the given slug. */
export function replaceFirstSegment(pathname: string, newSeg: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) return `/${newSeg}`;
  parts[0] = newSeg;
  return "/" + parts.join("/");
}
