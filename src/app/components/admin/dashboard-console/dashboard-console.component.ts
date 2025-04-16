import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexTooltip,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
  ApexMarkers,
  ApexGrid,
} from 'ng-apexcharts';
import { DashboardService } from '../../../services/dashboard.service';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';


// Define a type for chart options to ensure plain objects
export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis?: ApexXAxis;
  colors?: string[];
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  legend?: ApexLegend;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  markers?: ApexMarkers;
  grid?: ApexGrid;
  labels?: string[];
};

@Component({
  selector: 'app-dashboard-console',
  templateUrl: './dashboard-console.component.html',
  styleUrls: ['./dashboard-console.component.css'],
  standalone: false,
})
export class DashboardConsoleComponent implements OnInit {
  @ViewChild('revenueChart') revenueChartComponent!: ChartComponent;
  @ViewChild('userChart') userChartComponent!: ChartComponent;
  @ViewChild('ordersChart') ordersChartComponent!: ChartComponent;
  @ViewChild('productChart') productChartComponent!: ChartComponent;

  currentDate = new Date();
  loading = true;
  orders: Order[] = [];
  stats: {
    totalOrders: number;
    activeOrders: number;
    cancelledOrders: number;
    totalUsers: number;
    totalAmount: number;
    totalProducts: number;
    inStockProducts: number;
    lowStockProducts: number;
    revenueByMonth: number[];
  } = {
    totalOrders: 0,
    activeOrders: 0,
    cancelledOrders: 0,
    totalUsers: 0,
    totalAmount: 0,
    totalProducts: 0,
    inStockProducts: 0,
    lowStockProducts: 0,
    revenueByMonth: [],
  };

