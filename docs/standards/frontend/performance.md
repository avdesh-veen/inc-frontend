## Performance Standards

### Next.js Performance Optimization

#### Server Components

- Use Server Components by default
- Minimize client component boundaries
- Fetch data in Server Components when possible
- Reduce JavaScript bundle size

#### Code Splitting

- Use dynamic imports for heavy components
- Leverage Next.js automatic code splitting
- Split routes automatically with App Router

```typescript
// Dynamic import
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <Skeleton />,
  ssr: false, // Disable SSR if not needed
});
```

#### Image Optimization

- Always use `next/image` component
- Provide width and height for layout stability
- Use appropriate image formats (WebP, AVIF)
- Implement lazy loading

```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // For above-the-fold images
  placeholder="blur" // With blurDataURL
/>
```

### Data Fetching Performance

#### Parallel Data Fetching

- Fetch data in parallel when possible
- Use `Promise.all` for independent requests
- Avoid waterfall requests

```typescript
// ✅ Good - Parallel fetching
export default async function DashboardPage() {
  const [users, posts, stats] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchStats(),
  ]);

  return <Dashboard users={users} posts={posts} stats={stats} />;
}

// ❌ Bad - Sequential fetching
export default async function DashboardPage() {
  const users = await fetchUsers();
  const posts = await fetchPosts();
  const stats = await fetchStats();
  // ...
}
```

#### Caching Strategy

- Use appropriate caching for different data types
- Leverage Next.js fetch caching
- Use TanStack Query for client-side caching
- Implement stale-while-revalidate pattern

```typescript
// Static data - ISR
const data = await fetch(url, {
  next: { revalidate: 3600 }, // Revalidate every hour
});

// Dynamic data - No cache
const data = await fetch(url, {
  cache: "no-store",
});

// On-demand revalidation
const data = await fetch(url, {
  next: { tags: ["users"] },
});
```

### React Performance

#### Memoization

- Use `useMemo` for expensive computations
- Use `useCallback` for stable function references
- Use `React.memo` for component memoization
- Don't over-memoize

```typescript
// Expensive computation
const filteredUsers = useMemo(() => {
  return users.filter(user => {
    // Expensive filtering logic
    return complexFilter(user);
  });
}, [users]);

// Stable callback
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);

// Memoized component
export const UserCard = React.memo(({ user }: { user: User }) => {
  return <div>{user.name}</div>;
});
```

#### Selective Re-renders

- Use Zustand selectors to prevent unnecessary re-renders
- Split components to isolate re-renders
- Use React Context carefully

```typescript
// ✅ Good - Selective subscription
const user = useUserStore((state) => state.user);

// ❌ Bad - Subscribes to entire store
const { user } = useUserStore();
```

### Bundle Size Optimization

#### Tree Shaking

- Use ES modules
- Import only what you need
- Avoid barrel exports for large libraries

```typescript
// ✅ Good - Specific import
import { Button } from "@/components/ui/button";

// ❌ Bad - Import entire library
import * as UI from "@/components/ui";
```

#### Dependency Management

- Regularly audit dependencies
- Remove unused dependencies
- Use lighter alternatives when possible
- Analyze bundle size regularly

### Rendering Performance

#### Streaming and Suspense

- Use Suspense boundaries for progressive rendering
- Stream data when possible
- Show loading states appropriately

```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <UserList />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <PostList />
      </Suspense>
    </div>
  );
}
```

#### Virtual Scrolling

- Use virtual scrolling for long lists
- Implement pagination or infinite scroll
- Load data incrementally

### Network Performance

#### Request Optimization

- Minimize API requests
- Batch requests when possible
- Use request deduplication (TanStack Query)
- Implement request debouncing/throttling

#### Asset Optimization

- Optimize images and media
- Use CDN for static assets
- Compress assets (gzip, brotli)
- Use modern formats (WebP, AVIF)

### Monitoring and Metrics

#### Performance Metrics

- Monitor Core Web Vitals
- Track Time to First Byte (TTFB)
- Measure First Contentful Paint (FCP)
- Track Largest Contentful Paint (LCP)
- Monitor Cumulative Layout Shift (CLS)

#### Performance Monitoring

- Use Next.js Analytics
- Implement Real User Monitoring (RUM)
- Track performance budgets
- Set up alerts for performance regressions

### Best Practices

#### Performance Checklist

- [ ] Use Server Components by default
- [ ] Implement proper caching strategies
- [ ] Optimize images with next/image
- [ ] Code split heavy components
- [ ] Minimize JavaScript bundle size
- [ ] Use memoization appropriately
- [ ] Optimize data fetching
- [ ] Monitor Core Web Vitals
- [ ] Test on slow networks
- [ ] Test on low-end devices

#### Performance Testing

- Test on various devices and networks
- Use Lighthouse for performance audits
- Monitor real user metrics
- Set performance budgets
- Test with throttled network

### Optimization Techniques

#### Prefetching

- Use Next.js automatic prefetching
- Prefetch critical routes
- Prefetch data with TanStack Query

#### Lazy Loading

- Lazy load non-critical components
- Lazy load images below the fold
- Lazy load third-party scripts

#### Resource Hints

- Use `<link rel="preconnect">` for external domains
- Use `<link rel="dns-prefetch">` for DNS lookups
- Use `<link rel="preload">` for critical resources
