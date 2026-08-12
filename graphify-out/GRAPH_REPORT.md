# Graph Report - .  (2026-08-12)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 507 nodes · 1005 edges · 65 communities (20 shown, 45 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.76)
- Token cost: 1,347 input · 7,588 output

## Graph Freshness
- Built from commit: `d7fecb36`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UI Components
- Form Components
- Push Notifications & Navigation
- Development Dependencies
- Purchase Management
- TypeScript Config
- Finance Dashboard Pages
- Shadcn Config
- User Dropdown Menu
- Guest List Management
- Offline Sync & i18n
- Root Layout & Toaster
- Form Dependencies
- Next.js Starter
- Purchase Import Script
- User Check Script
- Debug Import Script
- Database Restore Script
- Settings Seed Script
- User Seed Script
- Action Simulation Script
- Page Transition Template
- Service Worker Sync
- Data Verification Script
- Serwist Next Config
- Budget Schema
- Auth Prisma Adapter
- Class Variance Utility
- Tasks & Timeline Pages
- Date Utilities
- ESLint Config
- Animation Library
- Next.js Framework
- Authentication Library
- Theme Management
- Database Client
- Radix UI Primitives
- Alert Dialog Primitive
- Popover Primitive
- Slot Primitive
- Switch Primitive
- React Library
- Date Picker Library
- React DOM
- Form Management Library
- Serwist Next Integration
- Toast Notification Library
- Tailwind Class Merge Utility
- Data Fetching Library
- Web Push Library
- Schema Validation Library
- PostCSS Config
- Apple Icon Asset
- File Icon SVG
- Globe Icon SVG
- PWA Icon 192
- PWA Icon 512
- Next.js Logo
- Vercel Logo
- Window Icon SVG
- API Route Handlers
- Icon Library

## God Nodes (most connected - your core abstractions)
1. `cn()` - 100 edges
2. `Button()` - 17 edges
3. `compilerOptions` - 16 edges
4. `Team Plan: Roadmap V2.1 - Excellence Technique & i18n` - 12 edges
5. `Card()` - 10 edges
6. `CardContent()` - 10 edges
7. `Badge()` - 8 edges
8. `FormLabel()` - 8 edges
9. `FormMessage()` - 8 edges
10. `DialogContent()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `serwist` --references--> `Service Worker`  [INFERRED]
  package.json → team-plan.md
- `Team Plan: Roadmap V2.1 - Excellence Technique & i18n` --references--> `serwist`  [EXTRACTED]
  team-plan.md → package.json
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `CardFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/card.tsx → src/lib/utils.ts
- `DropdownMenuCheckboxItem()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/dropdown-menu.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **PWA offline & push architecture** — serwist, service_worker, background_sync, offline_ui, push_subscription [EXTRACTED 0.90]
- **Dynamic wedding configuration flow** — team_plan_getsettings, settings_management, dashboard, navbar [INFERRED 0.80]

## Communities (65 total, 45 thin omitted)

### Community 0 - "UI Components"
Cohesion: 0.09
Nodes (57): ConfirmModal(), ConfirmModalProps, StaggerContainer(), StaggerItem(), AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription (+49 more)

### Community 1 - "Form Components"
Cohesion: 0.07
Nodes (43): FormControl(), FormDescription(), FormField(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue (+35 more)

### Community 2 - "Push Notifications & Navigation"
Cohesion: 0.08
Nodes (23): subscribeUser(), SettingsPage(), PushSubscriber(), MobileSidebar(), Navbar(), routes, Sidebar(), UserButton() (+15 more)

### Community 3 - "Development Dependencies"
Cohesion: 0.05
Nodes (36): babel-plugin-react-compiler, eslint, eslint-config-next, devDependencies, babel-plugin-react-compiler, eslint, eslint-config-next, prisma (+28 more)

### Community 4 - "Purchase Management"
Cohesion: 0.19
Nodes (13): dynamic, PurchasesPage(), Input(), Switch, createPurchase(), deletePurchase(), getPurchases(), updatePurchase() (+5 more)

### Community 5 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 6 - "Finance Dashboard Pages"
Cohesion: 0.11
Nodes (19): BudgetContent(), VendorContent(), Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+11 more)

### Community 7 - "Shadcn Config"
Cohesion: 0.10
Nodes (19): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+11 more)

### Community 8 - "User Dropdown Menu"
Cohesion: 0.15
Nodes (12): UserButtonProps, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+4 more)

### Community 9 - "Guest List Management"
Cohesion: 0.20
Nodes (11): dynamic, GuestContent(), createGuestList(), deleteGuestList(), getGuestLists(), GuestListFormValues, GuestListSchema, deleteGuest() (+3 more)

### Community 10 - "Offline Sync & i18n"
Cohesion: 0.22
Nodes (14): Background Sync, Dashboard, dashboard-overview.tsx, Navbar, Offline fallback UI, serwist, PushSubscription table, Service Worker (+6 more)

### Community 11 - "Root Layout & Toaster"
Cohesion: 0.29
Nodes (5): inter, metadata, playfair, viewport, Toaster()

### Community 12 - "Form Dependencies"
Cohesion: 0.29
Nodes (7): clsx, @hookform/resolvers, dependencies, clsx, @hookform/resolvers, @radix-ui/react-label, @radix-ui/react-label

### Community 13 - "Next.js Starter"
Cohesion: 0.29
Nodes (7): README, app/page.tsx, create-next-app, Geist font family, next/font, Next.js, Vercel Platform

### Community 14 - "Purchase Import Script"
Cohesion: 0.40
Nodes (3): prisma, { PrismaClient }, purchaseData

### Community 22 - "Service Worker Sync"
Cohesion: 0.50
Nodes (3): bgSyncPlugin, serwist, WorkerGlobalScope

### Community 28 - "Tasks & Timeline Pages"
Cohesion: 0.36
Nodes (4): TasksPage(), TimelineContent(), getTasks(), TimelineSkeleton()

## Ambiguous Edges - Review These
- `Dashboard` → `dashboard-overview.tsx`  [AMBIGUOUS]
  team-plan.md · relation: references

## Knowledge Gaps
- **161 isolated node(s):** `ConfirmModalProps`, `CalendarProps`, `Guest`, `GuestClientProps`, `GuestList` (+156 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Dashboard` and `dashboard-overview.tsx`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `cn()` connect `UI Components` to `Form Components`, `Push Notifications & Navigation`, `Purchase Management`, `Finance Dashboard Pages`, `User Dropdown Menu`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Form Dependencies` to `Development Dependencies`, `Offline Sync & i18n`, `Auth Prisma Adapter`, `Class Variance Utility`, `Date Utilities`, `Animation Library`, `Next.js Framework`, `Authentication Library`, `Theme Management`, `Database Client`, `Radix UI Primitives`, `Alert Dialog Primitive`, `Popover Primitive`, `Slot Primitive`, `Switch Primitive`, `React Library`, `Date Picker Library`, `React DOM`, `Form Management Library`, `Serwist Next Integration`, `Toast Notification Library`, `Tailwind Class Merge Utility`, `Data Fetching Library`, `Web Push Library`, `Schema Validation Library`, `Icon Library`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `ConfirmModalProps`, `CalendarProps`, `Guest` to the rest of the system?**
  _161 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.08691308691308691 - nodes in this community are weakly interconnected._
- **Should `Form Components` be split into smaller, more focused modules?**
  _Cohesion score 0.07441016333938294 - nodes in this community are weakly interconnected._
- **Should `Push Notifications & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.07781649245063879 - nodes in this community are weakly interconnected._