  private _ordersChart: ChartOptions = {
    series: [0, 0] as ApexNonAxisChartSeries,
    chart: {
      type: 'donut',
      height: 350,
    },
    labels: ['Active', 'Cancelled'],
    colors: ['#FFA725', '#F87171'],
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },
    legend: {
      position: 'bottom',
    },
  };

  private _revenueChart: ChartOptions = {
    series: [{ name: 'Revenue', data: this.stats.revenueByMonth}] as ApexAxisChartSeries,
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    colors: ['#60A5FA'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy',
      },
    },
  };

  private _productChart: ChartOptions = {
    series: [0, 0] as ApexNonAxisChartSeries,
    chart: {
      type: 'pie',
      height: 350,
    },
    labels: ['In Stock', 'Low Stock'],
    colors: ['#FFA725', '#F87171'],
    dataLabels: {
      enabled: true,
    },
    legend: {
      position: 'bottom',
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  private _userChart: ChartOptions = {
    series: [{ name: 'Users', data: [0, 0, 0, 0, 0, 0] }] as ApexAxisChartSeries,
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    colors: ['#A78BFA'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 4,
    },
    grid: {
      borderColor: '#e0e0e0',
      strokeDashArray: 4,
    },
  };

  // Methods to provide plain objects to the template
  getOrdersChartSeries(): ApexNonAxisChartSeries {
    return this._ordersChart.series as ApexNonAxisChartSeries;
  }

  getOrdersChartChart(): ApexChart {
    return this._ordersChart.chart;
  }

  getOrdersChartLabels(): string[] {
    return this._ordersChart.labels || [];
  }

  getOrdersChartColors(): string[] {
    return this._ordersChart.colors || [];
  }

  getOrdersChartDataLabels(): ApexDataLabels {
    return this._ordersChart.dataLabels || { enabled: false };
  }

  getOrdersChartPlotOptions(): ApexPlotOptions {
    return this._ordersChart.plotOptions || {};
  }

  getOrdersChartLegend(): ApexLegend {
    return this._ordersChart.legend || {};
  }

  getRevenueChartSeries(): ApexAxisChartSeries {
    return this._revenueChart.series as ApexAxisChartSeries;
  }

  getRevenueChartChart(): ApexChart {
    return this._revenueChart.chart;
  }

  getRevenueChartXAxis(): ApexXAxis {
    return this._revenueChart.xaxis || {};
  }

  getRevenueChartColors(): string[] {
    return this._revenueChart.colors || [];
  }

  getRevenueChartDataLabels(): ApexDataLabels {
    return this._revenueChart.dataLabels || { enabled: false };
  }

  getRevenueChartStroke(): ApexStroke {
    return this._revenueChart.stroke || {};
  }

  getRevenueChartFill(): ApexFill {
    return this._revenueChart.fill || {};
  }

  getRevenueChartTooltip(): ApexTooltip {
    return this._revenueChart.tooltip || {};
  }

  getProductChartSeries(): ApexNonAxisChartSeries {
    return this._productChart.series as ApexNonAxisChartSeries;
  }

  getProductChartChart(): ApexChart {
    return this._productChart.chart;
  }

  getProductChartLabels(): string[] {
    return this._productChart.labels || [];
  }

  getProductChartColors(): string[] {
    return this._productChart.colors || [];
  }

  getProductChartDataLabels(): ApexDataLabels {
    return this._productChart.dataLabels || { enabled: false };
  }

  getProductChartLegend(): ApexLegend {
    return this._productChart.legend || {};
  }

  getProductChartResponsive(): ApexResponsive[] {
    return this._productChart.responsive || [];
  }

  getUserChartSeries(): ApexAxisChartSeries {
    return this._userChart.series as ApexAxisChartSeries;
  }

  getUserChartChart(): ApexChart {
    return this._userChart.chart;
  }

  getUserChartXAxis(): ApexXAxis {
    return this._userChart.xaxis || {};
  }

  getUserChartColors(): string[] {
    return this._userChart.colors || [];
  }

  getUserChartDataLabels(): ApexDataLabels {
    return this._userChart.dataLabels || { enabled: false };
  }

  getUserChartStroke(): ApexStroke {
    return this._userChart.stroke || {};
  }

  getUserChartMarkers(): ApexMarkers {
    return this._userChart.markers || {};
  }

  getUserChartGrid(): ApexGrid {
    return this._userChart.grid || {};
  }

  constructor(private dashboardService: DashboardService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = {
          ...data,
          revenueByMonth: data.revenueByMonth || new Array(6).fill(0),
        };
        this.updateCharts();
      },
      error: (err) => {
        console.error('Stats error:', err);
        this.stats.revenueByMonth = new Array(6).fill(0);
        this.updateCharts();
      },
    });

    this.orderService.getOrdersAdmin().subscribe({
      next: (data) => {
        this.orders = data;
        this.calculateMonthlyRevenue();
        this.loading = false;
      },
      error: (err) => {
        console.error('Orders error:', err);
        this.orders = [];
        this.stats.revenueByMonth = new Array(6).fill(0);
        this.updateCharts();
        this.loading = false;
      },
    });
  }

  calculateMonthlyRevenue() {
    const revenueByMonth = new Array(12).fill(0);
    this.orders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth();
      revenueByMonth[month] += order.totalAmount;
    });
    this.stats.revenueByMonth = revenueByMonth.slice(0, 6);
    this.updateCharts();
  }

  updateCharts(): void {
    this._ordersChart.series = [this.stats.activeOrders, this.stats.cancelledOrders] as ApexNonAxisChartSeries;
    this._productChart.series = [this.stats.inStockProducts, this.stats.lowStockProducts] as ApexNonAxisChartSeries;
    this._revenueChart.series = [{ name: 'Revenue', data: this.stats.revenueByMonth }] as ApexAxisChartSeries;
    this._userChart.series = [
      {
        name: 'Users',
        data: this.stats.totalUsers
          ? [
              this.stats.totalUsers,
              this.stats.totalUsers + 10,
              this.stats.totalUsers + 20,
              this.stats.totalUsers + 30,
              this.stats.totalUsers + 40,
              this.stats.totalUsers + 50,
            ]
          : [],
      },
    ] as ApexAxisChartSeries;

    // Force chart updates
    if (this.revenueChartComponent) {
      this.revenueChartComponent.updateSeries(this._revenueChart.series, true);
    }
    if (this.userChartComponent) {
      this.userChartComponent.updateSeries(this._userChart.series, true);
    }
    if (this.ordersChartComponent) {
      this.ordersChartComponent.updateSeries(this._ordersChart.series, true);
    }
    if (this.productChartComponent) {
      this.productChartComponent.updateSeries(this._productChart.series, true);
    }
  }
  exportToPDF(): void {
    setTimeout(() => {
      const dashboardElement = document.getElementById('dashboard-content');
      if (!dashboardElement) {
        console.error('Dashboard content element not found');
        return;
      }
  
      // Clone the element to avoid modifying the visible DOM
      const clone = dashboardElement.cloneNode(true) as HTMLElement;
      document.body.appendChild(clone);
  
      // Apply blanket style overrides to eliminate oklch
      const elements = clone.querySelectorAll('*');
      elements.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        // Force safe colors
        el.style.backgroundColor = el.style.backgroundColor || '#FFFFFF'; // White fallback
        el.style.color = el.style.color || '#000000'; // Black fallback
        el.style.borderColor = el.style.borderColor || '#000000'; // Black fallback
        // Log for debugging
        const style = getComputedStyle(el);
        if (style.backgroundColor.includes('oklch') || style.color.includes('oklch') || style.borderColor.includes('oklch')) {
          console.log('Overridden oklch element:', el, {
            backgroundColor: style.backgroundColor,
            color: style.color,
            borderColor: style.borderColor,
          });
        }
      });
  
      html2canvas(clone, { scale: 2, logging: true }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
  
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
  
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
  
        pdf.save('dashboard-report.pdf');
        document.body.removeChild(clone); // Clean up
      }).catch((error) => {
        console.error('Error generating PDF:', error);
        document.body.removeChild(clone);
      });
    }, 500);
  }
}