# MindBloom Design System

This file defines the visual language for MindBloom.

## Core Vibe

The interface uses a clean editorial style. The layout is simple, calm, and developer first.

## Color System

The colors make the application feel calm and minimal.

* Background: #F8F8F5 (Soft white background)
* Foreground: #111111 (Ink color for text)
* Muted text: #6B6B67 (Secondary text color)
* Subtle text: #8A8A84 (Less prominent details)
* Border: #E5E5E0 (Dividers and structural lines)
* Input border: #DCDCD6 (Forms and interactive borders)
* Surface: #FFFFFF (Elevated cards and panels)
* Surface muted: #F3F3EF (Muted elements and secondary panels)
* Primary: #111111 (Core buttons and focus elements)
* Primary foreground: #F8F8F5 (Text on primary buttons)

## Typography

We use two font families for the interface.

1. Instrument Serif
This is the display font. It is elegant and expressive. Use it for:
* Hero headers
* Large section titles
* Editorial numbers
* Important quotes

2. Inter
This is the sans serif font. It is modern and readable. Use it for:
* Main paragraphs
* Navigation items
* Button labels
* Form fields
* Chat text

### Font Weight Guide for Inter
* 400: Body copy
* 500: Label text and navigation links
* 600: Button text and highlighted words
* 700: UI headings

## CSS Variables

We map the colors to standard Tailwind CSS variables. The variables use HSL coordinates to support styling.

* --background: 60 9% 96.7% (maps to #F8F8F5)
* --foreground: 0 0% 6.7% (maps to #111111)
* --card: 0 0% 100% (maps to #FFFFFF)
* --card-foreground: 0 0% 6.7% (maps to #111111)
* --popover: 0 0% 100% (maps to #FFFFFF)
* --popover-foreground: 0 0% 6.7% (maps to #111111)
* --primary: 0 0% 6.7% (maps to #111111)
* --primary-foreground: 60 9% 96.7% (maps to #F8F8F5)
* --secondary: 60 11% 94.5% (maps to #F3F3EF)
* --secondary-foreground: 0 0% 6.7% (maps to #111111)
* --muted: 60 11% 94.5% (maps to #F3F3EF)
* --muted-foreground: 60 2% 41.2% (maps to #6B6B67)
* --accent: 60 11% 94.5% (maps to #F3F3EF)
* --accent-foreground: 0 0% 6.7% (maps to #111111)
* --border: 60 7% 88.8% (maps to #E5E5E0)
* --input: 60 7% 85.1% (maps to #DCDCD6)
* --ring: 0 0% 6.7% (maps to #111111)
