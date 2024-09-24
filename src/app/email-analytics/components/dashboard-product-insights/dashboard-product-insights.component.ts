import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dashboard-product-insights',
  templateUrl: './dashboard-product-insights.component.html',
  styleUrl: './dashboard-product-insights.component.scss'
})
export class DashboardProductInsightsComponent {
  dialogVisible = false;
  @Input() intervalInDaysStart!: number;
  @Input() intervalInDaysEnd!: number;
  @Input() product_labels!: string[];
  @Input() product_performance_scores!: number[];

  popup() {
    this.dialogVisible = true;
  }

  data: any;
  options: any;

  ngOnInit() {
    this.updateData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product_performance_scores'] ) {
      this.updateData()
    }
  }

  updateData(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
        labels: this.product_labels,
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: this.product_performance_scores,

                barPercentage: 0.3,
                categoryPercentage: 1,
            },
        ]
    };

    this.options = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                display: false,
                labels: {
                    color: textColor,
                }
            },
            title: {
              display: true,
              color: textColor,
              text: 'Product Insights',
              font: {
                  size: 14,
              }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false,
                    offset: false,
                },
            }
        }
    };
  }
}
