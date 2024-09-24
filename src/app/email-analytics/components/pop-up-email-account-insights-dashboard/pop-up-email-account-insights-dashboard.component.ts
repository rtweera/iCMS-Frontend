import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { BestPerformingEmailAccResponse, EmailAccEfficiencyResponse, OverdueIssuesResponse, stat_card_single_response } from '../../interfaces/dashboard';
import { DataService } from '../../services/pop-up-email-account-insights-dashboard.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pop-up-email-account-insights-dashboard',
  templateUrl: './pop-up-email-account-insights-dashboard.component.html',
  styleUrl: './pop-up-email-account-insights-dashboard.component.scss'
})
export class PopUpEmailAccountInsightsDashboardComponent {
  breadcrumbItems: MenuItem[] = [
    {label: "Email Analytics"},
    {label: "Dashboard"},
    {label: "Account Insights"}
  ];

  @Input() intervalInDaysStart!: number;
  @Input() intervalInDaysEnd!: number;
  @Input() isOpened!:boolean;

  rangeDates: Date[] | undefined;
  
  fromDate: Date | undefined;
  toDate: Date | undefined;

  minDate: Date = new Date();
  maxDate: Date = new Date();
  

  
  bestEmail!: string
  bestEmailColor:string = 'var(--indigo-400)'
  isLoadingBestPerfEmail:boolean = true


  email_acc_effi_labels: string[]=[]
  email_acc_effi_dataset: any[]=[]
  isLoadingEffiByEmailAcc: boolean = true

  overdueIssByEmailsLabels: string[]=[]
  overdueIssByEmailsColors: any[]=[]
  overdueIssByEmailsData: number[]=[]
  isLoadingOverdueIssByEmailAcc: boolean = true
  
  // stat cards inputs
  statsData: stat_card_single_response[] = [
    { title: 540, sub_title: 'Total Emails', header: 'Customer Care', sentiment: 'Positive', imgPath: './email/mail_blue.png', sentiment_score: 0 },
    { title: 340, sub_title: 'Total Emails', header: 'Marketing', sentiment: 'Negative', imgPath: './email/mail_red.png', sentiment_score: 0 }
    // Add more objects as needed
  ];
  
    isLoadingStatCards: boolean = true;

  documentStyle = getComputedStyle(document.documentElement);

  private DataForStatCardsSubscription: Subscription | undefined;
  private DataForEfficiencyByEmaiAcssSubscription: Subscription | undefined;
  private BestPerformingEmailSubscription: Subscription | undefined;
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
      this.subscribeAll();
    }

    if(changes['isOpened']){
      if(this.isOpened){
        this.subscribeAll();
      }else{
        this.unsubscribeAll();
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  
onRangeDatesChanged(rangeDates: Date[]) {
  this.rangeDates = rangeDates;
  
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
  this.subscribeAll();
}


subscribeAll(){
  this.getDataForStatCards();
  this.getDataForEfficiencyByEmaiAcss();
  this.getOverdueIssuesdata();
}

unsubscribeAll(){
  this.DataForStatCardsSubscription?.unsubscribe();
  this.DataForEfficiencyByEmaiAcssSubscription?.unsubscribe();
  this.BestPerformingEmailSubscription?.unsubscribe();
  this.OverdueIssuesdataSubscription?.unsubscribe();
}

getDataForStatCards(){

  this.isLoadingStatCards = true

  this.DataForStatCardsSubscription = this.dataService.getDataForStatCards(this.intervalInDaysStart, this.intervalInDaysEnd).subscribe((data:stat_card_single_response[]) => {
  this.statsData = data

  this.isLoadingStatCards = false
     
 });

}

getDataForEfficiencyByEmaiAcss(){

  this.isLoadingEffiByEmailAcc = true

  this.DataForEfficiencyByEmaiAcssSubscription = this.dataService.getDataForEfficiencyByEmailAcc(this.intervalInDaysStart, this.intervalInDaysEnd).subscribe((data: EmailAccEfficiencyResponse) => {
    
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

getBestPerformingEmail(){
  this.BestPerformingEmailSubscription = this.dataService.getBestPerformingEmail(this.intervalInDaysStart, this.intervalInDaysEnd).subscribe((data: BestPerformingEmailAccResponse) => {
    this.bestEmail = data.best_performing_email_acc
    this.isLoadingBestPerfEmail = false
   });
}


getOverdueIssuesdata(){
  this.isLoadingOverdueIssByEmailAcc = true
  this.dataService.getOverdueIssuesdata(this.intervalInDaysStart, this.intervalInDaysEnd).subscribe((data: OverdueIssuesResponse) => {
    this.overdueIssByEmailsLabels = data.all_reading_email_accs
    this.overdueIssByEmailsData = data.overdue_issues_count_per_each_email
    this.overdueIssByEmailsColors = []
    for (let i of this.overdueIssByEmailsLabels){
      this.overdueIssByEmailsColors.push(this.documentStyle.getPropertyValue('--issue-color'))
    }
    this.isLoadingOverdueIssByEmailAcc = false
   });
}
}
