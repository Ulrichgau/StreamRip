# MP3 Stream Extractor - Design Guidelines

## Design Approach
**System**: Material Design with productivity focus
**Justification**: This is a utility-focused tool where efficiency, clarity, and data display are paramount. Users need quick access to extracted URLs without visual distractions.

**Key Principles**:
- Information hierarchy: Input → Results → Actions
- Scannable lists with clear visual separation
- One-click copy functionality
- Minimal friction from input to output

## Typography
- **Primary Font**: Inter or Roboto (Google Fonts)
- **Headings**: 
  - H1 (Tool title): text-2xl font-semibold
  - H2 (Section headers): text-lg font-medium
- **Body/URLs**: text-sm font-mono (monospace for URLs)
- **Labels**: text-sm font-medium
- **Metadata**: text-xs

## Layout System
**Spacing Units**: Tailwind 2, 4, 6, 8 (p-4, mb-6, gap-8)

**Structure**:
- Single-column centered layout (max-w-4xl mx-auto)
- Vertical flow: Header → Input Section → Results Section
- Full-height container with py-8 px-4

## Component Library

### Header Section
- Tool title and brief description
- Minimal branding, focus on utility
- pb-6 spacing before input section

### Input Section (Card Component)
- Contained in elevated card with rounded-lg
- URL input field (full-width text input)
- "Extract MP3s" action button (primary, full-width on mobile, auto on desktop)
- Loading state indicator during fetch
- Error message display area (if fetch fails)

### Results List
- Display when URLs extracted (hide when empty)
- Each result as individual card/list item with p-4, rounded border
- Result item structure:
  - MP3 filename (text-base font-semibold, truncate)
  - Full URL (text-sm font-mono, break-all)
  - Source context/metadata (text-xs muted)
  - Copy button (icon + text, aligned right)

### Empty State
- Centered message when no results
- Simple icon + text guidance
- "Paste a URL above to get started"

### Copy Functionality
- Icon button with "Copy URL" text
- Toast/snackbar confirmation on successful copy
- Clipboard icon from Heroicons

### Status Indicators
- Loading spinner during fetch
- Success message with count (e.g., "Found 5 MP3 files")
- Error states for failed fetches

## Navigation
None needed - single-page utility tool

## Forms
- Text input with clear placeholder ("https://example.com/podcast")
- Input validation (URL format check)
- Submit on button click or Enter key
- Clear input button (×) when field has content

## Data Display
- List view (not grid) for extracted URLs
- Alternating subtle backgrounds for list items
- Monospace font for all URLs (easy to read/scan)
- Truncated filenames with full URL below
- Source attribute display (from <audio>, <source>, direct link, etc.)

## Animations
None - prioritize speed and immediate feedback over animation

## Images
No images needed for this utility tool

## Accessibility
- Proper label associations for input field
- ARIA labels for copy buttons
- Keyboard navigation support (Tab through results, Enter to copy)
- Focus states on all interactive elements
- Screen reader announcements for copy success/errors