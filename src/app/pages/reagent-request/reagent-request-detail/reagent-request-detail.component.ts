import { Component, OnInit, inject } from '@angular/core';
import { ReagentRequestService } from '../reagent-request-page/reagent-request-page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReagentRequestList } from '../reagent-request-page/reagent-request-page.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { MoleculeStructureComponent } from '../../../shared/components/molecule-structure/molecule-structure.component';
import { TableLoaderSpinnerComponent } from '../../../shared/components/table-loader-spinner/table-loader-spinner.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DISPLAY_EXTENSION } from '../../../shared/units/display.units';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reagent-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MoleculeStructureComponent,
    TableLoaderSpinnerComponent,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './reagent-request-detail.component.html',
  styleUrl: './reagent-request-detail.component.scss',
})
export class ReagentRequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private reagentRequestService = inject(ReagentRequestService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  reagentRequest: ReagentRequestList | null = null;
  isLoading = true;
  display$ = inject(DISPLAY_EXTENSION);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reagentRequestService.getReagentRequestById(+id).subscribe({
        next: (data) => {
          this.reagentRequest = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching reagent request:', error);
          this.isLoading = false;
        },
      });
    }
  }
}
