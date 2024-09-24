import { Component, OnInit, SimpleChanges } from '@angular/core';
import { MenuItem } from "primeng/api";
import { GaugeChartResponse, 
  IssueInquiryFreqByProdcuts, 
  OngoingAndClosedStatsResponse, OverallyEfficiencyEffectivenessPecentagesResponse, 
  OverdueIssuesResponse, stat_card_single_response, TimeCardResponse } from '../../interfaces/dashboard';
import { DataService } from '../../services/dashboardMain.service';
import { Subscription } from 'rxjs';

interface TrendingTopic {
  text: string;
  frequency: number;
}

interface TrendingWord {
  word: string;
  weight: number;
  color: string
}
@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrl: './dashboard2.component.scss'
})
export class Dashboard2Component implements OnInit {
  breadcrumbItems: MenuItem[] = [
    {label: "Email Analytics"},
    {label: "Dashboard"}
  ];

  intervalInDaysStart: number = 29;
  intervalInDaysEnd: number = 0;

  // calenders

  rangeDates: Date[] = [new Date(), new Date()];
  
  fromDate: Date | undefined;
  toDate: Date | undefined;

  minDate: Date = new Date();
  maxDate: Date = new Date();
  
  // Topic cloud
  keywords: TrendingTopic[] = [];
  isLoadingTC: boolean = false;
  
  // overall sentiments donought chart inputs
  chartData: number[] = [];
  isLoadingDC: boolean = false;

  dntChartDataProgress: number[] = []
  dntChartProgressLabels: string[] = []
  isLoadingDCProgress : boolean = true;

  dntChartDataOverallEfficiency: number[] = []
  dntChartOverallEfficiencyLabels: string[] = []
  isLoadingDCOverallEfficiency : boolean = true;

  dntChartDataOverallEffeftiveness: number[] = []
  dntChartOverallEffectivenessLabels: string[] = []
  isLoadingDCOverallEffectiveness: boolean = true;

  
  effi_dstri_vert_bar_labels: string[]=[]
  effi_distri_vert_var_issues_data: number[]=[]
  effi_distri_vert_var_inquiries_data: number[] =[]
  isLoadingEffiDistri: boolean = true;

  effect_dstri_vert_bar_labels: string[]=[]
  effect_distri_vert_var_issues_data: number[]=[]
  effect_distri_vert_var_inquiries_data: number[] =[]
  isLoadingEffectDistri: boolean = true;

  issue_types_distri_labels: string[]=[]
  issue_types_distri_colors: any[]=[]
  issue_types_distri_data: number[]=[]
  isLoadingIssueTypes: boolean = true

  inquiry_types_distri_labels: string[]=[]
  inquiry_types_distri_colors: any[]=[]
  inquiry_types_distri_data: number[]=[]
  isLoadingInquiryTypes: boolean = true

  prodcuts_distri_of_issues_and_inquiries_labels: string[]=[]
  prodcuts_distri_of_issues_and_inquiries_datasets: any[]=[]
  isLoadingProductdistriOfIssuesnInquirires: boolean = true

  bestProduct!:string
  worstProduct!:string

  bestProductColor:string = 'var(--teal-400)'
  worstProductColor:string = 'var(--red-400)'

  isLoadingBestProduct:boolean = true
  isLoadingWorstProduct:boolean = true
  
  bestEmail!: string
  bestEmailColor:string = 'var(--indigo-400)'
  isLoadingBestPerfEmail:boolean = true


  email_acc_effi_labels: string[]=[]
  email_acc_effi_dataset: any[]=[]
  isLoadingEffiByEmailAcc: boolean = true

  overallOverdueIssuesHeader!: string
  overallOverdueIssuesContent!: string
  noOfOverdueIssuesColor = 'var(--red-400)'
  isLoadingoverallOverdueIssuesCount: boolean = true

  overdueIssByEmailsLabels: string[]=[]
  overdueIssByEmailsColors: any[]=[]
  overdueIssByEmailsData: number[]=[]
  isLoadingOverdueIssByEmailAcc: boolean = true

  // time card
  avgFirstResponseTime: number = 0;
  overdueCount: number = 0;
  emailLoad: number[] = [];
  firstResponseTimes: number[] = [];
  clientMsgTimes: string[] = [];
  isLoadingTimeCard: boolean = false;

