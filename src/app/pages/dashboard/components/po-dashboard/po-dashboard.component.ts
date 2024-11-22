import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { MaterialModule } from '../../../../material.module';
import { ChartOptions } from '../../models/chart.model';
import { chartOptions as statusChartOptions } from '../../charts/donut.chart';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-po-dashboard',
  standalone: true,
  imports: [MaterialModule, ChartComponent, DatePipe, RouterLink],
  templateUrl: './po-dashboard.component.html',
  styleUrl: './po-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoDashboardComponent {
  public displayedColumns: string[] = [
    'title',
    'seller',
    'status',
    'createdAt',
    'updatedAt',
  ];
  public OrdersListData = {
    orders: [
      {
        id: 60,
        userId: 3,
        title: 'to see if order can be created on already used RR',
        seller: 'Aversi',
        status: 'Pending',
        createdAt: '2024-11-12T08:59:23.531Z',
        updatedAt: '2024-11-19T03:55:34.955Z',
        reagents: [],
        reagentCount: 0,
      },
      {
        id: 61,
        userId: 3,
        title: "Azat's order",
        seller: 'Aversi',
        status: 'Pending',
        createdAt: '2024-11-12T09:07:04.675Z',
        updatedAt: '2024-11-19T04:17:04.119Z',
        reagents: [],
        reagentCount: 0,
      },
      {
        id: 62,
        userId: 3,
        title: 'testing',
        seller: 'Pharmadepo',
        status: 'Pending',
        createdAt: '2024-11-15T05:51:05.239Z',
        updatedAt: '2024-11-17T18:33:35.430Z',
        reagents: [],
        reagentCount: 0,
      },
      {
        id: 63,
        userId: 3,
        title: 'test',
        seller: 'Bricorama',
        status: 'Pending',
        createdAt: '2024-11-17T23:20:19.444Z',
        updatedAt: '2024-11-17T23:59:32.227Z',
        reagents: [
          {
            id: 18,
            userId: 5,
            name: 'Iron',
            structureSmiles: 'C1CCCCC1',
            casNumber: '111',
            desiredQuantity: 100,
            quantityUnit: 'g',
            userComments: 'Yes',
            procurementComments: null,
            status: 'Ordered',
            createdAt: '2024-11-08T11:33:08.051Z',
            updatedAt: '2024-11-17T23:20:19.444Z',
            orderId: 63,
            package: null,
            producer: null,
            catalogId: null,
            catalogLink: null,
            pricePerUnit: null,
            expirationDate: null,
            hide: false,
          },
        ],
        reagentCount: 1,
      },
      {
        id: 64,
        userId: 3,
        title: 'testing remove RR',
        seller: 'Pharmadepo',
        status: 'Pending',
        createdAt: '2024-11-18T10:54:05.782Z',
        updatedAt: '2024-11-19T04:00:09.119Z',
        reagents: [],
        reagentCount: 0,
      },
      {
        id: 65,
        userId: 3,
        title: 'test removing last RR',
        seller: 'Bo1',
        status: 'Pending',
        createdAt: '2024-11-19T04:22:34.959Z',
        updatedAt: '2024-11-19T04:23:43.263Z',
        reagents: [],
        reagentCount: 0,
      },
      {
        id: 66,
        userId: 3,
        title: 'test 3',
        seller: 'Aversi',
        status: 'Pending',
        createdAt: '2024-11-19T04:22:58.902Z',
        updatedAt: '2024-11-19T05:01:50.182Z',
        reagents: [],
        reagentCount: 0,
      },
      {
        id: 67,
        userId: 3,
        title: 'test 4',
        seller: 'Bricorama',
        status: 'Pending',
        createdAt: '2024-11-19T04:23:16.698Z',
        updatedAt: '2024-11-19T04:42:17.845Z',
        reagents: [],
        reagentCount: 0,
      },
    ],
    size: 8,
  };
  public statusChartOptions: Partial<ChartOptions> = statusChartOptions(
    [21, 10, 32, 5],
    ['Pending', 'Ordered', 'Fulfilled', 'Declined'],
    'Order status'
  );
}
