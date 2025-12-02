import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { curveMonotoneX } from 'd3-shape';

export interface ChartSeriesItem {
  name: string;
  value: number;
}

export interface ChartSeriesData {
  name: string;
  series: ChartSeriesItem[];
}

export interface ChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './progress-chart.html',
  styleUrls: ['./progress-chart.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressChart implements OnChanges {
  @Input() public data: ChartData[] = [];

  public chartData: ChartSeriesData[] = [];

  public showXAxis = true;
  public showYAxis = true;
  public showGridLines = true;
  public showXAxisLabel = true;
  public showYAxisLabel = true;
  public legend = false;
  public animations = true;
  public tooltipDisabled = false;
  public xAxisLabel: string = 'Time';
  public yAxisLabel: string = 'XP';
  public curve = curveMonotoneX;
  public gradient = true;

  public customColors: Color = {
    name: 'XP',
    domain: ['#4f46e5'],
    selectable: false,
    group: ScaleType.Ordinal,
  };

  public schemeType: ScaleType = ScaleType.Ordinal;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.chartData = this.formatDataForChart(this.data);
    }
  }

  private formatDataForChart(data: ChartData[]): ChartSeriesData[] {
    const series = data.map((item) => ({
      name: item.label,
      value: item.value,
    }));

    return [
      {
        name: 'AVERAGE XP',
        series,
      },
    ];
  }
}