  // wordcloudMostOccuringProblemTypes
  wordCloudData: TrendingWord[] = []
  isLoadingWCC: boolean = false;

  documentStyle = getComputedStyle(document.documentElement);
  
   // stat cards inputs
   statsData = [
    { title: 0, sub_title: 'total', header: 'Ongoing', subheader: 'issues', fontColor:this.documentStyle.getPropertyValue('--negative-color')},
    { title: 0, sub_title: 'total', header: 'Closed', subheader: 'issues', fontColor:this.documentStyle.getPropertyValue('--positive-color')},
    { title: 0, sub_title: 'total', header: 'Ongoing', subheader: 'inquiries', fontColor:this.documentStyle.getPropertyValue('--negative-color')},
    { title: 0, sub_title: 'total', header: 'Closed', subheader: 'inquiries', fontColor:this.documentStyle.getPropertyValue('--positive-color')}
    // Add more objects as needed
  ];
  isLoadingStatcards: boolean = true;
  isLoadingEmailCards: boolean = true;
  isLoadingGC: boolean = true
  EmailAccData: stat_card_single_response[] = []

  openedIssuesCount!:number 
  closedIssuesCount!:number 
  openedInquiriesCount!:number 
  closedInquiriesCount!:number 
  
  dataValue_forGaugeStart:number = 0
  products_labels!: string[]
  products_performance_scores!: number[]
  isProductPerformanceChart: boolean = true;
  
  private statCardsSubscription: Subscription | undefined;
  private DataForStatCardsSubscription: Subscription | undefined;
  private CurrentOverallEfficiencyandEffectivenessSubscription: Subscription | undefined;
  private DataForGaugeChartSubscription: Subscription | undefined;
  private DataForProductsByIssueandInquirySubscription: Subscription | undefined;
  private DataForTimeGraphSubscription: Subscription | undefined;
  private OverdueIssuesdataSubscription: Subscription | undefined;

  _isPerfInsightsOpened: boolean = false;
  isLoadingTimeGraphOverdue: boolean = true;

  set isPerfInsightsOpened(value: boolean) {
    this._isPerfInsightsOpened = value;
    if (value) {
      this.unsubscribeAll();
    }
  }

  get isPerfInsightsOpened(): boolean {
    return this._isPerfInsightsOpened;
  }
 
  constructor(private dataService: DataService) {}

  ngOnInit(): void { 
    // calendar configuration
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month -1;
    let prevYear = year;
    this.minDate = new Date();
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);
    this.maxDate = today;

