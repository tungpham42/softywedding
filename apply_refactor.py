#!/usr/bin/env python3
"""Apply the Softy Wedding personalization refactor to a local repository checkout.

Usage:
  python3 apply_refactor.py /path/to/softywedding

The script verifies all expected source anchors before writing anything, then
adds the design studio and applies the API, public-page, navigation, and CSS edits.
"""
from __future__ import annotations

import shutil
import sys
from pathlib import Path

KIT_ROOT = Path(__file__).resolve().parent
REPO_ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd().resolve()

if not (REPO_ROOT / "package.json").is_file() or not (REPO_ROOT / "src/app").is_dir():
    raise SystemExit(
        f"Could not find the Softy Wedding project at {REPO_ROOT}. "
        "Pass the repository root as the first argument."
    )

staged: dict[Path, str] = {}

def read(path: str) -> str:
    target = REPO_ROOT / path
    if target not in staged:
        staged[target] = target.read_text(encoding="utf-8")
    return staged[target]

def replace_once(path: str, old: str, new: str, *, expected: int = 1) -> None:
    target = REPO_ROOT / path
    content = read(path)
    found = content.count(old)
    if found != expected:
        raise RuntimeError(
            f"Cannot safely refactor {path}: expected {expected} match(es), found {found}. "
            f"No files have been written. Check that the repository matches the upstream version."
        )
    staged[target] = content.replace(old, new, expected)

# Domain type: the design options are validated centrally and older documents
# gracefully inherit the default design.
replace_once(
    "src/lib/wedding.ts",
    "export type WeddingTask = {",
    'import type { WeddingDesign } from "@/lib/wedding-design";\n\nexport type WeddingTask = {',
)
replace_once(
    "src/lib/wedding.ts",
    "  heroImage: string;\n  schedule: WeddingScheduleItem[];",
    "  heroImage: string;\n  design: WeddingDesign;\n  schedule: WeddingScheduleItem[];",
)

# Wedding list / creation API.
replace_once(
    "src/app/api/weddings/route.ts",
    'import { safeSlug } from "@/lib/utils";\n',
    'import { safeSlug } from "@/lib/utils";\nimport { DEFAULT_WEDDING_DESIGN, readWeddingDesign } from "@/lib/wedding-design";\n',
)
replace_once(
    "src/app/api/weddings/route.ts",
    '    heroImage: typeof data.heroImage === "string" ? data.heroImage : "",\n    schedule: readWeddingSchedule(data.schedule),',
    '    heroImage: typeof data.heroImage === "string" ? data.heroImage : "",\n    design: readWeddingDesign(data.design),\n    schedule: readWeddingSchedule(data.schedule),',
)
replace_once(
    "src/app/api/weddings/route.ts",
    '      heroImage: "",\n      schedule: [],',
    '      heroImage: "",\n      design: DEFAULT_WEDDING_DESIGN,\n      schedule: [],',
)

# Authenticated update endpoint validates the incoming design before persisting.
replace_once(
    "src/app/api/weddings/[slug]/route.ts",
    'import { readWeddingSchedule, readWeddingTasks } from "@/lib/wedding";\n',
    'import { readWeddingSchedule, readWeddingTasks } from "@/lib/wedding";\nimport { readWeddingDesign, validateWeddingDesign } from "@/lib/wedding-design";\n',
)
replace_once(
    "src/app/api/weddings/[slug]/route.ts",
    '      schedule: readWeddingSchedule(result.data.schedule),\n      tasks: readWeddingTasks(result.data.tasks),',
    '      schedule: readWeddingSchedule(result.data.schedule),\n      tasks: readWeddingTasks(result.data.tasks),\n      design: readWeddingDesign(result.data.design),',
)
replace_once(
    "src/app/api/weddings/[slug]/route.ts",
    '  if (!Object.keys(updates).length) return Response.json({ error: "No supported fields were supplied." }, { status: 400 });',
    '  if ("design" in body) {\n'
    '    const design = validateWeddingDesign(body.design);\n'
    '    if (!design) return Response.json({ error: "Choose valid design options for every field." }, { status: 400 });\n'
    '    updates.design = design;\n'
    '  }\n\n'
    '  if (!Object.keys(updates).length) return Response.json({ error: "No supported fields were supplied." }, { status: 400 });',
)

