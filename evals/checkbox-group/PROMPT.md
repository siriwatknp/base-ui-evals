Build a group of checkboxes using Base UI's Checkbox component for a preferences form.

Requirements:
- Import Checkbox from `@base-ui/react/checkbox`
- Create exactly 3 checkboxes with these labels and names:
  1. label "Email updates", name="email"
  2. label "SMS alerts", name="sms"
  3. label "Push notifications", name="push"
- Each checkbox must use `Checkbox.Root` with a `Checkbox.Indicator` inside it
- The "Email updates" checkbox should be checked by default (use `defaultChecked`)
- Each checkbox must have a visible `<label>` element with the text
- Wrap everything in a `<fieldset>` with `<legend>` text "Notification Preferences"
- Export the component as default
