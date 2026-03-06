# Component Library

A modular, reusable component library for building consistent UIs quickly.

## Quick Start

```tsx
import { Avatar, EmptyState, LoadingSkeleton } from "@/components";

function MyPage() {
  return (
    <div>
      <Avatar initials="JD" size="lg" />
      {loading && <LoadingSkeleton variant="post" />}
      {empty && <EmptyState icon={Icon} title="Empty" description="..." />}
    </div>
  );
}
```

## Documentation

- **[Component Architecture](../../COMPONENT_ARCHITECTURE.md)** - Detailed architecture guide
- **[Quick Reference](../../QUICK_REFERENCE.md)** - Common patterns and examples
- **[Component Hierarchy](../../COMPONENT_HIERARCHY.md)** - Visual structure and dependencies
- **[Migration Checklist](../../MIGRATION_CHECKLIST.md)** - Refactoring progress tracker
- **[Refactoring Summary](../../REFACTORING_SUMMARY.md)** - What was improved and why

## Component Categories

### Atomic Components (`common/`)
Small, single-purpose components:
- `Avatar` - User avatars with initials
- `EmptyState` - Empty state displays
- `LoadingSkeleton` - Loading placeholders
- `ErrorMessage` - Error displays
- `UserInfo` - User name and handle
- `UserCard` - Complete user card
- `MediaUpload` - File upload
- `CharacterCounter` - Character count display
- `VisibilityToggle` - Public/private toggle
- `MediaPreview` - File preview
- `ActionButton` - Like/reply buttons
- `PageHeader` - Page headers
- `TabNavigation` - Tab navigation
- `StatsCard` - Statistics display

### Composite Components
Feature-complete components:
- `PostComposer` - Post creation interface
- `Feed` - Post feed with states
- `PostCard` - Individual post display
- `CommentsModal` - Comments interface
- `EditPostModal` - Post editing

### UI Primitives (`ui/`)
Base components from shadcn/ui:
- `Button`, `Input`, `Textarea`
- `Dialog`, `DropdownMenu`

## Usage Examples

### List Page Pattern
```tsx
import {
  PageHeader,
  LoadingSkeleton,
  EmptyState,
  UserCard,
  ErrorMessage
} from "@/components";

function UsersPage() {
  if (error) return <ErrorMessage message={error} />;
  if (loading) return <LoadingSkeleton variant="user" />;
  
  return (
    <div>
      <PageHeader title="Users" showBackButton />
      {users.length === 0 ? (
        <EmptyState icon={Users} title="No users" description="..." />
      ) : (
        users.map(user => (
          <UserCard key={user.id} user={user} action={...} />
        ))
      )}
    </div>
  );
}
```

### Feed Pattern
```tsx
import { PostComposer, TabNavigation, Feed } from "@/components";

function FeedPage() {
  return (
    <div>
      <PostComposer onPostCreated={refresh} />
      <TabNavigation tabs={tabs} activeTab={tab} onTabChange={setTab} />
      <Feed posts={posts} onLike={handleLike} onReply={handleReply} />
    </div>
  );
}
```

### Profile Pattern
```tsx
import { Avatar, StatsCard, UserInfo, Feed } from "@/components";

function ProfilePage() {
  return (
    <div>
      <Avatar initials="JD" size="xl" variant="primary" />
      <UserInfo name="John" handle="john" plan="PRO" />
      <StatsCard stats={[
        { label: "Followers", value: 100, onClick: viewFollowers }
      ]} />
      <Feed posts={userPosts} />
    </div>
  );
}
```

## Design Principles

1. **Single Responsibility** - Each component does one thing well
2. **Composition** - Build complex UIs from simple components
3. **Props for Configuration** - Customize via props, not variants
4. **TypeScript First** - Fully typed with clear interfaces
5. **Accessibility** - ARIA labels and semantic HTML

## Benefits

- ✅ **60% less code** - Eliminate duplication
- ✅ **Consistent UI** - Same components everywhere
- ✅ **Type safe** - Full TypeScript support
- ✅ **Easy to test** - Small, focused components
- ✅ **Fast development** - Compose existing components

## Contributing

When adding new components:

1. **Check if it exists** - Look in `common/` first
2. **Make it reusable** - Generic props, not specific use cases
3. **Type everything** - Full TypeScript interfaces
4. **Document it** - Add to this README and examples
5. **Test it** - Ensure it works in multiple contexts

## Component Checklist

Before creating a new component, ask:

- [ ] Is this pattern used in 2+ places?
- [ ] Can it be made generic with props?
- [ ] Does a similar component already exist?
- [ ] Is it a single responsibility?
- [ ] Can it be composed from existing components?

If yes to most, create the component!

## File Structure

```
components/
├── common/           # Atomic components
│   ├── Avatar.tsx
│   ├── EmptyState.tsx
│   └── ...
├── ui/              # Base UI primitives
│   ├── button.tsx
│   └── ...
├── Feed.tsx         # Composite components
├── PostCard.tsx
├── PostComposer.tsx
├── index.ts         # Main exports
└── README.md        # This file
```

## Import Paths

```tsx
// Recommended - use barrel export
import { Avatar, EmptyState } from "@/components";

// Also works - direct import
import { Avatar } from "@/components/common/Avatar";

// UI components
import { Button } from "@/components/ui/button";
```

## Styling

All components use Tailwind CSS with consistent patterns:

- **Spacing**: `p-4`, `mt-2`, `gap-3`
- **Borders**: `rounded-xl`, `border-white/15`
- **Colors**: `bg-white/10`, `text-white/60`
- **Typography**: `text-[14px]`, `font-medium`

## Performance

- Components use `memo()` where appropriate
- Loading states prevent layout shift
- Optimized re-rendering with proper keys

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- CSS Grid and Flexbox

## License

Same as parent project

## Questions?

Check the documentation files in the `client/` directory or ask the team!
