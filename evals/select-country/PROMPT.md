Build a country selector using Base UI's Select component.

Requirements:
- Import Select from `@base-ui/react/select`
- Create a `Select.Root` with `defaultValue="us"`
- The `Select.Trigger` must contain:
  - `Select.Value` to display the selected value
  - `Select.Icon` (can contain any arrow/chevron character like "▼")
- Use `Select.Portal` > `Select.Positioner` > `Select.Popup` > `Select.List` structure for the dropdown
- Inside `Select.List`, render exactly 4 `Select.Item` components:
  1. `value="us"`, text "United States"
  2. `value="uk"`, text "United Kingdom"
  3. `value="ca"`, text "Canada"
  4. `value="au"`, text "Australia"
- Each `Select.Item` must contain `Select.ItemText` with the country name
- Each `Select.Item` must contain `Select.ItemIndicator` (for the check mark)
- Export the component as default
