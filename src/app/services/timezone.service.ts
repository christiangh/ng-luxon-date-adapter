// timezone.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimezoneService {
  currentTimezone = signal<string>('Atlantic/Canary');

  getAllTimezones(): string[] {
    return ['Europe/Madrid', 'Atlantic/Canary'];
  }
}