# Public website: load persisted settings, theme all page surfaces, and honor
# section visibility and layout choices.
replace_once(
    "src/app/[slug]/page.tsx",
    'import type { Metadata } from "next";\n',
    'import type { Metadata } from "next";\nimport type { CSSProperties } from "react";\n',
)
replace_once(
    "src/app/[slug]/page.tsx",
    'import { formatWeddingDate } from "@/lib/utils";\n',
    'import { formatWeddingDate } from "@/lib/utils";\nimport { readWeddingDesign, WEDDING_PALETTES, type WeddingDesign } from "@/lib/wedding-design";\n',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '  heroImage: string;\n  schedule: WeddingScheduleItem[];',
    '  heroImage: string;\n  design: WeddingDesign;\n  schedule: WeddingScheduleItem[];',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '    heroImage: readString(data.heroImage),\n    schedule: readWeddingSchedule(data.schedule),',
    '    heroImage: readString(data.heroImage),\n    design: readWeddingDesign(data.design),\n    schedule: readWeddingSchedule(data.schedule),',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '  const hasVenue = Boolean(\n    wedding.venue || wedding.location || wedding.ceremonyTime,\n  );\n\n  return (\n    <main className="bg-[#fbf8f2]">',
    '  const hasVenue = Boolean(\n    wedding.venue || wedding.location || wedding.ceremonyTime,\n  );\n  const palette = WEDDING_PALETTES[wedding.design.palette];\n\n  return (\n'
    '    <main\n'
    '      className={`wedding-public wedding-type-${wedding.design.typography} wedding-layout-${wedding.design.layout}`}\n'
    '      style={{\n'
    '        "--wedding-accent": palette.accent,\n'
    '        "--wedding-highlight": palette.highlight,\n'
    '        "--wedding-paper": palette.paper,\n'
    '        "--wedding-soft": palette.soft,\n'
    '        "--wedding-card": palette.card,\n'
    '        "--wedding-ink": palette.ink,\n'
    '      } as CSSProperties}\n'
    '    >',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '        <Link\n          href="/guest"\n          className="inline-flex h-9 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 text-xs font-semibold backdrop-blur hover:bg-white/20"\n        >\n          Guest details <Icon name="arrow-up-right" size={14} />\n        </Link>',
    '        {wedding.design.showRsvpButton && (\n'
    '          <Link\n'
    '            href="/guest"\n'
    '            className="inline-flex h-9 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 text-xs font-semibold backdrop-blur hover:bg-white/20"\n'
    '          >\n'
    '            Guest details <Icon name="arrow-up-right" size={14} />\n'
    '          </Link>\n'
    '        )}',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '        className={`relative flex min-h-[650px] items-center justify-center overflow-hidden px-5 py-24 text-center text-white sm:min-h-[750px] sm:py-28 ${wedding.heroImage ? "bg-cover bg-center" : "bg-pine"}`}\n        style={\n          wedding.heroImage\n            ? { backgroundImage: `url(\'${wedding.heroImage}\')` }\n            : undefined\n        }',
    '        className={`wedding-hero relative flex min-h-[650px] items-center justify-center overflow-hidden px-5 py-24 ${wedding.design.layout === "editorial" ? "text-left" : "text-center"} text-white sm:min-h-[750px] sm:py-28 ${wedding.design.heroStyle === "photo" && wedding.heroImage ? "bg-cover bg-center" : "bg-pine"}`}\n'
    '        style={{\n'
    '          backgroundColor: wedding.design.heroStyle === "solid" || !wedding.heroImage ? palette.accent : undefined,\n'
    '          backgroundImage: wedding.design.heroStyle === "photo" && wedding.heroImage ? `url(\'${wedding.heroImage}\')` : undefined,\n'
    '          backgroundPosition: wedding.design.coverPosition,\n'
    '        }}',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '        <div className="absolute inset-0 bg-[#182e25]/45" />\n        <div className="absolute inset-0 bg-gradient-to-t from-[#1b3529]/65 via-transparent to-[#1b3529]/25" />\n        <div className="relative max-w-[820px]">',
    '        <div className="absolute inset-0" style={{ backgroundColor: palette.overlay }} />\n'
    '        <div className="absolute inset-0" style={{ background: palette.gradient }} />\n'
    '        <div className={`wedding-hero-content relative max-w-[820px] ${wedding.design.layout === "editorial" ? "mr-auto text-left" : "mx-auto text-center"} ${wedding.design.layout === "minimal" ? "max-w-[620px]" : ""}`}>',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '            <span className="italic text-[#edc6b5]">&</span>{" "}',
    '            <span className="italic" style={{ color: palette.highlight }}>&</span>{" "}',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '            Guest details <Icon name="arrow-up-right" size={14} />',
    '            {wedding.design.rsvpLabel} <Icon name="arrow-up-right" size={14} />',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '            Together with our favorite people',
    '            {wedding.design.welcomeMessage}',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '            <p className="eyebrow text-terra">A note from us</p>',
    '            <p className="eyebrow text-terra">{wedding.design.storyLabel}</p>',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '              <p className="eyebrow text-terra">The day at a glance</p>',
    '              <p className="eyebrow text-terra">{wedding.design.scheduleLabel}</p>',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '            See you on the dance floor.',
    '            {wedding.design.closingMessage}',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '            Find your invitation <Icon name="arrow-right" size={16} />',
    '            {wedding.design.rsvpLabel} <Icon name="arrow-right" size={16} />',
)

