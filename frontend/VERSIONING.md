# Version Management

IPGrok uses semantic versioning (SemVer) to track application versions.

## Current Version

**v1.0.5** - Latest stable release

## Version Format

- **Major.Minor.Patch** (e.g., 1.0.5)
- **Major**: Breaking changes, major feature additions
- **Minor**: New features, non-breaking changes
- **Patch**: Bug fixes, minor improvements

## How to Bump Version

### Using npm scripts (Recommended)

```bash
# Bump patch version (1.0.5 → 1.0.6)
npm run version:patch

# Bump minor version (1.0.5 → 1.1.0)
npm run version:minor

# Bump major version (1.0.5 → 2.0.0)
npm run version:major
```

### Manual Version Update

1. Edit `src/config/version.ts`
2. Update `APP_VERSION` constant
3. Add new entry to `VERSION_HISTORY` array
4. Update the changes list with what was modified

## Version History

### v1.0.5 (2025-01-17)
- Added progress indicators for Quick Test
- Fixed Quick Test functionality
- Added Contact Us page with bot deterrents
- Added About Us page
- Fixed Detailed Analytics flow progression

### v1.0.0 (2025-01-17)
- Initial release
- Network testing capabilities
- System information gathering
- Quick Test functionality
- Detailed Analytics workflow

## When to Bump Versions

### Patch (x.x.X)
- Bug fixes
- Minor UI improvements
- Performance optimizations
- Documentation updates

### Minor (x.X.x)
- New features
- Enhanced functionality
- UI/UX improvements
- New test types

### Major (X.x.x)
- Breaking changes
- Major architectural changes
- Complete UI redesigns
- New major features

## Best Practices

1. **Always bump version** when making changes
2. **Document changes** in the version history
3. **Use descriptive change messages**
4. **Test thoroughly** after version bump
5. **Commit version changes** with feature commits

## File Locations

- **Version Config**: `src/config/version.ts`
- **Version Script**: `scripts/bump-version.js`
- **Displayed In**: Header and Footer components
