import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageLocationItem } from '../storage-location/models/storage-location.interface';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-storage-location-detail',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './storage-location-detail.component.html',
  styleUrl: './storage-location-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageLocationDetailComponent implements OnInit {
  public data = signal<StorageLocationItem | undefined>(undefined);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.data.set(JSON.parse(queryParams['data']));
    });
  }
}