    this.subscribeALL()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['intervalInDaysStart'] || changes['intervalInDaysEnd']) {
      this.unsubscribeAll();
      this.subscribeALL();
    }
  }

   ngOnDestroy(): void {
    this.unsubscribeAll()  
  }
  
  onRangeDatesChanged(rangeDates: Date[]) {
    this.rangeDates = rangeDates;
    // console.log('Selected Range Dates:', this.rangeDates);
    const endDate = rangeDates[1];
    const startDate = rangeDates[0];
    const today = new Date();

    // Ensure dates are in the same time zone for correct comparison
    const startDateMidnight = new Date(startDate.setHours(0, 0, 0, 0));
    const endDateMidnight = new Date(endDate.setHours(0, 0, 0, 0));
    const todayMidnight = new Date(today.setHours(0, 0, 0, 0));

    // Calculate the difference in milliseconds
    const differenceStartMs = todayMidnight.getTime() - startDateMidnight.getTime();
    const differenceEndMs = todayMidnight.getTime() - endDateMidnight.getTime();

    // Calculate the difference in days
    this.intervalInDaysStart = Math.floor(differenceStartMs / (1000 * 60 * 60 * 24))
    this.intervalInDaysEnd = Math.floor(differenceEndMs / (1000 * 60 * 60 * 24))

    this.unsubscribeAll();
    this.subscribeALL();
  }

  subscribeALL(){
    this.getDataForStatCards()
    this.getDataForEmailAccCards()
    this.getDataForOverallEfficiencyandEffectivenessDntChart()
    this.getDataForGaugeChart()
    this.getDataForIssuenadInquiryByProducts()
    this.getDataForTimeGraph()
  }

  unsubscribeAll(){
    this.statCardsSubscription?.unsubscribe();
    this.CurrentOverallEfficiencyandEffectivenessSubscription?.unsubscribe();
    this.DataForStatCardsSubscription?.unsubscribe();
    this.DataForGaugeChartSubscription?.unsubscribe();
    this.DataForProductsByIssueandInquirySubscription?.unsubscribe();
    this.DataForTimeGraphSubscription?.unsubscribe();
  }

  getDataForEmailAccCards(){
    this.isLoadingEmailCards = true;
    this.DataForStatCardsSubscription = this.dataService
      .getDataForEmailCards(this.intervalInDaysStart, this.intervalInDaysEnd)
      .subscribe((data:stat_card_single_response[]) => {
        this.EmailAccData = data;
        this.isLoadingEmailCards = false;
      });
  }

  getDataForStatCards(){
    this.statCardsSubscription =  this.dataService
      .getDataForStatCards(this.intervalInDaysStart, this.intervalInDaysEnd)
      .subscribe((data: OngoingAndClosedStatsResponse) => {
        this.openedIssuesCount = data.count_total_ongoing_issues
        this.closedIssuesCount = data.count_total_closed_issues
        this.openedInquiriesCount = data.count_total_ongoing_inquiries
        this.closedInquiriesCount = data.count_total_closed_inquiries

        // get data for the progress donought chart
        this.dntChartDataProgress = [data.ongoing_percentage, data.closed_percentage]
        this.dntChartProgressLabels = ["ongoing percentage", "closed percentage"]
        this.isLoadingDCProgress = false
      });
  this.isLoadingStatcards = false
  }

  getDataForOverallEfficiencyandEffectivenessDntChart(){
    this.CurrentOverallEfficiencyandEffectivenessSubscription = this.dataService
      .getCurrentOverallEfficiencyandEffectiveness(this.intervalInDaysStart, this.intervalInDaysEnd)
      .subscribe((data: OverallyEfficiencyEffectivenessPecentagesResponse) => {
        this.dntChartDataOverallEfficiency = data.efficiency_percentages
        this.dntChartOverallEfficiencyLabels= data.efficiency_categories.reverse()
        this.dntChartDataOverallEffeftiveness= data.effectiveness_percentages
        this.dntChartOverallEffectivenessLabels = data.effectiveness_categories.reverse()

        this.isLoadingDCOverallEfficiency = false
        this.isLoadingDCOverallEffectiveness = false
    });
  }


  getDataForIssuenadInquiryByProducts(){
    this.DataForProductsByIssueandInquirySubscription = this.dataService
      .getDataForProductsByIssueandInquiry(this.intervalInDaysStart, this.intervalInDaysEnd)
      .subscribe((data: IssueInquiryFreqByProdcuts) => {
        this.products_labels = data.product_labels
        this.products_performance_scores = data.performence_scores
        this.isProductPerformanceChart = false
    });
  }



  getDataForGaugeChart() {
    this.isLoadingGC = true; // Set loading indicator to true before making the request
    this.DataForGaugeChartSubscription = this.dataService
      .getDataForGaugeChart(this.intervalInDaysStart, this.intervalInDaysEnd)
      .subscribe((data: GaugeChartResponse) => {
        this.dataValue_forGaugeStart = data.value
        this.isLoadingGC = false;
      });
  }

  getDataForTimeGraph(){
    this.isLoadingTimeCard = true;
    this.DataForTimeGraphSubscription = this.dataService
      .getDataForTimeGraph(this.intervalInDaysStart, this.intervalInDaysEnd)
      .subscribe((data: TimeCardResponse) => {
        this.avgFirstResponseTime = data.avgFirstResponseTime;
        this.firstResponseTimes = data.firstResponseTimes;
        this.clientMsgTimes = data.clientMsgTimes;
        this.isLoadingTimeCard = false;
      });
    this.isLoadingTimeGraphOverdue = true;
    this.OverdueIssuesdataSubscription = this.dataService
      .getOverdueIssuesdata(this.intervalInDaysStart, this.intervalInDaysEnd)
      .subscribe((data: OverdueIssuesResponse) => {
        this.overdueCount = data.sum_overdue_issues
        this.isLoadingTimeGraphOverdue = false;
      });
  }
  
}
