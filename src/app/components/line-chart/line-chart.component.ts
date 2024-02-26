import { Component, OnInit, Input } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @Input() milesStates: number[] = [];
  @Input() dates: Date[] = [];

  chart: any;
  data: any;
  formatedDates: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    this.formatedDates = this.formatDates(this.dates);
    console.log(this.formatedDates);

    this.formatedDates = [
      '19.05.2023, 15:29',
      '21.05.2023, 11:20',
      '23.05.2023, 13:57',
      '29.05.2023, 18:08'
    ];
    this.milesStates = [30234, 1165, 31672, 32399]; //na potrzeby screenów do pracy

    this.data = {
      labels: this.formatedDates,
      datasets: [
        {
          label: 'Stan licznika',
          data: this.milesStates,
          fill: true,
          borderColor: '#3f51b5',
          tension: 0.1
        }
      ]
    };
    this.chart = new Chart('MyChart', {
      type: 'line',
      data: this.data,
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Data',
              font: {
                size: 14,
                lineHeight: 2
              }
            },
            ticks: {
              callback: function (val) {
                return this.getLabelForValue(<number>val).slice(0, -7);
              }
            }
          },
          y: {
            title: {
              display: true,
              text: 'Przebieg',
              font: {
                size: 14,
                lineHeight: 2
              }
            }
          }
        }
      }
    });
  }

  formatDates(dates: Date[]): string[] {
    const formattedDates: string[] = [];

    dates.forEach((date) => {
      formattedDates.push(
        // `${date.toLocaleDateString('pl-PL')}, ${date
        //   .toLocaleTimeString('pl-PL')
        //   .slice(0, -3)}`
        //wdrożyć te funkcje w vehicle-report
        date.toLocaleDateString('pl-PL', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        })
      );
    });

    return formattedDates;
  }
}
