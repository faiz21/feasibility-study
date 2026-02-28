# Template Format Checklist

Use this checklist before generating output JSON.

1. Confirm top-level shape:
- Object or array
- Required top-level keys

2. Confirm field contracts:
- Field name (exact spelling)
- Type (`string`, `number`, `boolean`, `object`, `array`, `null`)
- Required/optional status

3. Confirm nested structures:
- Child object keys
- Array item structure (primitive or object)

4. Confirm normalization rules:
- Date format
- Number precision
- Enum values (if fixed choices are expected)

5. Confirm multilingual mapping:
- Ensure content exists for `en`, `id`, and `ja` where translatable text is required
- Keep the same source meaning across all three languages
- Preserve non-translated terms consistently across language variants

6. Confirm fallback policy:
- Use template default when provided
- Otherwise use `null` for unknown values unless user specifies another fallback

7. Validate final JSON:
- Parse successfully as JSON
- Match template key names and structure
- No extra keys unless user explicitly allows them
