# Workspace Rules

## 1. Environment Variables Security
- **QADAĞANDIR**: Heç bir halda `.env`, `.env.local`, `.env.production`, `.env.development` və ya digər `.env*` fayllarına baxılmamalı, oxunmamalı və ya daxili məlumatları istifadə edilməməlidir.

## 2. Modal və Background Styling
- **BLUR İSTİFADƏ EDİLMƏSİN**: Modalların və ya overlay-lərin arxa fonunda (`backdrop`) heç bir `blur` / `backdrop-blur` effekti istifadə edilməməlidir. Arxa fon üçün yalnız təmiz şəffaf rənglərdən (məsələn: `bg-black/50` və ya `bg-black/60`) istifadə olunmalıdır.

## 3. Responsive Dizayn və Kod Səliqəsi
- Bütün səhifələr, bölmələr, naviqasiya və modallar mobil (`sm`), planşet (`md`) və desktop (`lg`/`xl`) ekranlara tam uyğunlaşdırılmalıdır (responsive).
- Kod təkrarına yol verilməməli, sabit və statik datalar `data/` folderi daxilində saxlanılmalı, SVG ikonlar `assets/icons/` folderində yerləşdirilməlidir.

## 4. Types Management
- Bütün TypeScript tipləri və interfeysləri `types/` folderi daxilində saxlanmalı və layihə boyu `@/types` üzərindən import edilməlidir.

## 5. Koda Şərh (Comment) Yazılmaması
- **QADAĞANDIR**: Koda heç bir halda şərh (comment: `//`, `/* */`, `<!-- -->`) yazılmamalıdır. Mövcud şərhlər silinməlidir.
