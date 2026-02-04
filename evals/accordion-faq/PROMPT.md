Add an FAQ accordion section to the existing page using Base UI's Accordion component.

Requirements:
- Import Accordion from `@base-ui/react/accordion`
- Keep all existing content (the h1 and intro paragraph) unchanged
- Add an `Accordion.Root` below the existing content
- Add exactly 3 `Accordion.Item` entries:
  1. Question: "What is Base UI?" / Answer: "Base UI is a headless component library for React."
  2. Question: "Is it accessible?" / Answer: "Yes, all components follow WAI-ARIA guidelines."
  3. Question: "Can I style it myself?" / Answer: "Yes, Base UI provides unstyled components."
- Each item must use the pattern: `Accordion.Item` > `Accordion.Header` > `Accordion.Trigger` for the question, and `Accordion.Panel` for the answer
- The first item should be open by default (use `defaultValue` on Root with the value matching the first item)
- Export the component as default