replace_once(
    "src/app/[slug]/page.tsx",
    '      {(wedding.headline || wedding.story) && (',
    '      {wedding.design.showStory && (wedding.headline || wedding.story) && (',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '\n          {wedding.schedule.length > 0 && (',
    '\n          {wedding.design.showSchedule && wedding.schedule.length > 0 && (',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '\n      {wedding.schedule.length > 0 && (',
    '\n      {wedding.design.showSchedule && wedding.schedule.length > 0 && (',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '\n          {hasVenue && (',
    '\n          {wedding.design.showVenue && hasVenue && (',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '\n      {hasVenue && (',
    '\n      {wedding.design.showVenue && hasVenue && (',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '      <section className="px-5 pb-20 sm:pb-28">',
    '      {wedding.design.showRsvpButton && (\n      <section className="px-5 pb-20 sm:pb-28">',
)
replace_once(
    "src/app/[slug]/page.tsx",
    '      </section>\n      <SiteFooter />',
    '      </section>\n      )}\n      <SiteFooter />',
)

# Put the new design studio within the couple's existing navigation.
replace_once(
    "src/components/dashboard/couple-workspace.tsx",
    '          <Link\n            href="/guest"\n            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-muted hover:bg-sage-soft hover:text-pine"\n          >\n            <Icon name="users" size={17} />',
    '          <Link\n            href="/couple/design"\n            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-muted hover:bg-sage-soft hover:text-pine"\n          >\n            <Icon name="settings" size={17} />\n            Design studio\n          </Link>\n          <Link\n            href="/guest"\n            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-muted hover:bg-sage-soft hover:text-pine"\n          >\n            <Icon name="users" size={17} />',
)
replace_once(
    "src/components/dashboard/couple-workspace.tsx",
    '              { label: "Guest list & RSVPs", href: "/guest" },\n              { label: "Planner", href: "/planner" },',
    '              { label: "Design studio", href: "/couple/design" },\n              { label: "Guest list & RSVPs", href: "/guest" },\n              { label: "Planner", href: "/planner" },',
)

