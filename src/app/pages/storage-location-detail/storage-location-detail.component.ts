import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageLocationItem } from '../storage-location/models/storage-location.interface';
import { MaterialModule } from '../../material.module';
import { ReagentsListComponent } from '../reagents-list/reagents-list.component';
import { AsyncPipe } from '@angular/common';
import { Observable, take } from 'rxjs';
import { StorageLocationService } from '../storage-location/services/storage-location.service';

@Component({
  selector: 'app-storage-location-detail',
  standalone: true,
  imports: [MaterialModule, ReagentsListComponent, AsyncPipe],
  templateUrl: './storage-location-detail.component.html',
  styleUrl: './storage-location-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorageLocationDetailComponent implements OnInit {
  public storageLocation$?: Observable<StorageLocationItem>;

  private route = inject(ActivatedRoute);
  private storageLocationService = inject(StorageLocationService);

  ngOnInit(): void {
    this.route.params.pipe(take(1)).subscribe((params) => {
      const id = params['id'];
      this.storageLocation$ =
        this.storageLocationService.getStorageLocation(id);
    });
  }
}
