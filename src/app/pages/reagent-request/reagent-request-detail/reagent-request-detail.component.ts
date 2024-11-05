import { Component, OnInit, inject } from '@angular/core';
import { ReagentRequestService } from '../reagent-request-page/reagent-request-page.service';
import { ActivatedRoute } from '@angular/router';
import { ReagentRequestList } from '../reagent-request-page/reagent-request-page.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { MoleculeStructureComponent } from '../../../shared/components/molecule-structure/molecule-structure.component';
import { SpinnerDirective } from '../../../shared/directives/spinner/spinner.directive';

@Component({
  selector: 'app-reagent-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MoleculeStructureComponent,
    SpinnerDirective,
  ],
  templateUrl: './reagent-request-detail.component.html',
  styleUrls: ['./reagent-request-detail.component.scss'],
})
export class ReagentRequestDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private reagentRequestService = inject(ReagentRequestService);

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
}
