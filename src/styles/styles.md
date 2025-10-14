# Styles Guide

## Using Style Partials

Import partials in your component SCSS files:

```scss
@use 'colors' as *;
@use 'mixins' as *;
@use 'typography' as *;
```

## Colors

Access color variables directly:

```scss
.my-component {
  background-color: $primary-color;
  color: $text-color;
}
```

## Mixins

### Layout Mixins

```scss
.centered-content {
  @include flex-center;
}

.sidebar {
  @include flex-column;
}
```

### Responsive Mixins

```scss
.responsive-element {
  width: 100%;

  @include mobile-large {
    width: 80%;
  }

  @include tablet {
    width: 60%;
  }

  @include desktop {
    width: 40%;
  }
}
```

## Typography

Use typography variables for consistent text styling:

```scss
.heading {
  font-family: $font-primary;
  font-size: $font-size-large;
}
```

## Component Mixins

Import component mixins in your SCSS files:

```scss
@use 'components' as *;
```

### Button Mixins

Button mixins provide consistent styling and behavior across all buttons in the application.

#### Primary Button

Applies brand-colored background with hover and disabled states. Use for main actions.

```scss
.my-primary-btn {
  @include button-primary;
}
```

#### Outline Button

Creates a transparent button with brand-colored border. Fills with brand color on hover.

```scss
.my-outline-btn {
  @include button-outline;
}
```

#### Custom Button (using base)

Use `button-base` to create custom button variants while maintaining consistent padding, typography, and transitions.

```scss
.my-custom-btn {
  @include button-base;
  background-color: $green-fill;
  color: $green-text;

  &:hover {
    background-color: $green-stroke-weak;
  }
}
```

### Form Field Mixin

Provides consistent styling for form inputs with labels. Creates a vertical layout with proper spacing and typography.

```scss
.form-group {
  @include base-field;
}
```

HTML structure:

```html
<div class="form-group">
  <label for="email">Email</label>
  <input type="email" id="email" placeholder="Enter email" />
</div>
```

### Alert Mixins

Alert mixins create notification boxes with consistent layout, colors, and responsive behavior. Each variant uses semantic colors for different message types.

#### Error Alert

Red-themed alert for error messages and critical notifications.

```scss
.error-alert {
  @include alert-error;
}
```

#### Success Alert

Green-themed alert for success confirmations and positive feedback.

```scss
.success-alert {
  @include alert-success;
}
```

#### Info Alert

Brand-colored alert for informational messages and neutral notifications.

```scss
.info-alert {
  @include alert-info;
}
```

#### Warning Alert

Amber-themed alert for warnings and cautionary messages.

```scss
.warning-alert {
  @include alert-warning;
}
```

HTML structure for alerts:

```html
<div class="error-alert">
  <div class="alert-icon">⚠️</div>
  <div class="alert-content">
    <div class="alert-header">
      <div class="alert-title">Error</div>
      <div class="alert-close">✕</div>
    </div>
    <div class="alert-message">Something went wrong!</div>
  </div>
</div>
```

#### Custom Alert

Use `alert-box` with custom color parameters to create themed alerts for specific use cases.

```scss
.custom-alert {
  @include alert-box($purple-fill, $purple-stroke-weak, $purple-text);
}
```

## Best Practices

1. Always use `@use` instead of `@import`
2. Import only the partials you need
3. Follow mobile-first approach with responsive mixins
4. Use semantic color variables, not direct color values
5. Combine component mixins with layout mixins for complex components
6. Use button-base for custom button variants
7. Structure alert HTML correctly for proper styling
