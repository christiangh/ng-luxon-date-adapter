import { effect, inject, Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { TimezoneService } from '../services/timezone.service';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  private readonly timezoneService = inject(TimezoneService);

  constructor() {
    super();

    effect(() => {
      this.setLocale('es-ES');
      return this.timezoneService.currentTimezone();
    });
  }

  override createDate(year: number, month: number, date: number): Date {
    return new Date(Date.UTC(year, month, date));
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string') {
      const d = new Date(value);
      return this.toCanary(d);
    }
    return value ? this.toCanary(value) : null;
  }

  override format(date: Date, displayFormat: any): string {
    return new Intl.DateTimeFormat('es-ES', {
      timeZone: this.timezoneService.currentTimezone(),
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }

  private toCanary(date: Date): Date {
    const formatter = new Intl.DateTimeFormat('es-ES', {
      timeZone: this.timezoneService.currentTimezone(),
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });

    const parts = formatter.formatToParts(date);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);

    return new Date(
      get('year'),
      get('month') - 1,
      get('day'),
      get('hour'),
      get('minute'),
      get('second'),
    );
  }
}
