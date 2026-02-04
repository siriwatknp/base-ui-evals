Build a tabbed navigation using Base UI's Tabs component with 3 tabs.

Requirements:
- Import Tabs from `@base-ui/react/tabs`
- Create a `Tabs.Root` with `defaultValue="overview"`
- Inside `Tabs.List`, add 3 tabs:
  1. `value="overview"`, text "Overview"
  2. `value="features"`, text "Features"
  3. `value="pricing"`, text "Pricing"
- Add a `Tabs.Indicator` inside `Tabs.List` (after the Tab elements)
- Add 3 corresponding `Tabs.Panel` components (outside `Tabs.List`, inside `Tabs.Root`):
  1. `value="overview"`, containing a `<p>` with text "Welcome to our product overview."
  2. `value="features"`, containing a `<ul>` with at least 2 `<li>` feature items
  3. `value="pricing"`, containing a `<p>` with text "Starting at $9.99/month"
- Export the component as default
