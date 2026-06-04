# Project Context

## Project Overview
Myanmar Swine Livestock Co., Ltd. corporate website with CMS backend. Features multi-language support (Burmese, English, Chinese), live pig pricing, green energy metrics, knowledge hub, and full admin content management.

## Key Decisions
| Date | Decision | By | Rationale |
|------|----------|-----|-----------|
| 2026-06-03 | Use Atoms Cloud backend for CMS | Alex | Need database for content management, prices, settings |
| 2026-06-03 | Burmese as default language | Alex | User requirement - Myanmar company |
| 2026-06-03 | Single-page sections with React Router | Alex | Better UX for corporate site |

## Constraints
- Color Scheme: Green (#16a34a) primary for sustainability theme, dark green (#166534) accents, warm gold (#d97706) for highlights
- Typography: Clean sans-serif, support for Myanmar/Burmese and Chinese characters
- Layout: Modern corporate with large hero images, card-based sections
- Languages: Burmese (default), English, Chinese - all toggleable from admin
- CO2 calculation: 2000kWh/day, grid emission factor ~0.7 kg CO2/kWh for Myanmar
- Images to generate: hero banner (farm), pig products, solar/biogas, biosecurity (4 images)