# Değişiklikleri Geri Alma Kılavuzu

## Git Kullanarak Geri Alma

Eğer projenizde Git kullanıyorsanız, tüm değişiklikleri geri almak için:

### 1. Önce mevcut değişiklikleri commit edin (backup için):
```bash
git add .
git commit -m "Modern UI updates - backup before revert"
```

### 2. Geri almak isterseniz:
```bash
# Tüm değişiklikleri geri al
git reset --hard HEAD~1

# VEYA belirli bir commit'e dönmek için:
git log  # commit hash'lerini görmek için
git reset --hard <commit-hash>
```

## Manuel Geri Alma

Eğer Git kullanmıyorsanız, aşağıdaki dosyaları eski hallerine getirebilirsiniz:

### Değiştirilen Dosyalar:

1. **src/app/app.component.html** - Navbar yapısı
2. **src/app/app.component.scss** - Navbar stilleri
3. **src/app/app.component.ts** - Navbar fonksiyonları
4. **src/app/ui/components/home/home.component.html** - Home sayfası
5. **src/app/ui/components/home/home.component.scss** - Home stilleri
6. **src/app/ui/components/notes/list/list.component.html** - Notes listesi
7. **src/app/ui/components/notes/list/list.component.scss** - Notes stilleri
8. **src/app/ui/components/notes/list/list.component.ts** - Notes fonksiyonları
9. **src/app/ui/components/login/login.component.html** - Login formu
10. **src/app/ui/components/login/login.component.scss** - Login stilleri
11. **src/app/ui/components/register/register.component.html** - Register formu
12. **src/app/ui/components/register/register.component.scss** - Register stilleri
13. **src/app/ui/components/profiles/profiles.component.html** - Profile sayfası
14. **src/app/ui/components/profiles/profiles.component.scss** - Profile stilleri
15. **src/app/ui/components/bookmarks/bookmarks.component.html** - Bookmarks sayfası
16. **src/app/ui/components/bookmarks/bookmarks.component.scss** - Bookmarks stilleri
17. **src/app/ui/components/notes-detail/notes-detail.component.html** - Notes detail
18. **src/app/ui/components/notes-detail/notes-detail.component.scss** - Notes detail stilleri
19. **src/styles.scss** - Global stiller

## VS Code ile Geri Alma

VS Code'da Ctrl+Z ile geri alabilirsiniz veya:
1. Source Control panelini açın (Ctrl+Shift+G)
2. Değişiklikleri görebilir ve dosya bazında geri alabilirsiniz

## Yedekleme Önerisi

Yeni tasarımları beğenmezseniz geri dönmek için şimdi bir yedek alın:

```bash
# Git kullanıyorsanız:
git add .
git commit -m "Backup before modern UI changes"

# Git kullanmıyorsanız:
# Tüm src klasörünü kopyalayın ve başka bir yere kaydedin
```