# Append reusable public-wedding theme styles. These are scoped so the private
# dashboard and marketing homepage retain their existing design.
replace_once(
    "src/app/globals.css",
    'button:disabled { cursor: not-allowed; }',
    'button:disabled { cursor: not-allowed; }\n\n'
    '/* Public wedding design system: scoped to published wedding websites. */\n'
    '.wedding-public { background-color: var(--wedding-paper); color: var(--wedding-ink); }\n'
    '.wedding-public .bg-pine { background-color: var(--wedding-accent) !important; }\n'
    '.wedding-public .text-pine { color: var(--wedding-accent) !important; }\n'
    '.wedding-public .text-terra { color: var(--wedding-highlight) !important; }\n'
    '.wedding-public .bg-paper { background-color: var(--wedding-card) !important; }\n'
    '.wedding-public .bg-sage-soft { background-color: color-mix(in srgb, var(--wedding-accent) 11%, var(--wedding-paper)) !important; }\n'
    '.wedding-public .border-line { border-color: color-mix(in srgb, var(--wedding-ink) 13%, transparent) !important; }\n'
    '.wedding-public .text-muted { color: color-mix(in srgb, var(--wedding-ink) 66%, transparent) !important; }\n'
    '.wedding-public #our-day { background-color: var(--wedding-soft); }\n'
    '.wedding-public .wedding-hero { background-color: var(--wedding-accent); }\n'
    '.wedding-type-modern .font-display { font-family: "Avenir Next", Avenir, "Segoe UI", Arial, sans-serif; font-style: normal; font-weight: 600; letter-spacing: -.025em; }\n'
    '.wedding-type-romantic .font-display { font-style: italic; letter-spacing: -.045em; }\n'
    '.wedding-layout-minimal .wedding-hero { min-height: 580px; }\n'
    '.wedding-layout-editorial .wedding-hero-content { width: min(100%, 820px); margin-right: auto; text-align: left; }\n'
    '@media (max-width: 640px) { .wedding-layout-editorial .wedding-hero-content { margin-left: 0; } }',
)

# Add an explicit route entry and explain the personalization feature.
replace_once(
    "README.md",
    '- `/couple` — create/manage your own wedding, update planning checklist and website details, manage invitation codes, and upload a cover image.\n',
    '- `/couple` — create/manage your own wedding, update planning checklist and website details, manage invitation codes, and upload a cover image.\n- `/couple/design` — customize the published wedding website theme, typography, layout, cover treatment, photo focal point, and visible page sections.\n',
)
replace_once(
    "README.md",
    '## Validation\n',
    '## Wedding website personalization\n\n'
    'The design studio stores a validated `design` object on each `weddings/{slug}` document. Five preset palettes (Garden sage, Rosewater, Coastal blue, Midnight velvet, and Sunset terracotta), three typography styles, three layouts, photo/solid hero treatments, cover focal points, independent story/schedule/venue/RSVP visibility settings, and editable welcome/story/schedule/button/closing copy are supported. Existing wedding documents safely fall back to the default design. Design updates use the same authenticated owner/planner checks as the rest of the workspace, and only validated preset values are persisted.\n\n'
    'Open `/couple/design` to personalize a wedding and preview the visual choices. A published page reflects the saved settings immediately.\n\n'
    '## Validation\n',
)

# Stage the added files before writing. Never overwrite an existing user file.
new_files = sorted((KIT_ROOT / "new-files").rglob("*"))
for source in new_files:
    if not source.is_file():
        continue
    relative = source.relative_to(KIT_ROOT / "new-files")
    target = REPO_ROOT / relative
    if target.exists() and target not in staged:
        raise RuntimeError(f"Refusing to overwrite existing file: {target}. No files have been written.")

# All substitutions were verified; commit the staged modifications to disk.
for target, content in staged.items():
    target.write_text(content, encoding="utf-8")
for source in new_files:
    if source.is_file():
        relative = source.relative_to(KIT_ROOT / "new-files")
        target = REPO_ROOT / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)

print("Softy Wedding personalization refactor applied successfully.")
print("Added: /couple/design design studio and shared design presets/validation.")
print("Updated: wedding types, authenticated API validation, public wedding page, navigation, CSS, README.")
print("Next run: npm run typecheck && npm run lint && npm run build")
