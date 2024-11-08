import { Component, OnInit, inject } from '@angular/core';
import { ReagentRequestService } from '../reagent-request-page/reagent-request-page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReagentRequestList } from '../reagent-request-page/reagent-request-page.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { MoleculeStructureComponent } from '../../../shared/components/molecule-structure/molecule-structure.component';
import { SpinnerDirective } from '../../../shared/directives/spinner/spinner.directive';
import { TableLoaderSpinnerComponent } from '../../../shared/components/table-loader-spinner/table-loader-spinner.component';

@Component({
  selector: 'app-reagent-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MoleculeStructureComponent,
    SpinnerDirective,
    TableLoaderSpinnerComponent,
  ],
  templateUrl: './reagent-request-detail.component.html',
  styleUrls: ['./reagent-request-detail.component.scss'],
})
export class ReagentRequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private reagentRequestService = inject(ReagentRequestService);
  private router = inject(Router);

  reagentRequest: ReagentRequestList | null = null;
  isLoading = true;

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

  goBack() {
    this.router.navigate(['/reagent-request-page']);
  }
}
