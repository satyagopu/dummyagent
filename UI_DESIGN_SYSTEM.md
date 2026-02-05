# 🎨 AgentWeave UI Design System

**Modern, Beautiful, Production-Ready UI**  
*Making AI workflows visually stunning and intuitive*

---

## 🎯 Design Philosophy

AgentWeave's UI should be:
- ✨ **Modern & Premium** - Glass morphism, gradients, smooth animations
- 🎨 **Visually Cohesive** - Consistent color system, spacing, typography
- ⚡ **Fast & Responsive** - Smooth transitions, optimized performance
- 🎭 **Delightful** - Subtle animations that enhance UX
- 📱 **Mobile-First** - Works beautifully on all devices
- ♿ **Accessible** - Built with accessibility in mind

---

## 🛠️ Tech Stack (UI Layer)

### Core UI Libraries
- **shadcn/ui** - Beautiful, accessible components built on Radix UI
- **Tailwind CSS** - Utility-first CSS with design tokens
- **Framer Motion** - Smooth, professional animations
- **Lucide React** - Consistent, beautiful icons

### Form & Validation
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

### Notifications & Feedback
- **Sonner** - Beautiful toast notifications
- **Vaul** - Modern drawer/bottom sheet

### Additional Tools
- **class-variance-authority** - Component variant management
- **tailwind-merge** - Intelligent class merging
- **date-fns** - Date manipulation
- **recharts** - Beautiful charts (for Phase 5+)

---

## 🎨 Visual Design Patterns

### 1. Glass Morphism & Gradients

**Page Wrapper (Every Page):**
```tsx
<div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
  {/* Beautiful subtle gradient background */}
</div>
```

**Header with Backdrop Blur:**
```tsx
<header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
  {/* Modern glass effect */}
</header>
```

**Cards with Shadows:**
```tsx
<Card className="shadow-accent hover:shadow-lg transition-shadow">
  {/* Subtle elevation that responds to hover */}
</Card>
```

---

### 2. Framer Motion Animations

**Page Entrance (Always use on pages):**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  {/* Content fades in smoothly */}
</motion.div>
```

**Staggered Cards:**
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
  >
    <Card>{/* Each card animates in sequence */}</Card>
  </motion.div>
))}
```

**Canvas Node Animations:**
```tsx
// When dropping new node on canvas
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  {/* Node bounces into place */}
</motion.div>
```

---

### 3. Color System (Brand: Blue Theme)

**Primary Colors:**
- **Primary (Brand Blue):** `#2563eb` - Buttons, links, active states
- **Secondary (Light Blue):** `#0ea5e9` - Accents, highlights
- **Success (Green):** `#16a34a` - Completed, success states
- **Error (Red):** `#dc2626` - Errors, warnings, destructive actions

**Status Badge System:**
```tsx
// Running/Active
<Badge className="bg-primary text-primary-foreground">
  <Play className="h-3 w-3 mr-1" />
  Running
</Badge>

// Success/Completed
<Badge className="bg-success text-success-foreground">
  <CheckCircle className="h-3 w-3 mr-1" />
  Completed
</Badge>

// Pending/Idle
<Badge variant="outline">
  <Clock className="h-3 w-3 mr-1" />
  Pending
</Badge>

// Error/Failed
<Badge variant="destructive">
  <AlertCircle className="h-3 w-3 mr-1" />
  Failed
</Badge>
```

---

### 4. AgentWeave-Specific UI Patterns

#### **Workflow Canvas (Phase 3)**
```tsx
// Canvas container with subtle grid
<div className="relative h-full bg-gradient-to-br from-muted/20 to-background">
  {/* Grid overlay */}
  <div className="absolute inset-0 bg-grid-pattern opacity-5" />
  
  {/* Nodes with glass effect */}
  <motion.div
    className="absolute bg-card/80 backdrop-blur-sm rounded-lg border shadow-lg"
    drag
    dragMomentum={false}
  >
    {/* Node content */}
  </motion.div>
</div>
```

#### **Node Palette Sidebar**
```tsx
<div className="w-80 border-r bg-background/80 backdrop-blur-sm">
  <div className="p-4 space-y-4">
    {/* Categorized nodes */}
    <div>
      <h3 className="text-sm font-semibold mb-2">LLM Nodes</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="h-20 flex flex-col gap-2">
          <Bot className="h-5 w-5" />
          <span className="text-xs">GPT-4</span>
        </Button>
      </div>
    </div>
  </div>
</div>
```

