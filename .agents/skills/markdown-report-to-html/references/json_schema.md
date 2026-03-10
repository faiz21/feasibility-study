# JSON schema (v0)

This skill generates a single JSON file that drives the final HTML renderer.

## Top-level shape

```json
{
  "metadata": {
    "title": "string",
    "client": "string",
    "scope": "string",
    "date": "YYYY-MM-DD",
    "status": "Draft|Final|..."
  },
  "theme": {
    "palette": {
      "primary": "#RRGGBB",
      "primaryHover": "#RRGGBB",
      "primaryBg": "#RRGGBB",
      "primaryBorder": "#RRGGBB",
      "primaryText": "#RRGGBB",
      "bg": "#RRGGBB",
      "surface": "#RRGGBB",
      "text": "#RRGGBB",
      "textMuted": "#RRGGBB",
      "border": "#RRGGBB",
      "accentOrange": "#RRGGBB",
      "accentRed": "#RRGGBB",
      "accentBlue": "#RRGGBB"
    }
  },
  "sections": [
    {
      "id": 1,
      "title": "string",
      "components": [
        {
          "type": "MarkdownBlock",
          "title": "string|null",
          "html": "string"
        },
        {
          "type": "ChartBlock",
          "title": "string|null",
          "chartType": "bar|line|pie",
          "data": {
            "label": "string",
            "labels": ["string"],
            "values": [0]
          }
        }
      ]
    }
  ]
}
```

## Notes

- `components[].html` is pre-rendered HTML from Markdown.
- `ChartBlock` is optional and only used when the user confirms adding sample charts.

