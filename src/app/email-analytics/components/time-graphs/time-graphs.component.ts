import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-time-graphs',
  templateUrl: './time-graphs.component.html',
  styleUrl: './time-graphs.component.scss'
})
export class TimeGraphsComponent {
  dialogVisible: boolean = false;
  data: any;
  options: any;

  @Input() yAxisTimes!: number[];
  @Input() clientMsgTimes!: string[];
  title!: string;
  @Input() type!: "resolution" | "response";
  @Input() avg!: number;
  displayedAvg: string = '';
  avgType!: "Avg FRT" | "Avg RT";

  constructor (private utilityService: UtilityService) {}

  ngOnInit() {
    this.updateData();
    this.title = this.type=="response" ? "First Response Time" : "Resolution Time";
    this.avgType = this.type=="response" ? "Avg FRT" : "Avg RT";
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['yAxisTimes'] || changes['clientMsgTimes'] || changes['avg']) {
      this.updateData();
    }
  }

  updateData() {
      if (this.avg < 0) {
        this.displayedAvg = "N/A";
      } else {
      this.displayedAvg = this.utilityService.convertMinutes(this.avg);
      }
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      
      const combinedData = this.clientMsgTimes.map((x, index) => ({
        x: new Date(x), // Convert to Date object
        y: this.yAxisTimes[index]
      }));

      this.data = {
          datasets: [
              {
                  label: '',
                  fill: true,
                  borderColor: this.type=="response" ? documentStyle.getPropertyValue('--green-500') : documentStyle.getPropertyValue('--blue-500'),
                  backgroundColor: this.type=="response" ? "rgba(0, 200, 100, 0.2)" : "rgba(0, 150, 255, 0.2)",
                  yAxisID: 'y',
                  tension: 0.2,
                  data: combinedData.sort((a, b) => a.x.getTime() - b.x.getTime()),
              }
          ]
      };
      
      this.options = {
          stacked: false,
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
              legend: {
                  labels: {
                      usePointStyle: true,
                      color: textColor,
                  },
                  position: "bottom",
              },
              title: {
                display: true,
                color: textColor,
                text: this.title,
                font: {
                    size: 14,
                },	
              }
          },
          scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'hour',
                  tooltipFormat: 'll HH:mm',
                  displayFormats: {
                    // hour: 'MMM D',
                    hour: 'MMM D, HH:mm'
                  }
                },
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      color: surfaceBorder
                  }
              },
              y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  grid: {
                      color: surfaceBorder
                  },
                  ticks: {
                    color: textColorSecondary,
                    callback: function(value: number) {
                        if (value <= 0) return '0m';
                        if (value < 60) {
                          return `${value}m`;
                        } else if (value < 1440) {
                          const hours = Math.floor(value / 60);
                          const minutes = value % 60;
                          return `${hours}h ${minutes}m`;
                        } else {
                          const days = Math.floor(value / 1440);
                          const hours = Math.floor((value % 1440) / 60);
                          const minutes = value % 60;
                          return `${days}d ${hours}h`;
                        }
                    },
                  },
            },
              y1: {
                  type: 'linear',
                  display: false,
                  position: 'right',
                  ticks: {
                      color: textColorSecondary
                  },
                  grid: {
                      drawOnChartArea: false,
                      color: surfaceBorder
                  }
              }
          },
          elements: {
            point: {
              pointStyle: false,
            }
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => {
                // return "hi";
                const yLabel = parseInt(tooltipItem.yLabel);
                const formattedValue = this.utilityService.convertMinutes(yLabel);
                return `${formattedValue}`;
              }
            }
          },
      };
  }
}