#### **Chat Preview Panel**
```tsx
<Card className="h-full flex flex-col">
  <CardHeader className="flex-row items-center justify-between">
    <div>
      <CardTitle>Test Workflow</CardTitle>
      <CardDescription>Interactive preview</CardDescription>
    </div>
    <Badge variant="secondary">
      <Zap className="h-3 w-3 mr-1" />
      Live
    </Badge>
  </CardHeader>
  
  <CardContent className="flex-1 overflow-y-auto space-y-4">
    {/* Chat messages with animations */}
    {messages.map((msg, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "p-3 rounded-lg",
          msg.role === "user" 
            ? "bg-primary text-primary-foreground ml-12" 
            : "bg-muted mr-12"
        )}
      >
        {msg.content}
      </motion.div>
    ))}
  </CardContent>
</Card>
```

#### **Execution Status Indicators**
```tsx
// Active node highlight during execution
<motion.div
  animate={{
    boxShadow: [
      "0 0 0 0 rgba(37, 99, 235, 0)",
      "0 0 0 8px rgba(37, 99, 235, 0.2)",
      "0 0 0 0 rgba(37, 99, 235, 0)",
    ],
  }}
  transition={{ duration: 1.5, repeat: Infinity }}
  className="absolute inset-0 rounded-lg pointer-events-none"
/>
```

---

### 5. Form Design (Authentication, Settings)

**Modern Login Form:**
```tsx
<Card className="w-full max-w-md shadow-accent">
  <CardHeader className="space-y-1">
    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
    <CardDescription>Sign in to your AgentWeave account</CardDescription>
  </CardHeader>
  
  <CardContent>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="you@example.com" 
                  type="email"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button size="lg" className="w-full" type="submit">
          <span>Sign In</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </form>
    </Form>
  </CardContent>
</Card>
```

---

### 6. Dashboard Layout

**Main Dashboard Structure:**
```tsx
<div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
  {/* Header */}
  <header className="border-b bg-background/80 backdrop-blur-sm">
    {/* Logo, nav, user menu */}
  </header>
  
  <div className="container mx-auto px-4 py-8">
    {/* Welcome section */}
    <motion.div className="mb-8" {...fadeIn}>
      <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
      <p className="text-muted-foreground">Your workflows</p>
    </motion.div>
    
    {/* 2-column grid */}
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main content (2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          {/* Recent workflows */}
        </Card>
      </div>
      
      {/* Sidebar (1 col) */}
      <div className="space-y-6">
        <Card>
          {/* Quick actions */}
        </Card>
      </div>
    </div>
  </div>
</div>
```

---

### 7. Toast Notifications

**Success Feedback:**
```tsx
toast.success("Workflow deployed successfully!", {
  description: "Your workflow is now live at workflow.example.com",
  action: {
    label: "Open",
    onClick: () => window.open("/workflow/123"),
  },
});
```

**Error Handling:**
```tsx
toast.error("Failed to execute workflow", {
  description: error.message,
  action: {
    label: "Retry",
    onClick: () => retryExecution(),
  },
});
```

**Execution Progress:**
```tsx
const toastId = toast.loading("Executing workflow...", {
  description: "Step 1 of 5: Fetching data",
});

// Update progress
toast.loading("Executing workflow...", {
  id: toastId,
  description: "Step 2 of 5: Processing with GPT-4",
});

// Complete
toast.success("Workflow completed!", { id: toastId });
```

---

## 📐 Spacing & Layout Standards

### Container Pattern
```tsx
// Always use for content centering
<div className="container mx-auto px-4 py-8">
```

### Section Spacing
```tsx
// Between major sections
<div className="space-y-8">

// Between cards
<div className="space-y-6">

// Between form fields
<div className="space-y-4">

// Between small elements
<div className="space-y-2">
```

### Grid Patterns
```tsx
// Dashboard: 2/3 main + 1/3 sidebar
<div className="grid lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">{/* Main */}</div>
  <div>{/* Sidebar */}</div>
</div>

// Canvas tools grid
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

// Workflow cards
<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
```

---

## 🎭 Animation Timing

