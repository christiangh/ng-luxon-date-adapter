# NgLuxonDateAdapter

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

**Proof of Concept: Custom Date Adapters**

- **Overview:** This repository contains a small PoC that demonstrates two custom Angular Material date adapters which handle locale and timezone-aware parsing/formatting. One adapter uses the browser `Intl` APIs (`NativeDateAdapter`-based) and the other uses `luxon` (`LuxonDateAdapter`-based).
- **Files:**
  - **`CustomDateAdapter`**: [src/app/adapters/custom.date-adapter.ts](src/app/adapters/custom.date-adapter.ts)
  - **`CustomLuxonDateAdapter`**: [src/app/adapters/custom-luxon.date-adapter.ts](src/app/adapters/custom-luxon.date-adapter.ts)
- **Key Behaviors**:
  - **Locale:** Both adapters set the locale to `es-ES` using an Angular `effect` so the locale updates when the adapter initializes.
  - **Timezone source:** Both adapters read the timezone from the `TimezoneService` signal `currentTimezone` (default: `Atlantic/Canary`). See `src/app/services/timezone.service.ts`.

- **`CustomDateAdapter` (`custom.date-adapter.ts`):**
  - Extends `NativeDateAdapter`.
  - `createDate` returns a UTC-based `Date` using `Date.UTC` to avoid local timezone shifts.
  - `parse` accepts strings and other values; string parsing is normalized to a local "canary" Date via `toCanary`, which uses `Intl.DateTimeFormat(..., { timeZone })` and `formatToParts` to rebuild a JS `Date` in the selected timezone.
  - `format` uses `Intl.DateTimeFormat` with the selected timezone to render day/month/year in `es-ES`.

- **`CustomLuxonDateAdapter` (`custom-luxon.date-adapter.ts`):**
  - Extends `LuxonDateAdapter` and works with `luxon`'s `DateTime` objects.
  - `createDate` builds a `DateTime` with `DateTime.fromObject(..., { zone })` so created dates are tied to the configured timezone.
  - `format` calls `date.setZone(zone).toFormat(displayFormat)` so formatting respects the timezone.
  - `deserialize` must accept the variety of values Angular can provide when binding with `ngModel` (ISO strings, JS `Date`, numbers, or already-constructed `DateTime`). A robust `deserialize` implementation checks for `DateTime`, `Date`, `string`, and `number` and converts to a `DateTime` using the `TimezoneService` zone. This is required so setting the model value programmatically (via `ngModel`) behaves the same as the native adapter.

- **Why the difference matters:** When Angular binds values through `ngModel` the adapter's `deserialize`/`parse` logic determines how the incoming value is converted to the adapter's internal date type. If `deserialize` only handles ISO strings, a value that is a JS `Date` (or other type) may be misinterpreted and cause different behavior between adapters. The Luxon adapter must therefore accept multiple input types and apply the timezone explicitly.

- **How to run / validate:**

```bash
# start the dev server
npm install
ng serve

# Open http://localhost:4200 and test the date inputs:
# - Try setting the model programmatically (via the demo component or console) with a JS Date, ISO string, and a Luxon DateTime.
# - Verify both adapters render the same date values when the timezone in TimezoneService is changed.
```
