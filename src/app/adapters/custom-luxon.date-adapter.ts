import { Injectable, inject, effect } from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateTime } from 'luxon';
import { TimezoneService } from '../services/timezone.service';

@Injectable()
export class CustomLuxonDateAdapter extends LuxonDateAdapter {
  private readonly timezoneService = inject(TimezoneService);

  constructor() {
    super();

    effect(() => {
      this.setLocale('es-ES');
      return this.timezoneService.currentTimezone();
    });
  }

  override deserialize(value: any): DateTime | null {
    const zone = this.timezoneService.currentTimezone();

    if (value == null) return null;

    if (DateTime.isDateTime(value)) {
      return value.setZone(zone);
    }

    if (value instanceof Date) {
      return DateTime.fromJSDate(value, { zone });
    }

    if (typeof value === 'string') {
      // Try ISO first, then fall back to JS Date parsing
      const dt = DateTime.fromISO(value, { zone });
      if (dt.isValid) return dt;

      const js = new Date(value);
      if (!isNaN(js.getTime())) return DateTime.fromJSDate(js, { zone });

      return null;
    }

    if (typeof value === 'number') {
      return DateTime.fromMillis(value, { zone });
    }

    try {
      // Last resort: try to treat as JS Date-like
      return DateTime.fromJSDate(value as Date, { zone });
    } catch {
      return null;
    }
  }

  override createDate(year: number, month: number, day: number): DateTime {
    return DateTime.fromObject(
      { year, month: month + 1, day },
      { zone: this.timezoneService.currentTimezone() },
    );
  }

  override format(date: DateTime, displayFormat: string): string {
    return date
      .setZone(this.timezoneService.currentTimezone())
      .toFormat(displayFormat);
  }
}