**Standard Durations:**
- **Fast (0.3s):** Hover effects, micro-interactions
- **Standard (0.6s):** Page transitions, card animations
- **Slow (0.9s):** Dramatic reveals, modal entrances

**Easing Functions:**
- **ease-in-out:** Most animations (default)
- **spring:** Playful interactions (dragging, snapping)
- **linear:** Loaders, progress indicators

---

## 🎨 Typography System

### Headings
```tsx
<h1 className="text-3xl md:text-4xl font-bold">Page Title</h1>
<h2 className="text-2xl font-semibold">Section Title</h2>
<h3 className="text-xl font-semibold">Card Title</h3>
<h4 className="text-lg font-medium">Subsection</h4>
```

### Body Text
```tsx
<p className="text-base text-foreground">Primary text</p>
<p className="text-sm text-muted-foreground">Secondary text</p>
<p className="text-xs text-muted-foreground">Metadata</p>
```

---

## 🎯 Component Library Checklist

### Phase 3 (Canvas UI) - Must Install:
```bash
npx shadcn@latest add button card input label badge separator tabs dialog dropdown-menu popover tooltip context-menu
npm install framer-motion lucide-react
```

### Phase 2 (Auth) - Must Install:
```bash
npx shadcn@latest add form input button card
npm install react-hook-form @hookform/resolvers zod
npm install sonner  # Toast notifications
```

### Phase 4+ (Advanced UI):
```bash
npx shadcn@latest add table progress skeleton accordion collapsible sheet drawer
npm install recharts  # For analytics charts
```

---

## ✅ UI Implementation Checklist (Phase 3)

### Setup
- [ ] Install Tailwind CSS (already done in Phase 1!)
- [ ] Initialize shadcn/ui
- [ ] Install Framer Motion
- [ ] Install Lucide icons
- [ ] Set up color system in CSS

### Core Components
- [ ] Update App.tsx with gradient backgrounds
- [ ] Add backdrop blur to header
- [ ] Create card-based layouts
- [ ] Add Framer Motion to page transitions
- [ ] Implement toast notifications

### Canvas-Specific
- [ ] Design node components with glass effect
- [ ] Create node palette sidebar
- [ ] Build connection lines with SVG
- [ ] Add drag animations
- [ ] Create chat preview panel
- [ ] Implement execution animations

### Polish
- [ ] Add loading states
- [ ] Create empty states
- [ ] Add hover effects everywhere
- [ ] Test dark mode
- [ ] Ensure mobile responsiveness

---

## 🎨 Key Visual Rules

### ✓ Always:
1. Use gradient backgrounds on pages
2. Add backdrop blur to headers/overlays
3. Animate page entrances
4. Use status colors consistently (blue=active, green=success, red=error)
5. Add subtle shadows to cards
6. Include icons with text
7. Show loading/progress states
8. Provide user feedback (toasts)
9. Use responsive grids
10. Test both light and dark mode

### ✗ Never:
1. Use flat, boring backgrounds
2. Skip animations
3. Ignore hover states
4. Use random colors (use CSS variables)
5. Forget loading states
6. Have unclear status indicators
7. Make tiny touch targets
8. Overcrowd the UI
9. Use inconsistent spacing
10. Forget mobile users

---

## 🎯 AgentWeave Visual Goals

Our UI should feel:
- **Professional** - Like an enterprise SaaS product
- **Modern** - Latest design trends (2026)
- **Friendly** - Approachable, not intimidating
- **Fast** - Smooth, responsive animations
- **Polished** - Every detail considered
- **Delightful** - Subtle surprises that make users smile

---

## 📚 Quick Reference

### Essential Imports
```tsx
// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Icons
import { Play, CheckCircle, AlertCircle, Zap } from "lucide-react";

// Animation
import { motion } from "framer-motion";

// Notifications
import { toast } from "sonner";
```

### Common Patterns
```tsx
// Page wrapper
<div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">

// Section
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>

// Card
<Card className="shadow-accent">

// Status badge
<Badge className="bg-success text-success-foreground">
  <CheckCircle className="h-3 w-3 mr-1" />
  Active
</Badge>

// Button with icon
<Button>
  <Play className="h-4 w-4 mr-2" />
  Execute
</Button>
```

---

**🎨 Remember:** Every pixel matters. AgentWeave should feel like a premium, professional product that users love to use!
