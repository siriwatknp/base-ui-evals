Add an "Edit Profile" dialog to the existing page. The dialog should contain a form with Base UI Field components.

Requirements:
- Import Dialog from `@base-ui/react/dialog`
- Import Field from `@base-ui/react/field`
- Keep the existing profile card content unchanged
- Add a `Dialog.Root` with a `Dialog.Trigger` button with text "Edit Profile" below the profile card
- The Dialog must use: `Dialog.Portal` containing `Dialog.Backdrop` and `Dialog.Popup`
- `Dialog.Popup` must contain `Dialog.Title` with text "Edit Profile" and `Dialog.Description` with text "Update your personal information."
- Inside the dialog popup, add a `<form>` with two `Field.Root` components:
  1. First field: `Field.Label` "Display Name" and a `Field.Control` with `name="displayName"`
  2. Second field: `Field.Label` "Email" and a `Field.Control` with `name="email"`
- Add a submit button with text "Save Changes" inside the form
- Add a `Dialog.Close` button with text "Cancel"
- Export the component as default
