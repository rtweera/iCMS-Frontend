import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EmailAccEfficiencyResponse, InquiriesByEfficiencyEffectivenessResponse, IssuesByEfficiencyEffectivenessResponse, OngoingAndClosedStatsResponse, OverallyEfficiencyEffectivenessPecentagesResponse, OverdueIssuesResponse } from '../../interfaces/dashboard';
import { MenuItem } from 'primeng/api';
import { DataService } from '../../services/pop-up.performance-insights.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-performance-insights-dashboard',
  templateUrl: './performance-insights-dashboard.component.html',
  styleUrl: './performance-insights-dashboard.component.scss'
})
export class PerformanceInsightsDashboardComponent {

  breadcrumbItems: MenuItem[] = [
    {label: "Email Analytics"},
    {label: "Dashboard"},
    {label:"Performance Insights"}
  ];

  @Input() intervalInDaysStart!: number;
  @Input() intervalInDaysEnd!: number;
  @Input() isOpened!:boolean;
 
  rangeDates: Date[] | undefined;
  
  fromDate: Date | undefined;
  toDate: Date | undefined;

  minDate: Date = new Date();
  maxDate: Date = new Date();

  dntChartDataProgress: number[] = []
  dntChartProgressLabels: string[] = []
  isLoadingDCProgress : boolean = true;

  dntChartDataIssuesEfficiency: number[] = []
  dntChartIssuesEfficiencyLabels: string[] = []
  isLoadingDCIssuesEfficiency : boolean = true;

  dntChartDataIssuesEffeftiveness: number[] = []
  dntChartIssuesEffectivenessLabels: string[] = []
  isLoadingDCIssuesEffectiveness: boolean = true;

  dntChartDataInquiryEfficiency: number[] = []
  dntChartInquiryEfficiencyLabels: string[] = []
  isLoadingDCInquiryEfficiency : boolean = true;

  dntChartDataInquiryEffeftiveness: number[] = []
  dntChartInquiryEffectivenessLabels: string[] = []
  isLoadingDCInquiryEffectiveness: boolean = true;

  
  effi_dstri_vert_bar_labels: string[]=[]
  effi_distri_vert_var_issues_data: number[]=[]
  effi_distri_vert_var_inquiries_data: number[] =[]
  isLoadingEffiDistri: boolean = true;

  effect_dstri_vert_bar_labels: string[]=[]
  effect_distri_vert_var_issues_data: number[]=[]
  effect_distri_vert_var_inquiries_data: number[] =[]
  isLoadingEffectDistri: boolean = true;

  
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

  documentStyle = getComputedStyle(document.documentElement);

  private DataForStatCardsSubscription: Subscription | undefined;
  private CurrentOverallEfficiencyandEffectivenessSubscription: Subscription | undefined;
  private DataForEffiandEffecIssuesSubscription: Subscription | undefined;
  private DataForEffiandEffecInquiriesSubscription: Subscription | undefined;
  private DataForEfficiencyByEmailAccSubscription: Subscription | undefined;
  private OverdueIssuesdataSubscription: Subscription | undefined;
 
