// demo.component.ts
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TimezoneService } from '../../services/timezone.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateTime } from 'luxon';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './default-demo.component.html',
})
export class DefaultDemoComponent {
  private _timezoneService = inject(TimezoneService);
  private _defaultDate = '2025-12-31T23:30:00Z';
  public currentDate = DateTime.fromISO(this._defaultDate, {
    zone: this._timezoneService.currentTimezone(),
  });

  currentZone = computed(() => this._timezoneService.currentTimezone());

  setZone(zone: string) {
    this._timezoneService.currentTimezone.set(zone);
  }

  resetValue() {
    this.currentDate = DateTime.fromISO(this._defaultDate, {
      zone: this._timezoneService.currentTimezone(),
    });
  }
}
