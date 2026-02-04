Build a confirmation dialog using Base UI's Dialog component.

Requirements:
- Import Dialog from `@base-ui/react/dialog`
- Create a `Dialog.Root` containing a `Dialog.Trigger` button with text "Delete Account"
- The dialog must use `Dialog.Portal` containing:
  - `Dialog.Backdrop`
  - `Dialog.Popup` containing:
    - `Dialog.Title` with text "Delete Account"
    - `Dialog.Description` with text "This action cannot be undone. Are you sure?"
    - A "Cancel" button using `Dialog.Close`
    - A "Confirm" button using `Dialog.Close`
- The dialog should be modal (default behavior)
- Export the component as default