  constructor(private fb: FormBuilder, private http: HttpClient, private dataService: DataService) {}

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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['intervalInDaysStart'] || changes['intervalInDaysEnd']) && this.isOpened) {
      this.unsubscribeAll();
      this.subscribeALL();
    }

    if(changes['isOpened']){

      if(this.isOpened){
        this.subscribeALL();
      }else{
        this.unsubscribeAll();
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll()
  }
  
onRangeDatesChanged(rangeDates: Date[]) {
  this.rangeDates = rangeDates;
  
  console.log('Selected Range Dates:', this.rangeDates);
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
  this.unsubscribeAll()
  this.subscribeALL();
}


subscribeALL(){
  this.getDataForStatCards()
  //this.getDataForOverallEfficiencyandEffectivenessDntChart()
  this.getDataForEfficiencyDstriandEffectivenessDistri()
  this.getDataForEfficiencyByEmaiAcss()
  this.getOverdueIssuesdata()
}

unsubscribeAll(){
  this.DataForStatCardsSubscription?.unsubscribe();
  this.DataForEffiandEffecIssuesSubscription?.unsubscribe();
  this.DataForEffiandEffecInquiriesSubscription?.unsubscribe();
 // this.CurrentOverallEfficiencyandEffectivenessSubscription?.unsubscribe();
  this.DataForEfficiencyByEmailAccSubscription?.unsubscribe();
  this.OverdueIssuesdataSubscription?.unsubscribe();
}

getDataForStatCards(){
  this.isLoadingDCProgress = true
  this.DataForStatCardsSubscription = this.dataService.getDataForStatCards(this.intervalInDaysStart, this.intervalInDaysEnd).subscribe((data: OngoingAndClosedStatsResponse) => {
  // get data for the progress donought chart
  this.dntChartDataProgress = [data.ongoing_percentage, data.closed_percentage]
  this.dntChartProgressLabels = ["ongoing percentage", "closed percentage"]
  this.isLoadingDCProgress = false
 });
}

getDataForEfficiencyDstriandEffectivenessDistri(){
  this.isLoadingEffiDistri = true
  this.isLoadingEffectDistri = true
  
  let effi_issue_data: number[] = [] 
  let effec_issue_date: number[] = []
  this.DataForEffiandEffecIssuesSubscription = this.dataService.getDataForEffiandEffecIssues(this.intervalInDaysStart, this.intervalInDaysEnd).subscribe((data1: IssuesByEfficiencyEffectivenessResponse) => {
    console.log("PERFORMANCE INSIGHT: data for efficency and effectiveness of ISSUES DISTRIBUTION", data1)

    effi_issue_data = data1.efficiency_frequencies
    effec_issue_date = data1.effectiveness_frequencies

    this.DataForEffiandEffecInquiriesSubscription = this.dataService.getDataForEffiandEffecInquiries(this.intervalInDaysStart, this.intervalInDaysEnd).subscribe((data2: InquiriesByEfficiencyEffectivenessResponse) => {
      console.log("PERFORMANCE INSIGHTS: data for efficiency and effectiveness of INQUIRIES DISTRIBUTION", data2)
      

      this.effi_dstri_vert_bar_labels = data2.efficiency_categories
      this.effect_dstri_vert_bar_labels = data2.effectiveness_categories
      this.effi_distri_vert_var_inquiries_data = data2.efficiency_frequencies
      this.effect_distri_vert_var_inquiries_data = data2.effectiveness_frequencies
      this.effect_distri_vert_var_issues_data = effec_issue_date
      this.effi_distri_vert_var_issues_data = effi_issue_data

      this.isLoadingEffiDistri = false
      this.isLoadingEffectDistri = false
      });
       
   });  
}


getDataForEfficiencyByEmaiAcss(){
  this.isLoadingEffiByEmailAcc = true
  this.DataForEfficiencyByEmailAccSubscription = this.dataService.getDataForEfficiencyByEmailAcc(this.intervalInDaysStart, this.intervalInDaysEnd).subscribe((data: EmailAccEfficiencyResponse) => {
    this.email_acc_effi_labels = data.all_reading_email_accs
    this.email_acc_effi_dataset = [
      {
        type: 'bar',
        label: 'Inefficient Percentage',
        backgroundColor:  this.documentStyle.getPropertyValue('--inefficient-color'),
        data: data.ineff_percentages
      },
      {
        type: 'bar',
        label: 'Less Efficient Percentage',
        backgroundColor: this.documentStyle.getPropertyValue('--less-efficient-color'),
        data: data.less_eff_percentages
      },
      {
        type: 'bar',
        label: 'Moderately Efficient Percentage',
        backgroundColor:   this.documentStyle.getPropertyValue('--moderately-efficient-color'),
        data: data.mod_eff_percentages
      },
      {
        type: 'bar',
        label: 'High Efficient Percentage',
        backgroundColor: this.documentStyle.getPropertyValue('--highly-efficient-color'),
        data: data.highly_eff_percentages
      }
    ]
    this.isLoadingEffiByEmailAcc = false
  });
}

getOverdueIssuesdata(){
  this.isLoadingOverdueIssByEmailAcc = true
  this.isLoadingoverallOverdueIssuesCount = true

  this.dataService.getOverdueIssuesdata(this.intervalInDaysStart, this.intervalInDaysEnd).subscribe((data: OverdueIssuesResponse) => {
    this.overallOverdueIssuesHeader = `${data.sum_overdue_issues} OVERDUE ISSUES recorded`
    this.overallOverdueIssuesContent = `out of ${data.total_ongoing_issues} ongoing issues `
    
    this.overdueIssByEmailsLabels = data.all_reading_email_accs
    this.overdueIssByEmailsData = data.overdue_issues_count_per_each_email
    this.overdueIssByEmailsColors = []

    for (let i of this.overdueIssByEmailsLabels){
      this.overdueIssByEmailsColors.push(this.documentStyle.getPropertyValue('--issue-color'))
    }

    this.isLoadingoverallOverdueIssuesCount = false
    this.isLoadingOverdueIssByEmailAcc = false
   });
}
}
